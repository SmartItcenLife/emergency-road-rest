export function getResourceToneByValues(currentValue, totalValue) {
  const current = Number(currentValue);
  const total = Number(totalValue);

  if (!Number.isFinite(current) || !Number.isFinite(total) || total <= 0) {
    return "unknown";
  }

  const rate = Math.round((current / total) * 100);

  if (rate >= 70) {
    return "relaxed";
  }

  if (rate >= 50) {
    return "normal";
  }

  if (rate >= 30) {
    return "crowded";
  }

  return "very-crowded";
}