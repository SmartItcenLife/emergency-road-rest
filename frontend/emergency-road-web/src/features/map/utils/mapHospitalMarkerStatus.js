import { getMapStatusToneByGrade } from "./mapStatusStyle";
import { getPregnantNicuStatusByCounts } from "./mapPregnantNicuStatus";
import { getMapHospitalLabels } from "./mapHospitalDisplay";

export function getHospitalMarkerStatus(hospital) {
  const category = hospital.category ?? "GENERAL";
  const metricLabels = getMapHospitalLabels(category);

  if (metricLabels.markerStatusType === "resourceRate") {
    const resourceStatus = getPregnantNicuStatusByCounts(
      hospital.status?.availableCount,
      hospital.status?.totalCount
    );

    return {
      ...resourceStatus,
      summaryText: metricLabels.markerSummaryLabel ?? resourceStatus.label,
    };
  }

  const label = hospital.status?.label ?? "정보없음";

  return {
    label,
    tone: getMapStatusToneByGrade(hospital.status?.grade),
    rate: hospital.status?.rate ?? null,
    summaryText: label,
  };
}
