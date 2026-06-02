import { getMapStatusToneByGrade } from "./mapStatusStyle";
import { getPregnantNicuStatusByCounts } from "./mapPregnantNicuStatus";

export function getHospitalMarkerStatus(hospital) {
  const category = hospital.category ?? "GENERAL";

  if (category === "PREGNANT") {
    return getPregnantNicuStatusByCounts(
      hospital.status?.availableCount,
      hospital.status?.totalCount
    );
  }

  return {
    label: hospital.status?.label ?? "정보없음",
    tone: getMapStatusToneByGrade(hospital.status?.grade),
    rate: hospital.status?.rate ?? null,
  };
}