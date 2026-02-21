import { describe, it, expect } from "vitest";
import { formatViewCount, formatDuration } from "../youtube";

describe("formatViewCount", () => {
  it("returns raw count for values under 1000", () => {
    expect(formatViewCount("500")).toBe("500");
    expect(formatViewCount("0")).toBe("0");
    expect(formatViewCount("999")).toBe("999");
  });

  it("formats thousands with K suffix", () => {
    expect(formatViewCount("1000")).toBe("1.0K");
    expect(formatViewCount("15000")).toBe("15.0K");
    expect(formatViewCount("999999")).toBe("1000.0K");
  });

  it("formats millions with M suffix", () => {
    expect(formatViewCount("1000000")).toBe("1.0M");
    expect(formatViewCount("2500000")).toBe("2.5M");
  });

  it("returns '0' for NaN input", () => {
    expect(formatViewCount("not-a-number")).toBe("0");
  });
});

describe("formatDuration", () => {
  it("formats minutes and seconds", () => {
    expect(formatDuration("PT12M30S")).toBe("12:30");
    expect(formatDuration("PT5M5S")).toBe("5:05");
  });

  it("formats hours, minutes, and seconds", () => {
    expect(formatDuration("PT1H30M45S")).toBe("1:30:45");
    expect(formatDuration("PT2H0M0S")).toBe("2:00:00");
  });

  it("handles seconds only", () => {
    expect(formatDuration("PT45S")).toBe("0:45");
  });

  it("handles minutes only", () => {
    expect(formatDuration("PT10M")).toBe("10:00");
  });

  it("returns '0:00' for invalid duration", () => {
    expect(formatDuration("invalid")).toBe("0:00");
    expect(formatDuration("")).toBe("0:00");
  });
});
