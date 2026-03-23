import {
  sanitizeString,
  isValidName,
  isValidDob,
  isFiniteNumber,
  stripPrototypeKeys,
} from "@/server/lib/sanitize";

describe("sanitizeString", () => {
  it("strips HTML tags", () => {
    expect(sanitizeString("<script>alert('xss')</script>")).toBe("alert('xss')");
  });

  it("strips nested and mixed HTML tags", () => {
    expect(sanitizeString("<div><b>hello</b></div>")).toBe("hello");
  });

  it("truncates at maxLength", () => {
    const long = "a".repeat(600);
    expect(sanitizeString(long, 100)).toHaveLength(100);
  });

  it("trims whitespace", () => {
    expect(sanitizeString("  hello  ")).toBe("hello");
  });

  it("uses default maxLength of 500", () => {
    const long = "b".repeat(600);
    expect(sanitizeString(long)).toHaveLength(500);
  });
});

describe("isValidName", () => {
  it("accepts standard names", () => {
    expect(isValidName("John")).toBe(true);
    expect(isValidName("Mary Jane")).toBe(true);
  });

  it("accepts names with apostrophes", () => {
    expect(isValidName("John O'Brien")).toBe(true);
  });

  it("accepts hyphenated names", () => {
    expect(isValidName("Mary-Jane")).toBe(true);
  });

  it("accepts names with periods", () => {
    expect(isValidName("Dr. Smith")).toBe(true);
  });

  it("rejects SQL injection attempts", () => {
    expect(isValidName("'; DROP TABLE --")).toBe(false);
  });

  it("rejects names with numbers", () => {
    expect(isValidName("John123")).toBe(false);
  });

  it("rejects names with special characters", () => {
    expect(isValidName("name@home")).toBe(false);
    expect(isValidName("name!")).toBe(false);
    expect(isValidName("name#1")).toBe(false);
  });

  it("rejects empty strings", () => {
    expect(isValidName("")).toBe(false);
    expect(isValidName("   ")).toBe(false);
  });
});

describe("isValidDob", () => {
  it("accepts valid dates", () => {
    const result = isValidDob("1990-06-15");
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(1990);
    expect(result!.getMonth()).toBe(5); // 0-indexed
    expect(result!.getDate()).toBe(15);
  });

  it("accepts leap year Feb 29", () => {
    const result = isValidDob("2000-02-29");
    expect(result).toBeInstanceOf(Date);
    expect(result!.getMonth()).toBe(1);
    expect(result!.getDate()).toBe(29);
  });

  it("rejects future dates", () => {
    expect(isValidDob("2099-01-01")).toBeNull();
  });

  it("rejects dates before 1900", () => {
    expect(isValidDob("1899-01-01")).toBeNull();
  });

  it("rejects invalid day for month", () => {
    expect(isValidDob("2024-02-30")).toBeNull();
  });

  it("rejects invalid month", () => {
    expect(isValidDob("2024-13-01")).toBeNull();
  });

  it("rejects non-leap year Feb 29", () => {
    expect(isValidDob("2023-02-29")).toBeNull();
  });

  it("rejects malformed formats", () => {
    expect(isValidDob("06-15-1990")).toBeNull();
    expect(isValidDob("1990/06/15")).toBeNull();
    expect(isValidDob("not-a-date")).toBeNull();
  });
});

describe("isFiniteNumber", () => {
  it("accepts zero", () => {
    expect(isFiniteNumber(0)).toBe(true);
  });

  it("accepts negative numbers", () => {
    expect(isFiniteNumber(-1)).toBe(true);
  });

  it("accepts decimals", () => {
    expect(isFiniteNumber(3.14)).toBe(true);
  });

  it("rejects NaN", () => {
    expect(isFiniteNumber(NaN)).toBe(false);
  });

  it("rejects Infinity", () => {
    expect(isFiniteNumber(Infinity)).toBe(false);
    expect(isFiniteNumber(-Infinity)).toBe(false);
  });

  it("rejects string numbers", () => {
    expect(isFiniteNumber("5")).toBe(false);
  });

  it("rejects null", () => {
    expect(isFiniteNumber(null)).toBe(false);
  });

  it("rejects undefined", () => {
    expect(isFiniteNumber(undefined)).toBe(false);
  });
});

describe("stripPrototypeKeys", () => {
  it("removes __proto__ from objects", () => {
    const input = JSON.parse('{"name": "test", "__proto__": {"isAdmin": true}}');
    const result = stripPrototypeKeys(input);
    expect(result).toEqual({ name: "test" });
    expect(Object.hasOwn(result, "__proto__")).toBe(false);
  });

  it("removes __proto__ from nested objects", () => {
    const input = JSON.parse(
      '{"data": {"__proto__": {"polluted": true}, "value": 1}}'
    );
    const result = stripPrototypeKeys(input);
    expect(result).toEqual({ data: { value: 1 } });
  });

  it("removes constructor and prototype keys", () => {
    const input = { constructor: "evil", prototype: "bad", safe: "ok" };
    const result = stripPrototypeKeys(input);
    expect(result).toEqual({ safe: "ok" });
  });

  it("handles arrays", () => {
    const input = [{ __proto__: { bad: true }, ok: 1 }];
    const parsed = JSON.parse(JSON.stringify(input));
    const result = stripPrototypeKeys(parsed);
    expect(result).toEqual([{ ok: 1 }]);
  });

  it("returns primitives unchanged", () => {
    expect(stripPrototypeKeys("hello")).toBe("hello");
    expect(stripPrototypeKeys(42)).toBe(42);
    expect(stripPrototypeKeys(null)).toBeNull();
  });
});
