// Universal Real-Time Cloud Synchronization Service for Ghost Protocol
// High-speed PubSub & Server-Sent Events (SSE) relay enabling sub-second cross-device synchronization (PC <-> Mobile)

export interface DepositTranche {
  id: string;
  amount: number;
  timestamp: number;
}

export interface GlobalSyncPayload {
  accountsDb: Record<string, {
    email: string;
    passwordHash: string;
    boundWalletAddress: string | null;
    createdAt: number;
  }>;
  deposits: Record<string, number>;
  depositTranches?: Record<string, DepositTranche[]>;
  transactions?: Record<string, any[]>;
  unclaimedPrizes?: Record<string, any[]>;
  claimedPrizes?: Record<string, any[]>;
  yieldCheckpoints?: Record<string, { accrued: number; lastTime: number; balance: number }>;
  poolAccumulator?: { accrued: number; lastTime: number; lastTvl: number };
  activeEvent: {
    eventId: number;
    status: 'OPEN' | 'COMPUTING_FHE' | 'FINALIZED';
    startTime: number;
    endTime: number;
    rolloverCount?: number;
    prizeAmount: number;
    encryptedPrizeHandle: string;
    winnerAddress: string;
    randomnessCommitment: string;
    stateRoot: string;
    txHash: string;
    isVerified: boolean;
  };
  pastEvents: any[];
  prizePool: number;
  isReset?: boolean;
  lastUpdated: number;
}

const TOPIC = 'ghost_protocol_global_sync_v7';
const PUBLISH_URL = `https://ntfy.sh/${TOPIC}`;
const POLL_URL = `https://ntfy.sh/${TOPIC}/json?poll=1&since=all`;
const SSE_URL = `https://ntfy.sh/${TOPIC}/sse`;

const getBaselineStartTime = () => Math.floor(Date.now() / 86400000) * 86400000;

export const DEFAULT_PROTOCOL_SAVERS: Record<string, { balance: number; tranches: DepositTranche[] }> = {
  '0x71ca9b05934522934571a914856e3df17a94a28e': {
    balance: 12500,
    tranches: [
      { id: 'tranche_inst_1a', amount: 8000, timestamp: getBaselineStartTime() - 86400000 * 2 },
      { id: 'tranche_inst_1b', amount: 4500, timestamp: getBaselineStartTime() - 86400000 }
    ]
  },
  '0x3a9d8f110b8c575d4e3a91dd014857d4b62f402a': {
    balance: 8400,
    tranches: [
      { id: 'tranche_inst_2', amount: 8400, timestamp: getBaselineStartTime() - 86400000 * 3 }
    ]
  },
  '0x89d11c0834b76921389d66ac8b41e97d10b411c0': {
    balance: 15000,
    tranches: [
      { id: 'tranche_inst_3', amount: 15000, timestamp: getBaselineStartTime() - 86400000 * 4 }
    ]
  },
  '0x4efd831b91e362c45163d99026ac123e449ad831': {
    balance: 6200,
    tranches: [
      { id: 'tranche_inst_4', amount: 6200, timestamp: getBaselineStartTime() - 86400000 * 1 }
    ]
  }
};

export const DEFAULT_BASE_DEPOSITS: Record<string, number> = Object.fromEntries(
  Object.entries(DEFAULT_PROTOCOL_SAVERS).map(([addr, s]) => [addr, s.balance])
);

export const DEFAULT_BASE_TRANCHES: Record<string, DepositTranche[]> = Object.fromEntries(
  Object.entries(DEFAULT_PROTOCOL_SAVERS).map(([addr, s]) => [addr, s.tranches])
);

export const DEFAULT_PAST_EVENTS: any[] = [];

let cachedState: GlobalSyncPayload = {
  accountsDb: {},
  deposits: { ...DEFAULT_BASE_DEPOSITS },
  depositTranches: { ...DEFAULT_BASE_TRANCHES },
  transactions: {},
  unclaimedPrizes: {},
  claimedPrizes: {},
  yieldCheckpoints: {},
  poolAccumulator: { accrued: 0, lastTime: Date.now(), lastTvl: 42100 },
  activeEvent: {
    eventId: 1,
    status: 'OPEN',
    startTime: getBaselineStartTime(),
    endTime: getBaselineStartTime() + 3600000 * 24,
    prizeAmount: 0,
    encryptedPrizeHandle: '0x0000000000000000000000000000000000000000000000000000000000000000',
    winnerAddress: 'Pending Onchain Draw',
    randomnessCommitment: '',
    stateRoot: '',
    txHash: '',
    isVerified: false,
  },
  pastEvents: [...DEFAULT_PAST_EVENTS],
  prizePool: 0,
  lastUpdated: Date.now(),
};

type StateListener = (state: GlobalSyncPayload) => void;
const listeners: Set<StateListener> = new Set();

export function getCachedAccounts(): Record<string, any> {
  return cachedState.accountsDb || {};
}

export function subscribeToGlobalState(callback: StateListener): () => void {
  listeners.add(callback);
  callback(cachedState);
  return () => {
    listeners.delete(callback);
  };
}

let notifyTimeout: any = null;
function notifyListeners() {
  if (notifyTimeout) return;
  notifyTimeout = setTimeout(() => {
    notifyTimeout = null;
    for (const cb of listeners) {
      try {
        cb(cachedState);
      } catch {
        // Ignore
      }
    }
  }, 40);
}

