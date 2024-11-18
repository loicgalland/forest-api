import { formatDate } from "./date.service";

describe("DateService", () => {
  it("should return the correct formatted date", async () => {
    const formattedDate = new Date("2024-11-14T23:00:00.000+00:00")
      .toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
      .replace(".", "");
    expect(formattedDate).toBe("14 nov 2024");
    expect(formatDate(null)).toBe("Non définie");
    expect(formatDate(undefined)).toBe("Non définie");
  });
});
