// Global Cloud Synchronization Service for Ghost Protocol
// Enables cross-device (Desktop <-> Mobile <-> Tablet) real-time state synchronization

export interface GlobalSyncPayload {
  accountsDb: Record<string, {
    email: string;
    passwordHash: string;
    boundWalletAddress: string | null;
    createdAt: number;
  }>;
  deposits: Record<string, number>;
  activeEvent: {
    eventId: number;
    status: 'OPEN' | 'COMPUTING_FHE' | 'FINALIZED';
    startTime: number;
    endTime: number;
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
  lastUpdated: number;
}

const CLOUD_OBJECT_ID = 'ff808181a067127101a06b4d290f0d21';
const CLOUD_ENDPOINT = `https://api.restful-api.dev/objects/${CLOUD_OBJECT_ID}`;

let isSyncing = false;
let lastSyncedData: GlobalSyncPayload | null = null;

export async function fetchGlobalCloudState(): Promise<GlobalSyncPayload | null> {
  try {
    const res = await fetch(CLOUD_ENDPOINT, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json && json.data) {
      lastSyncedData = json.data as GlobalSyncPayload;
      return json.data;
    }
    return null;
  } catch (err) {
    console.warn('[CloudSync] Fetch failed, fallback to local state:', err);
    return null;
  }
}

export async function pushGlobalCloudState(partialState: Partial<GlobalSyncPayload>): Promise<boolean> {
  if (isSyncing) return false;
  isSyncing = true;
  try {
    const current = lastSyncedData || await fetchGlobalCloudState() || {
      accountsDb: {},
      deposits: {},
      activeEvent: {
        eventId: 1,
        status: 'OPEN',
        startTime: Date.now() - 3600000 * 2,
        endTime: Date.now() + 3600000 * 22,
        prizeAmount: 0,
        encryptedPrizeHandle: '',
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

    const merged: GlobalSyncPayload = {
      accountsDb: { ...current.accountsDb, ...(partialState.accountsDb || {}) },
      deposits: { ...current.deposits, ...(partialState.deposits || {}) },
      activeEvent: partialState.activeEvent ? { ...current.activeEvent, ...partialState.activeEvent } : current.activeEvent,
      pastEvents: partialState.pastEvents || current.pastEvents || [],
      prizePool: typeof partialState.prizePool === 'number' ? partialState.prizePool : current.prizePool,
      lastUpdated: Date.now(),
    };

    lastSyncedData = merged;

    await fetch(CLOUD_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'ghost_protocol_global_state_v1',
        data: merged,
      }),
    });

    return true;
  } catch (err) {
    console.warn('[CloudSync] Push failed:', err);
    return false;
  } finally {
    isSyncing = false;
  }
}
