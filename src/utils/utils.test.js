
/**
 * Mock graphqlClient to prevent Apollo Client initialization errors.
 * This allows tests that import modules dependent on graphqlClient to run successfully.
 */
jest.mock("../utils/graphqlClient", () => ({
  client: {
    query: jest.fn(),
    mutate: jest.fn(),
  },
}));

import { removeSquareBracketsFromString } from "./utils";

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
