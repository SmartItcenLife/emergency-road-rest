import React, { useState } from 'react';
import './HospitalCard.css';
import HospitalDonutChart from './HospitalDonutChart';
import { getHospitalDetail } from '../api/hospitalDetail';
//아이콘
import phoneIcon from '../../../assets/hospital/phone.svg';
import finderIcon from '../../../assets/hospital/finder.svg';
import communityIcon from '../../../assets/hospital/community.svg';
import angleIcon from '../../../assets/hospital/angle-brackets.png';

const HospitalCard = ({ hospital, rank, userLat, userLon }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleToggle = async () => {
    if (!isExpanded && !detailData) {
      try {
        setLoading(true);
        const data = await getHospitalDetail(hospital.hpid);
        setDetailData(data);
      } catch {
        setError('상세 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    }
    setIsExpanded(!isExpanded);
  };

 const moveRoute = () => {
  console.log(userLat);
console.log(userLon);
console.log(hospital.hospitalName);
console.log(hospital.hospitalLatitude);
console.log(hospital.hospitalLongitude);
  const url =
    `https://map.kakao.com/link/by/car/` +
    `현재위치,${userLat},${userLon}/` +
    `${hospital.hospitalName},${hospital.hospitalLatitude},${hospital.hospitalLongitude}`;

  window.open(url, '_blank');
};

  return (
    <>
      <article className={`hospital-card ${rank === 1 ? 'top1' : ''}`}>
        <div className="top-badge">
            TOP {rank}
        </div>
    
        <div className="hospital-left">
          <div className="hospital-icon">H</div>
          
          <div className="hospital-info">
          
            <div className="hospital-name">{hospital.hospitalName}</div>
            <div className="hospital-meta">
                 <span>
                    📍 {hospital.formattedDistance}
                </span> 
                  <span>
                    ⏱ {Math.round(
                        hospital.duration
                    )}분
                  </span>
             
              <span
                className={`badge ${
                  hospital.congestionLabel === '여유'
                    ? 'badge-free'
                    : hospital.congestionLabel === '보통'
                    ? 'badge-normal'
                    : hospital.congestionLabel === '혼잡' || hospital.congestionLabel === '주의'
                    ? 'badge-busy'
                    : 'badge-unknown'
                }`}
              >
                {hospital.congestionLabel}
              </span>
            </div>
            {hospital.tags && (
              <div className="tag-wrapper">
                {hospital.tags.split('|').map((tag) => (
                  <small key={tag} className="tag-badge">
                    {tag}
                  </small>
                ))}
              </div>
            )}
          </div>
        </div>

   
        <div className="hospital-right">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <HospitalDonutChart
              percentage={hospital.availableBedPercentage}
              count={hospital.availablePediatricBedCount}
              total={hospital.totalPediatricBedCount}
              status={hospital.congestionLabel}
            />
        
            <div className="hospital-actions">
              <a
                href={hospital.emergencyPhone ? `tel:${hospital.emergencyPhone}` : '#'}
                className={`call-button ${!hospital.emergencyPhone ? 'call-button-disabled' : ''}`}
              >
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
          <button
            onClick={handleToggle}
            className={`detail-toggle ${isExpanded ? 'detail-toggle-open' : ''}`}
          >
            <img src={angleIcon} className="detail-toggle-icon" alt="더보기" />
          </button>
        </div>
      </article>

      {isExpanded && (
        <div className="hospital-detail-wrapper">
          {loading && <div className="detail-loading">상세 정보를 불러오는 중입니다...</div>}
          {error && <div className="detail-error">{error}</div>}
          {detailData && (
            <div className="hospital-detail-panel">
              <div className="detail-section">
                <h3 className="detail-title">기본 정보</h3>
                <div className="detail-row">
                  주소 <span>{detailData.address}</span>
                </div>
                <div className="detail-row">
                  응급실 번호 <span>{detailData.emergencyPhone}</span>
                </div>
              </div>
              <div className="detail-section">
                <h3 className="detail-title">소아 핵심 자원</h3>
                <div className="core-resource-grid">
                  <div className="detail-resource">
                    소아 ICU <span>{detailData.pediatricIcuCount}</span>
                  </div>
                  <div className="detail-resource">
                    음압 격리 <span>{detailData.pediatricNegativeIsolationCount}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default HospitalCard;