import { useEffect, useState } from "react";
import { getHospitalDetail } from "../../hospitals/api/hospitalDetail";
import { getMapHospitalLabels} from "../utils/mapHospitalDisplay"
import { categoryConfig } from "../../hospitals/constants/categoryConfig";
import {
  getMapStatusColorByTone,
  getMapStatusRateForDisplay,
  getMapStatusToneByGrade,
} from "../utils/mapStatusStyle";
import "./MapHospitalDetailPanel.css";


function displayValue(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return value;
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  return String(value).replace("T", " ").substring(0, 16);
}

// 디테일 값 전처리 
function normalizeAvailableStatus(value) {
  if (value === null || value === undefined || value === "") {
    return "unknown";
  }
  const normalizedValue = String(value).trim();
  if (normalizedValue === "Y") {
    return "available";
  }
  if (normalizedValue === "N") {
    return "unavailable";
  }
  return "unknown";
}

function getResourceToneByValues(currentValue, totalValue) {
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

function MapHospitalDetailPanel({ hospital, onBack }) {
  const statusGrade = hospital.status?.grade ?? "UNKNOWN";
  const statusLabel = hospital.status?.label ?? "정보없음";
  const statusTone = getMapStatusToneByGrade(statusGrade);

  // 사용자의 좌표값이 안들어올 경우에 대한 안전장치
  const hasLocation = 
    hospital.latitude !== null &&
    hospital.latitude !== undefined &&
    hospital.longitude !== null &&
    hospital.longitude !== undefined;

  function openKakaoCarRoute() {
    if (!hasLocation) {
      return;
    }

    if (!navigator.geolocation) {
      alert("현재 위치 정보를 사용할 수 없습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const url = `https://map.kakao.com/link/by/car/${encodeURIComponent(
          "현재위치"
        )},${latitude},${longitude}/${encodeURIComponent(
          hospital.hospitalName
        )},${hospital.latitude},${hospital.longitude}`;

        window.open(url, "_blank");
      },
      () => {
        alert("현재 위치를 가져오지 못했습니다.");
      }
    );
  }

  // detail Panel 을 위한 상태값
  const [hospitalDetail, setHospitalDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  // 상세패널에 사용할 정보값
  const hospitalName = hospital.hospitalName;
  const address = hospital.address;
  const emergencyPhone = hospital.emergencyPhone;
  const availableBeds = hospital.status?.availableCount;
  const totalBeds = hospital.status?.totalCount;
  const rate = hospital.status?.rate;
  const recordedAt = hospital.recordedAt;

  const category = hospital.category ?? "GENERAL";
  const detailSections = categoryConfig[category]?.detailSections ?? [];
  const metricLabels = getMapHospitalLabels(category);
  const mapDetailSections = detailSections.filter((section) => 
    ["resources", "capabilities"].includes(section.type));

  // 도넛 차트를 위한 변수 선언
  const isPregnantCategory = category === "PREGNANT"; 

  const donutRate = isPregnantCategory ? 100 : getMapStatusRateForDisplay(rate);
  const donutRateText = isPregnantCategory ? getDeliveryDisplayLabel(statusLabel) : (rate !== null && rate !== undefined ? `${rate}%` : "-");
  const donutColor = getMapStatusColorByTone(statusTone);

  function getDeliveryDisplayLabel(label) {
  if (label === "분만 가능") {
    return "가능";
  }

  if (label === "분만 불가") {
    return "불가능";
  }

  return label ?? "정보없음";
}
    
  // hpid 가 바뀔 때 값 마다 잘가져오는지 확인
  useEffect(() => {
    if (!hospital?.hpid) {
      return;
    }

    async function fetchHospitalDetail() {
      try {
        setDetailLoading(true);
        setDetailError(null);

        
        const hospitalCategory = hospital.category ?? "GENERAL";
        const data = await getHospitalDetail(hospitalCategory, hospital.hpid);


        console.log("지도 상세 패널 병원 상세 데이터:", data);

        setHospitalDetail(data);
      } catch (error) {
        console.error(error);
        setDetailError("병원 상세 정보를 불러오지 못했습니다.");
      } finally {
        setDetailLoading(false);
      }
    }

    fetchHospitalDetail();
  }, [hospital?.hpid, hospital?.category]);

  return (
    <div className="map-detail-panel">
      <div className="map-detail-panel-header">
        <button
          type="button"
          className="map-detail-back-button"
          onClick={onBack}
          aria-label="병원 목록으로 돌아가기"
        >
          ←
        </button>

        <strong>병원 상세</strong>
      </div>
      <div className="map-detail-info-card">
        <section className="map-detail-hospital-summary">
          <div className={`map-detail-hospital-icon ${statusTone}`}>
            <span className="map-list-hospital-symbol" aria-hidden="true" />
          </div>

          <div className="map-detail-hospital-content">
            <div className="map-detail-hospital-title-row">
              <h2>{hospitalName}</h2>

              <span className={`map-status-badge ${statusTone}`}>
                {statusLabel}
              </span>
            </div>

            <p>{address ?? "주소 정보 없음"}</p>

            <div className="map-detail-hospital-phone">
              <span>☎</span>
              <strong>{displayValue(emergencyPhone)}</strong>
            </div>
          </div>
        </section>

        <div className="map-detail-actions">
          {emergencyPhone ? (
            <a
              href={`tel:${emergencyPhone}`}
              className="map-detail-action-button"
            >
              전화
            </a>
          ) : (
            <button
              type="button"
              className="map-detail-action-button disabled"
              disabled
            >
              전화
            </button>
          )}
              <button
                type="button"
                onClick={openKakaoCarRoute}
                className="map-detail-action-button"
                disabled={!hasLocation}
              >
                길찾기
              </button>
          <a
            href={`/community/${hospital.hpid}`}
            className="map-detail-action-button"
          >
            커뮤니티
          </a>
        </div>

        <section className="map-detail-section">
          <div className="map-detail-section-header">
            <h3 className="map-detail-title">{metricLabels.title}</h3>
            <span>{formatDateTime(recordedAt)} 기준</span>
          </div>

          <div className="map-detail-bed-status">
            <div className="map-detail-bed-count-card">
              <strong>
                {isPregnantCategory ? statusLabel : `${displayValue(availableBeds)} / ${displayValue(totalBeds)}`}
              </strong>
              <span>
                {isPregnantCategory
                  ? "분만 가능 여부"
                  : `${metricLabels.availableLabel} / ${metricLabels.totalLabel}`}
              </span>
            </div>

            <div
              className="map-detail-donut"
              style={{
                background: `conic-gradient(${donutColor} ${donutRate}%, #edf2f7 0)`,
              }}
            >
              <div className="map-detail-donut-inner">
                <strong>{donutRateText}</strong>
                <span>{metricLabels.ratioLabel}</span>
              </div>
            </div>
          </div>
        </section>

        {detailLoading ? (
          <section className="map-detail-section">
            <p className="map-detail-message">상세 정보를 불러오는 중입니다.</p>
          </section>
        ) : detailError ? (
          <section className="map-detail-section">
            <p className="map-detail-message error">{detailError}</p>
          </section>
        ) : (
          mapDetailSections.map((section) =>(
            <section key={section.title} className="map-detail-section">
              <h3 className="map-detail-title">{section.title}</h3>
              {section.type === "resources" && (
                <div className="map-detail-chip-list">
                      {section.items.map((item) => {
                        const currentValue = hospitalDetail?.[item.currentKey];
                        const totalValue = hospitalDetail?.[item.totalKey];
                        const currentDisplayValue = displayValue(currentValue);
                        const totalDisplayvalue = displayValue(totalValue);
                        const resourceStatus = getResourceToneByValues(
                          currentValue,
                          totalValue
                        );

                        return (
                          <span
                            key={item.label}
                            className={`map-detail-chip ${resourceStatus}`}
                          >
                            {item.label} {currentDisplayValue} / {totalDisplayvalue}
                          </span>
                        )
                      }
                  )}
                </div>
              )}
              {section.type === "capabilities" && (
                <div className="map-detail-chip-list">
                  {section.items.map((item) => {
                    const status = normalizeAvailableStatus(hospitalDetail?.[item.key]);

                    return (
                      <span
                        key={item.label}
                        className={`map-detail-chip ${status}`}
                        >
                          {item.label}
                        </span>
                    )
                  })}
                </div>
              )}
            </section>
          ))
        )}
      </div>
    </div>
  );
}

export default MapHospitalDetailPanel;
