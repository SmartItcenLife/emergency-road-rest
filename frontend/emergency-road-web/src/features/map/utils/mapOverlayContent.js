import { getMapHospitalLabels } from "./mapHospitalDisplay";
import { displayValue, formatDateTime } from "./mapFormat";

export function createHospitalInfoContent(hospital) {
    const content = document.createElement("div");
    content.className = "map-marker-info map-marker-info-detail";

    const category = hospital.category ?? "GENERAL";
    const metricLabels = getMapHospitalLabels(category);

    const statusLabel = hospital.status?.label ?? "정보없음";
    const availableBeds = hospital.status?.availableCount;
    const totalCount = hospital.status?.totalCount;
    const rate = hospital.status?.rate;

    content.innerHTML = `
      <strong>${hospital.hospitalName ?? "선택한 병원"}</strong>
      <span>${statusLabel}</span>
      <dl>
        <div>
          <dt>병원 이름</dt>
          <dd>${displayValue(hospital.hospitalName) ?? "정보없음"}</dd>
        </div>
        <div>
          <dt>${metricLabels.availableLabel}</dt>
          <dd>${displayValue(availableBeds)}${metricLabels.countSuffix}</dd>
        </div>
        <div>
          <dt>${metricLabels.totalLabel}</dt>
          <dd>${displayValue(totalCount)}${metricLabels.countSuffix}</dd>
        </div>
        <div>
          <dt>${metricLabels.ratioLabel}</dt>
          <dd>${
            rate !== null && rate !== undefined ? `${rate}%` : "정보없음"
          }</dd>
        </div>
      </dl>
    `;

    return content;
  }
export function createAreaInfoContent(areaName, congestion) {
    const content = document.createElement("div");
    content.className = "map-area-info";
    const metricLabels = getMapHospitalLabels(congestion?.category ?? "GENERAL");

    content.innerHTML = `
      <strong>${areaName}</strong>
      <span>${congestion?.status?.label ?? "정보없음"}</span>
      <dl>
        <div>
          <dt>병원 수</dt>
          <dd>${displayValue(congestion?.hospitalCount)}개</dd>
        </div>
        <div>
          <dt>${metricLabels.availableLabel}</dt>
          <dd>${displayValue(congestion?.status?.availableCount)}${metricLabels.countSuffix}</dd>
        </div>
        <div>
          <dt>${metricLabels.totalLabel}</dt>
          <dd>${displayValue(congestion?.status?.totalCount)}${metricLabels.countSuffix}</dd>
        </div>
        <div>
          <dt>${metricLabels.ratioLabel}</dt>
          <dd>${
            congestion?.status?.rate !== null &&
            congestion?.status?.rate !== undefined
              ? `${congestion.status.rate}%`
              : "-"
          }</dd>
        </div>
        <div>
          <dt>갱신 시간</dt>
          <dd>${formatDateTime(congestion?.recordedAt)}</dd>
        </div>
      </dl>
    `;

    return content;
  }
