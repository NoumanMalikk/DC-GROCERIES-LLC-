import { promises as fs } from "fs";
import path from "path";
import type { Order, OrderStatus } from "@/lib/orders";

const memoryStore = new Map<string, Order>();
const sessionIndex = new Map<string, string>();
const idempotencyIndex = new Map<
  string,
  { sessionId: string; orderReference: string; url: string }
>();

let loaded = false;

const DATA_DIR = path.join(process.cwd(), ".data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

interface PersistedData {
  orders: Order[];
  sessionIndex: Record<string, string>;
  idempotencyIndex: Record<
    string,
    { sessionId: string; orderReference: string; url: string }
  >;
}

async function ensureLoaded(): Promise<void> {
  if (loaded) return;

  try {
    const raw = await fs.readFile(ORDERS_FILE, "utf-8");
    const data = JSON.parse(raw) as PersistedData;

    for (const order of data.orders ?? []) {
      memoryStore.set(order.reference, order);
    }

    for (const [sessionId, ref] of Object.entries(data.sessionIndex ?? {})) {
      sessionIndex.set(sessionId, ref);
    }

    for (const [key, value] of Object.entries(data.idempotencyIndex ?? {})) {
      idempotencyIndex.set(key, value);
    }
  } catch {
    // File does not exist yet - start with empty store.
  }

  loaded = true;
}

async function persist(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });

  const data: PersistedData = {
    orders: Array.from(memoryStore.values()),
    sessionIndex: Object.fromEntries(sessionIndex.entries()),
    idempotencyIndex: Object.fromEntries(idempotencyIndex.entries()),
  };

  await fs.writeFile(ORDERS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function saveOrder(order: Order): Promise<Order> {
  await ensureLoaded();
  memoryStore.set(order.reference, order);

  if (order.stripeSessionId) {
    sessionIndex.set(order.stripeSessionId, order.reference);
  }

  await persist();
  return order;
}

export async function getOrderByReference(
  reference: string
): Promise<Order | null> {
  await ensureLoaded();
  return memoryStore.get(reference) ?? null;
}

export async function getOrderBySessionId(
  sessionId: string
): Promise<Order | null> {
  await ensureLoaded();
  const ref = sessionIndex.get(sessionId);
  if (!ref) return null;
  return memoryStore.get(ref) ?? null;
}

export async function findOrderByEmailAndReference(
  email: string,
  reference: string
): Promise<Order | null> {
  const order = await getOrderByReference(reference);
  if (!order) return null;

  if (order.customer.email.toLowerCase() !== email.trim().toLowerCase()) {
    return null;
  }

  return order;
}

export async function updateOrder(
  reference: string,
  patch: Partial<Order> & { status?: OrderStatus }
): Promise<Order | null> {
  const order = await getOrderByReference(reference);
  if (!order) return null;

  const updated: Order = {
    ...order,
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  return saveOrder(updated);
}

export async function getIdempotentCheckout(
  key: string
): Promise<{ sessionId: string; orderReference: string; url: string } | null> {
  await ensureLoaded();
  return idempotencyIndex.get(key) ?? null;
}

export async function saveIdempotentCheckout(
  key: string,
  value: { sessionId: string; orderReference: string; url: string }
): Promise<void> {
  await ensureLoaded();
  idempotencyIndex.set(key, value);
  await persist();
}

/** Clears in-memory store - for tests only. */
export function resetOrderStore(): void {
  memoryStore.clear();
  sessionIndex.clear();
  idempotencyIndex.clear();
  loaded = false;
}
