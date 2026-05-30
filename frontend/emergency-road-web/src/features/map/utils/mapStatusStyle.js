export function getMapStatusToneByGrade(grade) {
  switch (grade) {
    case "RELAXED":
      return "relaxed";

    case "NORMAL":
      return "normal";

    case "CROWDED":
      return "crowded";

    case "VERY_CROWDED":
      return "very-crowded";

    case "UNKNOWN":
    default:
      return "unknown";
  }
}

export function getMapStatusColorByGrade(grade) {
  switch (grade) {
    case "RELAXED":
      return "#16a34a";

    case "NORMAL":
      return "#2563eb";

    case "CROWDED":
      return "#f97316";

    case "VERY_CROWDED":
      return "#dc2626";

    case "UNKNOWN":
    default:
      return "#6b7280";
  }
}

export function getMapStatusColorByTone(tone) {
  switch (tone) {
    case "relaxed":
      return "#16a34a";

    case "normal":
      return "#2563eb";

    case "crowded":
      return "#f97316";

    case "very-crowded":
      return "#dc2626";

    case "unknown":
    default:
      return "#6b7280";
  }
}

export function getMapStatusRateForDisplay(rate) {
  const numericRate = Number(rate);

  if (!Number.isFinite(numericRate)) {
    return 0;
  }

  return Math.min(Math.max(numericRate, 0), 100);
}
