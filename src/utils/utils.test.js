/**
 * Mock graphqlClient to prevent Apollo Client initialization errors.
 * This allows tests that import modules dependent on graphqlClient to run successfully.
 */
import { removeSquareBracketsFromString, toTitleCase } from "./utils";

jest.mock("../utils/graphqlClient", () => ({
  client: {
    query: jest.fn(),
    mutate: jest.fn(),
  },
}));

describe("removeSquareBracketsFromString", () => {
  it("should remove square brackets from a string with brackets", () => {
    const input = "[Gemtuzumab ozogamicin, Bicalutamide]";
    const expected = "Gemtuzumab ozogamicin, Bicalutamide";
    expect(removeSquareBracketsFromString(input)).toBe(expected);
  });

  it("should remove only opening bracket", () => {
    const input = "[Hello World";
    const expected = "Hello World";
    expect(removeSquareBracketsFromString(input)).toBe(expected);
  });

  it("should remove only closing bracket", () => {
    const input = "Hello World]";
    const expected = "Hello World";
    expect(removeSquareBracketsFromString(input)).toBe(expected);
  });

  it("should remove multiple pairs of brackets", () => {
    const input = "[First] and [Second]";
    const expected = "First and Second";
    expect(removeSquareBracketsFromString(input)).toBe(expected);
  });

  it("should return the same string if no brackets present", () => {
    const input = "No brackets here";
    const expected = "No brackets here";
    expect(removeSquareBracketsFromString(input)).toBe(expected);
  });

  it("should handle empty string", () => {
    const input = "";
    const expected = "";
    expect(removeSquareBracketsFromString(input)).toBe(expected);
  });

  it("should handle string with only brackets", () => {
    const input = "[]";
    const expected = "";
    expect(removeSquareBracketsFromString(input)).toBe(expected);
  });

  it("should handle nested brackets", () => {
    const input = "[[nested]]";
    const expected = "nested";
    expect(removeSquareBracketsFromString(input)).toBe(expected);
  });
});

describe("toTitleCase", () => {
  describe("All values should be converted to proper title case", () => {
    it("should convert 'DEAD' to 'Dead'", () => {
      const input = "DEAD";
      const expected = "Dead";
      expect(toTitleCase(input)).toBe(expected);
    });

    it("should convert 'ALIVE' to 'Alive'", () => {
      const input = "ALIVE";
      const expected = "Alive";
      expect(toTitleCase(input)).toBe(expected);
    });

    it("should convert 'UNKNOWN' to 'Unknown'", () => {
      const input = "UNKNOWN";
      const expected = "Unknown";
      expect(toTitleCase(input)).toBe(expected);
    });

    it("should keep 'Dead' as 'Dead'", () => {
      const input = "Dead";
      const expected = "Dead";
      expect(toTitleCase(input)).toBe(expected);
    });

    it("should convert 'Alive with No Evidence of Disease' to proper title case", () => {
      const input = "Alive with No Evidence of Disease";
      const expected = "Alive with No Evidence of Disease";
      expect(toTitleCase(input)).toBe(expected);
    });

    it("should convert 'ALIVE WITH NO EVIDENCE OF DISEASE' to proper title case", () => {
      const input = "ALIVE WITH NO EVIDENCE OF DISEASE";
      const expected = "Alive with No Evidence of Disease";
      expect(toTitleCase(input)).toBe(expected);
    });

    it("should convert 'alive with no evidence of disease' to proper title case", () => {
      const input = "alive with no evidence of disease";
      const expected = "Alive with No Evidence of Disease";
      expect(toTitleCase(input)).toBe(expected);
    });

    it("should convert 'Alive with Disease' to proper title case", () => {
      const input = "Alive with Disease";
      const expected = "Alive with Disease";
      expect(toTitleCase(input)).toBe(expected);
    });

    it("should convert 'ALIVE WITH DISEASE' to proper title case", () => {
      const input = "ALIVE WITH DISEASE";
      const expected = "Alive with Disease";
      expect(toTitleCase(input)).toBe(expected);
    });

    it("should convert 'Alive, Disease Status Unknown' to proper title case", () => {
      const input = "Alive, Disease Status Unknown";
      const expected = "Alive, Disease Status Unknown";
      expect(toTitleCase(input)).toBe(expected);
    });
  });

  describe("Edge cases", () => {
    it("should handle null values", () => {
      const input = null;
      expect(toTitleCase(input)).toBe(null);
    });

    it("should handle undefined values", () => {
      const input = undefined;
      expect(toTitleCase(input)).toBe(undefined);
    });

    it("should handle empty string", () => {
      const input = "";
      expect(toTitleCase(input)).toBe("");
    });

    it("should handle non-string values gracefully", () => {
      const input = 123;
      expect(toTitleCase(input)).toBe(123);
    });
  });
});
