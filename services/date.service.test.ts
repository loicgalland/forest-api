import { formatDate } from "./date.service";

describe("DateService", () => {
  it("should return the correct formatted date", async () => {
    expect(formatDate(new Date("2024-11-14T23:00:00.000+00:00"))).toBe(
      "15 nov 2024",
    );
    expect(formatDate(null)).toBe("Non définie");
    expect(formatDate(undefined)).toBe("Non définie");
  });
});
