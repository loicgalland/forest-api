import { formatDate } from "./date.service";

describe("DateService", () => {
  it("should return the correct formatted date", async () => {
    expect(formatDate("2024-11-14T23:00:00.000+00:00")).toBe("14 nov 2024");
    expect(formatDate("not-date")).toBe("Invalid Date");
    expect(formatDate(null)).toBe("Undefinded");
    expect(formatDate(undefined)).toBe("Undefinded");
  });
});
