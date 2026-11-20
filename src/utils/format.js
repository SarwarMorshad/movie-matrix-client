// Small display helpers shared by the UI.

// 142 -> "2h 22m", 45 -> "45m"
export const formatRuntime = (minutes) => {
  const m = Number(minutes);
  if (!m || m <= 0) return "";
  const h = Math.floor(m / 60);
  return h ? `${h}h ${m % 60}m` : `${m}m`;
};

// 9 -> "9.0", "8.56" -> "8.6", missing -> "N/A"
export const formatRating = (rating) => {
  const r = Number(rating);
  return Number.isFinite(r) && r > 0 ? r.toFixed(1) : "N/A";
};
