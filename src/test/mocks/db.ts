import { vi } from "vitest";

type MockChain = {
  select: ReturnType<typeof vi.fn>;
  where: ReturnType<typeof vi.fn>;
  first: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  orderBy: ReturnType<typeof vi.fn>;
  returning: ReturnType<typeof vi.fn>;
  raw: ReturnType<typeof vi.fn>;
};

export function createMockDb() {
  const chain: MockChain = {
    select: vi.fn(),
    where: vi.fn(),
    first: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    orderBy: vi.fn(),
    returning: vi.fn(),
    raw: vi.fn(),
  };

  // Each method returns the chain for fluent API
  for (const key of Object.keys(chain) as (keyof MockChain)[]) {
    chain[key].mockReturnValue(chain);
  }

  const db = vi.fn(() => chain) as unknown as ReturnType<typeof vi.fn> & {
    raw: ReturnType<typeof vi.fn>;
    fn: { now: ReturnType<typeof vi.fn> };
  };
  db.raw = chain.raw;
  db.fn = { now: vi.fn(() => "NOW()") };

  return { db, chain };
}