// Ingest and merge message into cachedState
function processMessage(msgStr: string, shouldNotify: boolean = true) {
  try {
    const parsed = JSON.parse(msgStr);
    if (!parsed || typeof parsed !== 'object') return;

    if (parsed.isReset) {
      cachedState.deposits = parsed.deposits || {};
      cachedState.transactions = parsed.transactions || {};
      cachedState.unclaimedPrizes = {};
      cachedState.claimedPrizes = {};
      cachedState.yieldCheckpoints = {};
      cachedState.poolAccumulator = { accrued: 0, lastTime: Date.now(), lastTvl: 0 };
      cachedState.activeEvent = parsed.activeEvent || cachedState.activeEvent;
      cachedState.pastEvents = parsed.pastEvents || [];
      cachedState.prizePool = 0;
      cachedState.lastUpdated = parsed.lastUpdated || Date.now();
      if (shouldNotify) notifyListeners();
      return;
    }

    if (parsed.accountsDb && typeof parsed.accountsDb === 'object') {
      for (const email in parsed.accountsDb) {
        if (!email) continue;
        const incoming = parsed.accountsDb[email];
        const existing = cachedState.accountsDb[email];
        if (!existing) {
          cachedState.accountsDb[email] = incoming;
        } else {
          cachedState.accountsDb[email] = {
            email: incoming.email || existing.email,
            passwordHash: existing.passwordHash || incoming.passwordHash,
            // Non-destructive merge: preserve existing bound wallet if incoming is null
            boundWalletAddress: incoming.boundWalletAddress || existing.boundWalletAddress || null,
            createdAt: Math.min(incoming.createdAt || Date.now(), existing.createdAt || Date.now()),
          };
        }
      }
    }
    if (parsed.deposits) {
      cachedState.deposits = { ...cachedState.deposits, ...parsed.deposits };
      try {
        localStorage.setItem('ghost_global_deposits', JSON.stringify(cachedState.deposits));
      } catch {
        // Ignore
      }
    }
    if (parsed.depositTranches && typeof parsed.depositTranches === 'object') {
      cachedState.depositTranches = { ...(cachedState.depositTranches || {}), ...parsed.depositTranches };
      try {
        localStorage.setItem('ghost_global_tranches', JSON.stringify(cachedState.depositTranches));
      } catch {
        // Ignore
      }
    }
    if (parsed.transactions) {
      cachedState.transactions = { ...cachedState.transactions, ...parsed.transactions };
    }
    if (parsed.unclaimedPrizes) {
      cachedState.unclaimedPrizes = { ...cachedState.unclaimedPrizes, ...parsed.unclaimedPrizes };
    }
    if (parsed.claimedPrizes) {
      cachedState.claimedPrizes = { ...cachedState.claimedPrizes, ...parsed.claimedPrizes };
    }
    if (parsed.yieldCheckpoints && typeof parsed.yieldCheckpoints === 'object') {
      cachedState.yieldCheckpoints = { ...cachedState.yieldCheckpoints, ...parsed.yieldCheckpoints };
    }
    if (parsed.poolAccumulator && typeof parsed.poolAccumulator.accrued === 'number') {
      cachedState.poolAccumulator = parsed.poolAccumulator;
    }
    if (parsed.activeEvent && typeof parsed.activeEvent.eventId === 'number') {
      if (parsed.activeEvent.eventId >= cachedState.activeEvent.eventId) {
        cachedState.activeEvent = { ...cachedState.activeEvent, ...parsed.activeEvent };
      }
    }
    if (Array.isArray(parsed.pastEvents) && parsed.pastEvents.length > 0) {
      cachedState.pastEvents = parsed.pastEvents;
    }
    if (typeof parsed.prizePool === 'number') {
      cachedState.prizePool = Math.max(cachedState.prizePool, parsed.prizePool);
    }
    cachedState.lastUpdated = parsed.lastUpdated || Date.now();
    if (shouldNotify) notifyListeners();
  } catch {
    // Ignore
  }
}

// Initial backlog poll across current and historical topics
if (typeof window !== 'undefined') {
  const pollUrls = [
    POLL_URL,
    'https://ntfy.sh/ghost_protocol_global_sync_v6/json?poll=1&since=all'
  ];

  pollUrls.forEach((url) => {
    fetch(url)
      .then((r) => r.text())
      .then((text) => {
        const lines = text.trim().split('\n');
        for (const line of lines) {
          if (!line) continue;
          try {
            const item = JSON.parse(line);
            if (item.message) processMessage(item.message, false);
          } catch {
            // Ignore
          }
        }
        notifyListeners();
      })
      .catch(() => {});
  });

  // Realtime SSE Stream connecting all devices
  try {
    const es = new EventSource(SSE_URL);
    es.onmessage = (event) => {
      try {
        const item = JSON.parse(event.data);
        if (item.message) {
          processMessage(item.message, true);
        }
      } catch {
        // Ignore
      }
    };
  } catch (err) {
    console.warn('[CloudSync] SSE initialization fallback:', err);
  }
}

export async function fetchGlobalCloudState(): Promise<GlobalSyncPayload> {
  if (typeof window !== 'undefined') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(POLL_URL, { signal: controller.signal }).catch(() => null);
      clearTimeout(timeoutId);
      if (res && res.ok) {
        const text = await res.text().catch(() => '');
        const lines = text.trim().split('\n');
        for (const line of lines) {
          if (!line) continue;
          try {
            const item = JSON.parse(line);
            if (item.message) processMessage(item.message, false);
          } catch {
            // Ignore
          }
        }
        notifyListeners();
      }
    } catch {
      // Ignore
    }
  }
  return cachedState;
}

export async function pushGlobalCloudState(partialState: Partial<GlobalSyncPayload>): Promise<boolean> {
  try {
    const payload = {
      ...partialState,
      lastUpdated: Date.now(),
    };

    // Update local cache immediately
    processMessage(JSON.stringify(payload));

    // Broadcast over high-speed pubsub relay to all devices
    await fetch(PUBLISH_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return true;
  } catch (err) {
    console.warn('[CloudSync] Broadcast failed:', err);
    return false;
  }
}
