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

const TOPIC = 'ghost_protocol_global_sync_v4';
const PUBLISH_URL = `https://ntfy.sh/${TOPIC}`;
const POLL_URL = `https://ntfy.sh/${TOPIC}/json?poll=1&since=24h`;
const SSE_URL = `https://ntfy.sh/${TOPIC}/sse`;

const DEFAULT_START_TIME = 1725436800000;

let cachedState: GlobalSyncPayload = {
  accountsDb: {},
  deposits: {},
  transactions: {},
  unclaimedPrizes: {},
  claimedPrizes: {},
  yieldCheckpoints: {},
  poolAccumulator: { accrued: 0, lastTime: Date.now(), lastTvl: 0 },
  activeEvent: {
    eventId: 1,
    status: 'OPEN',
    startTime: DEFAULT_START_TIME,
    endTime: DEFAULT_START_TIME + 3600000 * 24,
    prizeAmount: 0,
    encryptedPrizeHandle: '0x0000000000000000000000000000000000000000000000000000000000000000',
    winnerAddress: 'Pending Onchain Draw',
    randomnessCommitment: '',
    stateRoot: '',
    txHash: '',
    isVerified: false,
  },
  pastEvents: [],
  prizePool: 0,
  lastUpdated: Date.now(),
};

type StateListener = (state: GlobalSyncPayload) => void;
const listeners: Set<StateListener> = new Set();

export function subscribeToGlobalState(callback: StateListener): () => void {
  listeners.add(callback);
  callback(cachedState);
  return () => {
    listeners.delete(callback);
  };
}

function notifyListeners() {
  for (const cb of listeners) {
    try {
      cb(cachedState);
    } catch {
      // Ignore
    }
  }
}

// Ingest and merge message into cachedState
function processMessage(msgStr: string) {
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
      notifyListeners();
      return;
    }

    if (parsed.accountsDb) {
      cachedState.accountsDb = { ...cachedState.accountsDb, ...parsed.accountsDb };
    }
    if (parsed.deposits) {
      cachedState.deposits = { ...cachedState.deposits, ...parsed.deposits };
    }
    if (parsed.depositTranches && typeof parsed.depositTranches === 'object') {
      cachedState.depositTranches = { ...(cachedState.depositTranches || {}), ...parsed.depositTranches };
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
    notifyListeners();
  } catch {
    // Ignore
  }
}

// Initial backlog poll
if (typeof window !== 'undefined') {
  fetch(POLL_URL)
    .then((r) => r.text())
    .then((text) => {
      const lines = text.trim().split('\n');
      for (const line of lines) {
        if (!line) continue;
        try {
          const item = JSON.parse(line);
          if (item.message) processMessage(item.message);
        } catch {
          // Ignore
        }
      }
    })
    .catch(() => {});

  // Realtime SSE Stream connecting all devices
  try {
    const es = new EventSource(SSE_URL);
    es.onmessage = (event) => {
      try {
        const item = JSON.parse(event.data);
        if (item.message) {
          processMessage(item.message);
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
