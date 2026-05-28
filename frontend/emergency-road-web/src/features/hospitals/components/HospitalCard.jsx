import React, { useState } from 'react';
import './HospitalCard.css';
import HospitalDonutChart from './HospitalDonutChart';
import { getHospitalDetail } from '../api/hospitalDetail';

// 아이콘
import phoneIcon from '../../../assets/hospital/phone.svg';
import finderIcon from '../../../assets/hospital/finder.svg';
import communityIcon from '../../../assets/hospital/community.svg';
import angleIcon from '../../../assets/hospital/angle-brackets.png';

const HospitalCard = ({ hospital, rank, userLat, userLon, config }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = config.theme;
  
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
    const url = `https://map.kakao.com/link/by/car/현재위치,${userLat},${userLon}/${hospital.hospitalName},${hospital.hospitalLatitude},${hospital.hospitalLongitude}`;
    window.open(url, '_blank');
  };

  const getCongestionBadgeClass = (label) => {
    if (label === '여유') return 'badge-free';
    if (label === '보통') return 'badge-normal';
    if (label === '혼잡' || label === '주의') return 'badge-busy';
    return 'badge-unknown';
  };

  const displayValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    return value;
  };

  const formatDateTime = (value) => {
    if (!value) return '-';
    return value.replace('T', ' ').slice(0, 16);
  };

  const normalizeAvailability = (value) => {
    const v = String(value || '').trim().toUpperCase();

    if (v === 'Y' || v === 'YES' || v === 'TRUE' || v === '1' || v === '가능') {
      return { label: '가능', className: 'capability-available' };
    }
    if (v === 'N' || v === 'NO' || v === 'FALSE' || v === '0' || v === '불가') {
      return { label: '불가', className: 'capability-unavailable' };
    }
    return { label: displayValue(value), className: 'capability-unknown' };
  };

  const formatResource = (current, total) => {
    const currentValue = displayValue(current);
    const totalValue = displayValue(total);
    return totalValue === '-' ? currentValue : `${currentValue} / ${totalValue}`;
  };

  const renderRowSection = (section) => (
    <div className="detail-section" key={section.title}>
      <h3 className="detail-title">{section.title}</h3>
      {section.items.map((item) => {
        let value = detailData[item.key];
        if (item.format === 'datetime') value = formatDateTime(value);
        return (
          <div className="detail-row" key={item.key}>
            <span className="detail-label">{item.label}</span>
            <span className="detail-value">{displayValue(value)}</span>
          </div>
        );
      })}
    </div>
  );

  const renderResourceSection = (section) => (
    <div className="detail-section" key={section.title}>
      <h3 className="detail-title">{section.title}</h3>
      <div className="core-resource-grid">
        {section.items.map((item) => (
          <div className="detail-resource" key={item.label}>
            <span className="detail-resource-name">{item.label}</span>
            <span className="detail-resource-value">
              {formatResource(detailData[item.currentKey], detailData[item.totalKey])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCapabilitySection = (section) => (
    <div className="detail-section" key={section.title}>
      <h3 className="detail-title">{section.title}</h3>
      <div className="capability-grid">
        {section.items.map((item) => {
          const status = normalizeAvailability(detailData[item.key]);
          return (
            <div key={item.key}>
              <div className="detail-capability">
                <span>{item.label}</span>
                <span className={`capability-badge ${status.className}`}>
                  {status.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderDetailSection = (section) => {
    switch (section.type) {
      case 'rows': return renderRowSection(section);
      case 'resources': return renderResourceSection(section);
      case 'capabilities': return renderCapabilitySection(section);
      default: return null;
    }
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

          <button onClick={handleToggle} className={`detail-toggle ${isExpanded ? 'detail-toggle-open' : ''}`}>
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
              {config.detailSections.map((section) => renderDetailSection(section))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default HospitalCard;