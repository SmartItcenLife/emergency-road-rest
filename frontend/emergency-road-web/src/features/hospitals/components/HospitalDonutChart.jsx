import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const HospitalDonutChart = ({ percentage = 0, count = 0, total = 0, status = "unknown" }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const getColor = () => {
    if (status === '여유') return '#22c55e';
    if (status === '보통') return '#facc15';
    if (status === '혼잡' || status === '주의') return '#fb923c';
    return '#9ca3af';
  };

  const color = getColor();

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [percentage, 100 - percentage],
          backgroundColor: [color, '#f0f9ff'],
          borderWidth: 0,
          cutout: '70%'
        }]
      },
      options: {
        plugins: {
          tooltip: { enabled: false }
        },
        responsive: true,
        maintainAspectRatio: false
      },
      plugins: [{
        id: 'centerText',
        beforeDraw: (chart) => {
          const { ctx, width, height } = chart;
          ctx.restore();
          ctx.font = "18px Pretendard";
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = color;
          ctx.fillText(`${count}개`, width / 2, height / 1.8);
          ctx.save();
        }
      }]
    });

    return () => {
      chartInstance.current?.destroy();
    };
  }, [percentage, count, color]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ width: 80, height: 80, position: 'relative' }}>
        <canvas ref={chartRef} />
      </div>

      <div className='bed-text'>
        전체 {total ?? 0} 병상
      </div>

      {status === '주의' && (
        <div style={{ fontSize: 10, color: '#f97316', fontWeight: 'bold' }}>
          전화 확인 필수!
        </div>
      )}
    </div>
  );
};

export default HospitalDonutChart;