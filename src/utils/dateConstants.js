// Today
export const today = new Date();

// Three months ago
export const threeMonthsAgo = (() => {
  const d = new Date();
  d.setMonth(today.getMonth() - 3);
  return d;
})();
