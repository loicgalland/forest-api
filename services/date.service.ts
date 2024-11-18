export const formatDate = (date: Date | string | null | undefined) => {
  if (date) {
    const parsedDate = new Date(date);
    return parsedDate
      .toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
      .replace(".", "");
  } else {
    return "Undefinded";
  }
};
