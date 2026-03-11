const { db, chain } = vi.hoisted(() => {
  const _chain = {
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
  for (const key of Object.keys(_chain) as (keyof typeof _chain)[]) {
    _chain[key].mockReturnValue(_chain);
  }
  const _db = vi.fn(() => _chain) as unknown as ReturnType<typeof vi.fn> & {
    raw: ReturnType<typeof vi.fn>;
    fn: { now: ReturnType<typeof vi.fn> };
  };
  _db.raw = _chain.raw;
  _db.fn = { now: vi.fn(() => "NOW()") };
  return { db: _db, chain: _chain };
});

vi.mock("@/server/db/knex", () => ({
  default: db,
}));

import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 when database is connected", async () => {
    chain.raw.mockResolvedValue({ rows: [{ "?column?": 1 }] });

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.status).toBe("ok");
    expect(data.database).toBe("connected");
  });

  it("returns 503 when database is disconnected", async () => {
    chain.raw.mockRejectedValue(new Error("Connection refused"));

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(503);
    expect(data.status).toBe("error");
    expect(data.database).toBe("disconnected");
  });
});
