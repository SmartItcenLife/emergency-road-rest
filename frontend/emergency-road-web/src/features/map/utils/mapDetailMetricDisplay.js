import { displayValue } from "./mapFormat";
import {
  getMapStatusColorByTone,
  getMapStatusRateForDisplay,
} from "./mapStatusStyle";

function getStatusSummaryText(label) {
  if (label === "분만 가능") {
    return "가능";
  }

  if (label === "분만 불가") {
    return "불가능";
  }

  return label ?? "정보없음";
}

export function getMapDetailMetricDisplay({
  status,
  statusTone,
  metricLabels,
}) {
  const statusLabel = status?.label ?? "정보없음";
  const availableCount = status?.availableCount;
  const totalCount = status?.totalCount;
  const rate = status?.rate;
  const isStatusSummary = metricLabels.summaryType === "status";

  return {
    countText: isStatusSummary
      ? statusLabel
      : `${displayValue(availableCount)} / ${displayValue(totalCount)}`,
    countLabel: isStatusSummary
      ? metricLabels.statusSummaryLabel
      : `${metricLabels.availableLabel} / ${metricLabels.totalLabel}`,
    donutRate: isStatusSummary ? 100 : getMapStatusRateForDisplay(rate),
    donutText: isStatusSummary
      ? getStatusSummaryText(statusLabel)
      : rate !== null && rate !== undefined
        ? `${rate}%`
        : "-",
    donutColor: getMapStatusColorByTone(statusTone),
  };
}
