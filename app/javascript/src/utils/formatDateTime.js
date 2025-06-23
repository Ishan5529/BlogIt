export const formatDateTime = datetimeStr => {
  if (!datetimeStr) return `${"\u00A0".repeat(18)}-`;
  const date = new Date(datetimeStr);

  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
