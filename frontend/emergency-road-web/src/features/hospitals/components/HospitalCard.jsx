import React, { useState } from 'react';
import './HospitalCard.css';
import HospitalDonutChart from './HospitalDonutChart';
import { getHospitalDetail } from '../api/hospitalDetail';
import HospitalDetail from './HospitalDetail';
// 아이콘
import phoneIcon from '../../../assets/hospital/phone.svg';
import finderIcon from '../../../assets/hospital/finder.svg';
import communityIcon from '../../../assets/hospital/community.svg';
import angleIcon from '../../../assets/hospital/angle-brackets.png';
import { useHospitalDetail } from '../hooks/recommend/useHospitalDetail';

const HospitalCard = ({ hospital, rank, userLat, userLon, config, category }) => {
  const { detailData, loading, isExpanded, toggleDetail} = useHospitalDetail(category, hospital.hpid);
  const [error, setError] = useState(null);
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


 
  return (
    <>
      <article className={`hospital-card ${rank === 1 ? 'top1' : ''}`} 
      style={{
            '--primary': theme.primary,
            '--light': theme.light,
            '--border': theme.border,
            '--soft': theme.soft,
            '--icon-bg': theme.iconBg,
            '--icon-color': theme.iconColor,
            }}>
        <div className="top-badge">TOP {rank}</div>

        <div className="hospital-left">
          <div className="hospital-icon">
            {config.title.includes('소아') ? 'P' : config.title.includes('임산부') ? 'M' : 'H'}
          </div>

          <div className="hospital-info">
            <div className="hospital-name">{hospital.hospitalName}</div>
            <div className="hospital-meta">
              <span>📍 {hospital.formattedDistance}</span>
              <span>⏱ {Math.round(hospital.duration)}분</span>
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
              <a href={`/hospitals/${hospital.hpid}/posts`} className="community-button">
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
                  />
           )}
        </div>
      )}
    </>
  );
};

export default HospitalCard;