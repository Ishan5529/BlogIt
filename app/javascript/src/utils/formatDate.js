export const formatDate = dateString => {
  const date = new Date(dateString);

  // return date.toLocaleDateString("en-US", {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
