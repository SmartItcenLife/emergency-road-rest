import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const HospitalDonutChart = ({
  percentage = 0,
  count = 0,
  total = 0,
  status = "unknown",
  config,
  hospital
}) => {

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // 임산부 모드 여부
  const isDeliveryMode =
    config?.donut?.mode === 'delivery';

  // 분만 가능 여부
  const isAvailable =
    hospital?.[config?.donut?.availableKey]?.trim() === 'Y';

  // 일반 응급 색상
  const getStatusColor = () => {
    if (status === '여유') return '#22c55e';
    if (status === '보통') return '#facc15';
    if (status === '혼잡' || status === '주의') return '#fb923c';
    return '#9ca3af';
  };

  // 메인 색상
  const donutColor = isDeliveryMode
    ? (
        isAvailable
          ? config.donut.availableColor
          : config.donut.unavailableColor
      )
    : getStatusColor();

  // 배경 색상
  const donutBg = isDeliveryMode
    ? (
        isAvailable
          ? '#fce7f3'
          : '#fee2e2'
      )
    : '#f0fdf4';

  // 퍼센트
  const chartValue = isDeliveryMode
    ? (isAvailable ? 100 : 0)
    : percentage;

  // 가운데 텍스트
  const centerText = isDeliveryMode
    ? (isAvailable ? '가능' : '불가')
    : `${count}개`;

  // 하단 텍스트
  const bottomText = isDeliveryMode
    ? config.donut.label
    : `전체 ${total ?? 0} 병상`;

  // glow 효과
  const glowEffect = isDeliveryMode
    ? (
        isAvailable
          ? 'drop-shadow(0 0 10px rgba(219,39,119,0.25))'
          : 'drop-shadow(0 0 8px rgba(239,68,68,0.18))'
      )
    : (
        status === '여유'
          ? 'drop-shadow(0 0 8px rgba(34,197,94,0.18))'
          : status === '보통'
            ? 'drop-shadow(0 0 8px rgba(250,204,21,0.18))'
            : status === '혼잡' || status === '주의'
              ? 'drop-shadow(0 0 8px rgba(251,146,60,0.18))'
              : 'none'
      );

  useEffect(() => {

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    chartInstance.current = new Chart(ctx, {

      type: 'doughnut',

      data: {
        datasets: [{
          data: [chartValue, 100 - chartValue],

          backgroundColor: [
            donutColor,
            donutBg
          ],

          borderWidth: 0,

          cutout: '72%',

          borderRadius: 10,

          hoverOffset: 3
        }]
      },

      options: {
        plugins: {
          tooltip: {
            enabled: false
          },
          legend: {
            display: false
          }
        },
        responsive: true,
        maintainAspectRatio: false
      },

      plugins: [{
        id: 'centerText',

        beforeDraw(chart) {

          const { ctx, width, height } = chart;

          ctx.save();

        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';

        ctx.font = "bold 16px Pretendard";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = donutColor;

          ctx.fillText(
            centerText,
            width / 2,
            height / 2 - (isDeliveryMode ? 6 : 0)
          );

          // 임산부 서브텍스트
          if (isDeliveryMode) {

            ctx.shadowBlur = 0;

            ctx.font = "11px Pretendard";
            ctx.fillStyle = '#9ca3af';

            ctx.fillText(
              isAvailable ? '분만 가능' : '확인 필요',
              width / 2,
              height / 2 + 14
            );
          }

          ctx.restore();
        }
      }]
    });

    return () => {
      chartInstance.current?.destroy();
    };

  }, [
    percentage,
    count,
    status,
    chartValue,
    donutColor,
    centerText
  ]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6
      }}
    >

      <div
        style={{
          width: 80,
          height: 80,
          position: 'relative',

          filter: glowEffect,

          transform:
            status === '주의'
              ? 'scale(1.04)'
              : 'scale(1)',

          transition: 'all .3s ease'
        }}
      >
        <canvas ref={chartRef} />
      </div>

      <div className='bed-text'>
        {bottomText}
      </div>

      {!isDeliveryMode && status === '주의' && (
        <div
          style={{
            fontSize: 10,
            color: '#f97316',
            fontWeight: 'bold'
          }}
        >
          전화 확인 필수!
        </div>
      )}

    </div>
  );
};

export default HospitalDonutChart;