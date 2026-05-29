import { useEffect, useState } from "react";
import { getHospitalDetail } from "../../hospitals/api/hospitalDetail";


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

// 상태 색상 표현 함수
function getStatusTone(grade) {
  switch (grade) {
    case "RELAXED":
      return "relaxed";

    case "NORMAL":
      return "normal";

    case "CROWDED":
    case "VERY_CROWDED":
      return "crowded";

    case "UNKNOWN":
    default:
      return "unknown";
  }
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

function MapHospitalDetailPanel({ hospital, onBack }) {
  const statusGrade = hospital.status?.grade ?? "UNKNOWN";
  const statusLabel = hospital.status?.label ?? "정보없음";
  const statusTone = getStatusTone(statusGrade);

  // 사용자의 좌표값이 안들어올 경우에 대한 안전장치
  const hasLocation =
    hospital.latitude !== null &&
    hospital.latitude !== undefined &&
    hospital.longitude !== null &&
    hospital.longitude !== undefined;

  const kakaoRouteUrl = hasLocation
    ? `https://map.kakao.com/link/to/${encodeURIComponent(
        hospital.hospitalName
      )},${hospital.latitude},${hospital.longitude}`
    : null;

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
  
  // DetailAPI 에서 가져온 항목 - 자원 가능 항목
  const availableResources = [
    {
      label: "CT",
      status: normalizeAvailableStatus(hospitalDetail?.ctAvailable),
    },
    {
      label: "MRI",
      status: normalizeAvailableStatus(hospitalDetail?.mriAvailable),
    },
    {
      label: "인공호흡기",
      status: normalizeAvailableStatus(hospitalDetail?.ventilatorAvailable),
    },
    {
      label: "CRRT",
      status: normalizeAvailableStatus(hospitalDetail?.crrtAvailable),
    },
    {
      label: "ECMO",
      status: normalizeAvailableStatus(hospitalDetail?.ecmoAvailable),
    },
    {
      label: "혈관조영",
      status: normalizeAvailableStatus(hospitalDetail?.angioAvailable),
    },
  ];


  // DetailAPI - 중증질환 수용가능 항목
  const severeDiseaseResources = [
    {
      label: "심근경색",
      status: normalizeAvailableStatus(
        hospitalDetail?.myocardialInfarctionAvailable
      ),
    },
    {
      label: "뇌경색",
      status: normalizeAvailableStatus(hospitalDetail?.cerebralInfarctionAvailable),
    },
    {
      label: "거미막하 출혈",
      status: normalizeAvailableStatus(
        hospitalDetail?.subarachnoidHemorrhageAvailable
      ),
    },
    {
      label: "기타 출혈",
      status: normalizeAvailableStatus(hospitalDetail?.otherHemorrhageAvailable),
    },
    {
      label: "대동맥 응급 흉부",
      status: normalizeAvailableStatus(hospitalDetail?.aorticChestAvailable),
    },
    {
      label: "대동맥 응급 복부",
      status: normalizeAvailableStatus(hospitalDetail?.aorticAbdomenAvailable),
    },
    {
      label: "응급투석",
      status: normalizeAvailableStatus(hospitalDetail?.dialysisAvailable),
    },
    {
      label: "폐쇄병동 입원",
      status: normalizeAvailableStatus(hospitalDetail?.closedWardAvailable),
    },
    {
      label: "응급내시경 위장관",
      status: normalizeAvailableStatus(hospitalDetail?.endoscopyGiAvailable),
    },
    {
      label: "응급내시경 기관지",
      status: normalizeAvailableStatus(hospitalDetail?.endoscopyBronchialAvailable),
    },
    {
      label: "중증화상",
      status: normalizeAvailableStatus(hospitalDetail?.severeBurnsAvailable),
    },
    {
      label: "성인 혈관중재",
      status: normalizeAvailableStatus(hospitalDetail?.angioAdultAvailable),
    },
  ];
    
  // hpid 가 바뀔 때 값 마다 잘가져오는지 확인
  useEffect(() => {
    if (!hospital?.hpid) {
      return;
    }

    async function fetchHospitalDetail() {
      try {
        setDetailLoading(true);
        setDetailError(null);

        const data = await getHospitalDetail("GENERAL", hospital.hpid);

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
  }, [hospital?.hpid]);

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
        <section className={`map-detail-summary-card ${statusTone}`}>
          <div className="map-detail-summary-top">
            <div className="map-detail-summary-main">
              <span className={`map-status-badge ${statusTone}`}>
                {statusLabel}
              </span>

              <h2>{hospitalName}</h2>

              <p>{address ?? "주소 정보 없음"}</p>
            </div>

            <div className={`map-bed-count ${statusTone}`}>
              <strong>{displayValue(availableBeds)}</strong>
              <span>/ {displayValue(totalBeds)}</span>
            </div>
          </div>

          <div className="map-detail-bed-meta">
            <div>
              <span>가용 병상</span>
              <strong>{displayValue(availableBeds)}개</strong>
            </div>

            <div>
              <span>전체 병상</span>
              <strong>{displayValue(totalBeds)}개</strong>
            </div>

            <div>
              <span>가용률</span>
              <strong>
                {rate !== null && rate !== undefined ? `${rate}%` : "-"}
              </strong>
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
          {kakaoRouteUrl ? (
              <a
                href={kakaoRouteUrl}
                target="_blank"
                rel="noreferrer"
                className="map-detail-action-button"
              >
                길찾기
              </a>
            ) : (
              <button
                type="button"
                className="map-detail-action-button disabled"
                disabled
              >
                길찾기
              </button>
            )}

          <a
            href={`/community/${hospital.hpid}`}
            className="map-detail-action-button"
          >
            커뮤니티
          </a>
        </div>

        <section className="map-detail-section">
          <h3 className="map-detail-title">기본 정보</h3>

          <div className="map-detail-row">
            <span>주소</span>
            <strong>{displayValue(address)}</strong>
          </div>

          <div className="map-detail-row">
            <span>응급실 번호</span>
            <strong>{displayValue(emergencyPhone)}</strong>
          </div>
        </section>

        <section className="map-detail-section">
          <h3 className="map-detail-title">응급실 병상</h3>

          <div className="map-detail-resource-grid">
            <div className="map-detail-resource">
              <span>가용 병상</span>
              <strong>{displayValue(availableBeds)}개</strong>
            </div>

            <div className="map-detail-resource">
              <span>전체 병상</span>
              <strong>{displayValue(totalBeds)}개</strong>
            </div>

            <div className="map-detail-resource">
              <span>가용률</span>
              <strong>
                {rate !== null &&
                rate !== undefined
                  ? `${rate}%`
                  : "-"}
              </strong>
            </div>
            </div>
        </section>

        <section className="map-detail-section">
          <h3 className="map-detail-title">자원 가능 항목</h3>

          {detailLoading ? (
            <p className="map-detail-message">자원 정보를 불러오는 중입니다.</p>
          ) : detailError ? (
            <p className="map-detail-message error">{detailError}</p>
          ) : (
            <div className="map-detail-chip-list">
              {availableResources.map((resource) => (
                <span
                  key={resource.label}
                  className={`map-detail-chip ${resource.status}`}
                >
                  {resource.label}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="map-detail-section">
          <h3 className="map-detail-title">중증질환 수용 가능</h3>

          {detailLoading ? (
            <p className="map-detail-message">수용 가능 정보를 불러오는 중입니다.</p>
          ) : detailError ? (
            <p className="map-detail-message error">{detailError}</p>
          ) : (
            <div className="map-detail-chip-list">
              {severeDiseaseResources.map((resource) => (
                <span
                  key={resource.label}
                  className={`map-detail-chip ${resource.status}`}
                >
                  {resource.label}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="map-detail-section">
          <h3 className="map-detail-title">갱신 정보</h3>

          <div className="map-detail-row">
            <span>갱신 시간</span>
            <strong>{formatDateTime(recordedAt)}</strong>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MapHospitalDetailPanel;