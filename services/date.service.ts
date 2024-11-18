export const formatDate = (date: Date | null | undefined) => {
  if (date) {
    const parsedDate = new Date(date);
    return parsedDate
      .toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(".", "");
  } else {
    return "Non définie";
  }
};
