import './HospitalCard.css';
import HospitalDonutChart from './HospitalDonutChart';
import HospitalDetail from './HospitalDetail';
// 아이콘
import phoneIcon from '../../../assets/hospital/phone.svg';
import finderIcon from '../../../assets/hospital/finder.svg';
import communityIcon from '../../../assets/hospital/community.svg';
import angleIcon from '../../../assets/hospital/angle-brackets.png';
import locationIcon from '../../../assets/location2.svg';
import { useHospitalDetail } from '../hooks/recommend/useHospitalDetail';
import mascotGreen from '../../../assets/mascot_green.png';
import mascotPink from '../../../assets/mascot_pink.png';
import mascotBlue from '../../../assets/mascot_blue.png';
// 지도로 보기
import { useNavigate } from "react-router-dom";
import { buildHospitalMapUrl, canNavigateToHospitalMap } from "../../../shared/utils/mapNavigation";

const HospitalCard = ({ hospital, rank, userLat, userLon, config, category, showRanking, showDistance, compact }) => {
  const { detailData, loading, isExpanded, toggleDetail} = useHospitalDetail(category, hospital.hpid);
  const error = null;
  const theme = config.theme;
  

  const moveRoute = () => {
    const url = `https://map.kakao.com/link/by/car/현재위치,${userLat},${userLon}/${hospital.hospitalName},${hospital.hospitalLatitude},${hospital.hospitalLongitude}`;
    window.open(url, '_blank');
  };

  const getCongestionBadgeClass = (label) => {
    if (label === '여유') return 'badge-free';
    if (label === '보통') return 'badge-normal';
    if (label === '혼잡' || label === '주의') return 'badge-busy';
    return 'badge-unknown';
  };

  // 지도보기 기능을 위한 변수 추가
  const navigate = useNavigate();

  const canOpenHospitalMap = canNavigateToHospitalMap(hospital);
  const hospitalMapUrl = buildHospitalMapUrl( {hospital, category} );

  const detailActions = (
    <div className="hospital-detail-action-row">
      {hospital.emergencyPhone ? (
        <a
          href={`tel:${hospital.emergencyPhone}`}
          className="hospital-detail-action-button"
        >
          <img src={phoneIcon} alt="" />
          <span>전화</span>
        </a>
      ) : (
        <button
          type="button"
          className="hospital-detail-action-button disabled"
          disabled
        >
          <img src={phoneIcon} alt="" />
          <span>전화</span>
        </button>
      )}

      <button
        type="button"
        className="hospital-detail-action-button"
        onClick={moveRoute}
      >
        <img src={finderIcon} alt="" />
        <span>길찾기</span>
      </button>

      <a
        href={`/community/${hospital.hpid}`}
        className="hospital-detail-action-button"
      >
        <img src={communityIcon} alt="" />
        <span>커뮤니티</span>
      </a>

      <button
        type="button"
        className="hospital-detail-action-button hospital-detail-map-button"
        onClick={() => navigate(hospitalMapUrl)}
        disabled={!canOpenHospitalMap}
      >
        <img src={locationIcon} alt="" />
        <span>지도에서 보기</span>
      </button>
    </div>
  );

 
  return (
    <>
      <article className={`hospital-card ${rank === 1 ? 'top1' : ''}  ${compact ? 'hospital-card-compact' : ''}`} 
      style={{
            '--primary': theme.primary,
            '--light': theme.light,
            '--border': theme.border,
            '--soft': theme.soft,
            '--icon-bg': theme.iconBg,
            '--icon-color': theme.iconColor,
            }}>
        {showRanking && (
            <div className="top-badge">
              TOP {rank}
            </div>
        )}
        <div className="hospital-left">
          <div className="hospital-icon">
                {config.title.includes('소아') ? (
                  <img src={mascotBlue} alt="소아 응급" />
                ) : config.title.includes('임산부') ? (
                  <img src={mascotPink} alt="임산부 응급" />
                ) : (
                  <img src={mascotGreen} alt="일반 응급" />
                )}
          </div>

          <div className="hospital-info">
            <div className="hospital-name">{hospital.hospitalName}</div>
            <div className="hospital-meta">
             {showDistance && (
                    <>
                      <span>📍 {hospital.distance}km</span>
                      <span>⏱ {Math.round(hospital.duration)}분</span>
                    </>
              )}
              {hospital.congestionLabel && (
                <span className={`badge ${getCongestionBadgeClass(hospital.congestionLabel)}`}>
                  {hospital.congestionLabel}
                </span>
              )}
              {hospital.deliveryAvailable && (
                <span className={`badge ${String(hospital.deliveryAvailable).trim().toUpperCase() === 'Y' ? 'badge-free' : 'badge-busy'}`}>
                  {String(hospital.deliveryAvailable).trim().toUpperCase() === 'Y' ? '분만 가능' : '분만 불가'}
                </span>
              )}
            </div>
            {hospital.tags && (
              <div className="tag-wrapper">
                {hospital.tags.split('|').map((tag) => (
                  <small key={tag} className="tag-badge">{tag}</small>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="hospital-right">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <HospitalDonutChart
              percentage={hospital.availableBedPercentage}
              count={hospital[config.donut.countKey]}
              total={hospital[config.donut.totalKey]}
              status={hospital.congestionLabel}
              config={config}
              hospital={hospital}
            />
            <div className="hospital-actions">
              <a href={hospital.emergencyPhone ? `tel:${hospital.emergencyPhone}` : '#'} className={`call-button ${!hospital.emergencyPhone ? 'call-button-disabled' : ''}`}>
                <img src={phoneIcon} className="call-icon-img" alt="전화" />
              </a>
              <button onClick={moveRoute} className="route-button">
                <img src={finderIcon} className="finder-icon-img" alt="길찾기" />
              </button>
              <a href={`/community/${hospital.hpid}`} className="community-button">
                <img src={communityIcon} className="community-icon-img" alt="커뮤니티" />
              </a>
            </div>
          </div>

          <button onClick={toggleDetail} className={`detail-toggle ${isExpanded ? 'detail-toggle-open' : ''}`}>
            <img src={angleIcon} className="detail-toggle-icon" alt="더보기" />
          </button>
        </div>
      </article>

      {isExpanded && (
        <div className="hospital-detail-wrapper">
          {loading && <div className="detail-loading">상세 정보를 불러오는 중입니다...</div>}
          {error && <div className="detail-error">{error}</div>}
          {detailData && (
            <HospitalDetail
              detailData={detailData}
              config={config}
              actionContent={detailActions}
            />
           )}
        </div>
      )}
    </>
  );
};

export default HospitalCard;
