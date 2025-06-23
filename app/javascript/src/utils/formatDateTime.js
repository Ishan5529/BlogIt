export const formatDateTime = datetimeStr => {
  if (!datetimeStr) return "-";
  const date = new Date(datetimeStr);

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
