export function getPregnantNicuRate(availableCount, totalCount) {
  const availableValue = Number(availableCount);
  const totalValue = Number(totalCount);

  if (
    !Number.isFinite(availableValue) ||
    !Number.isFinite(totalValue) ||
    totalValue <= 0
  ) {
    return null;
  }

  return Math.round((availableValue / totalValue) * 100);
}

export function getPregnantNicuStatus(rate) {
  if (rate === null) {
    return {
      label: "정보없음",
      tone: "unknown",
    };
  }

  if (rate >= 65) {
    return {
      label: "여유",
      tone: "relaxed",
    };
  }

  if (rate >= 50) {
    return {
      label: "보통",
      tone: "normal",
    };
  }

  if (rate >= 35) {
    return {
      label: "혼잡",
      tone: "crowded",
    };
  }

  return {
    label: "매우 혼잡",
    tone: "very-crowded",
  };
}

export function getPregnantNicuStatusByCounts(availableCount, totalCount) {
  const rate = getPregnantNicuRate(availableCount, totalCount);

  return {
    rate,
    ...getPregnantNicuStatus(rate),
  };
}
