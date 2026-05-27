// 병원 리스트(배열)를 받아 map()을 돌려 HospitalCard를 여러 개 렌더링하는 부모 컨테이너.import React from 'react';
import HospitalCard from './HospitalCard';
import './HospitalList.css'; 

const HospitalList = ({ hospitals, userLat, userLon }) => {
  // 병원이 없는 경우를 위한 처리
  if (!hospitals || hospitals.length === 0) {
    return (
      <div className="empty">
        10km 반경 내에 추천 가능한 병원이 없습니다.<br />
        아래 버튼을 눌러 전체 병원 목록을 확인해보세요.
      </div>
    );
  }

  return (

    <section className="hospital-list-section">
      <div className="section-header">
        <h2 className="section-title">추천 병원 TOP 3</h2>
        <p className="section-description">
          현재 위치로부터 10km 이내,<br />
          <span className="highlight">진료 가능 여부와 실시간 상황</span>을 종합 분석한 추천 결과입니다.
        </p>
      </div>
    <div className="hospital-list">
      {hospitals.map((hospital, index) => (
        <HospitalCard 
            key={hospital.hpid}
            hospital={hospital}
            rank={index+1}
            userLat = {userLat}
            userLon = {userLon}
        />
      ))}
    </div>
    </section>
  );
};

export default HospitalList;