import React from 'react';
import './HospitalDetail.css';

const HospitalDetail = ({ detailData, config }) => {

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

    return {
      label: displayValue(value),
      className: 'capability-unknown',
    };
  };

  const formatResource = (current, total) => {
    const currentValue = displayValue(current);
    const totalValue = displayValue(total);

    return totalValue === '-'
      ? currentValue
      : `${currentValue} / ${totalValue}`;
  };

  const theme = config.theme;
  

  const renderRowSection = (section) => (
    <div className="detail-section" key={section.title}>
      <h3 className="detail-title">{section.title}</h3>

      {section.items.map((item) => {
        let value = detailData[item.key];

        if (item.format === 'datetime') {
          value = formatDateTime(value);
        }

        return (
          <div className="detail-row" key={item.key}>
            <span className="detail-label">{item.label}</span>
            <span className="detail-value">
              {displayValue(value)}
            </span>
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
            <span className="detail-resource-name">
              {item.label}
            </span>

            <span className="detail-resource-value">
              {formatResource(
                detailData[item.currentKey],
                detailData[item.totalKey]
              )}
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
            <div className="detail-capability" key={item.key}>
              <span>{item.label}</span>

              <span className={`capability-badge ${status.className}`}>
                {status.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderDetailSection = (section) => {
    switch (section.type) {
      case 'rows':
        return renderRowSection(section);

      case 'resources':
        return renderResourceSection(section);

      case 'capabilities':
        return renderCapabilitySection(section);

      default:
        return null;
    }
  };

  return (
    <div className="hospital-detail-panel" style={{
            '--primary': theme.primary,
            }}>
      {config.detailSections.map((section) =>
        renderDetailSection(section)
      )}
    </div>
  );
};

export default HospitalDetail;