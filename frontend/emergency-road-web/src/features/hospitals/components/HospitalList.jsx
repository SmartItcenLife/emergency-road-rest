// 병원 리스트(배열)를 받아 map()을 돌려 HospitalCard를 여러 개 렌더링하는 부모 컨테이너.import React from 'react';
import HospitalCard from './HospitalCard';
import './HospitalList.css';
import HospitalListFooter from './HospitalListFooter.jsx';
import SortSelect from "../../../features/hospitals/components/SortSelect.jsx";
import { useNavigate } from 'react-router-dom';
const HospitalList = ({ hospitals, userLat, userLon, config, category, sort, showRanking, showDistance, compact }) => {
  const navigate = useNavigate();
  const normalizedCategory = category?.toUpperCase();
  
  // 병원이 없는 경우를 위한 처리
  if (!hospitals || hospitals.length === 0) {
    return (
      <div className="empty">
        10km 반경 내에 추천 가능한 병원이 없습니다.<br />
        아래 버튼을 눌러 전체 병원 목록을 확인해보세요.
      </div>
    );
  }
  let type = "";
  if(category === "PEDIATRIC"){
    type="소아 응급";
  }else if(category === "GENERAL"){
      type="일반 응급";
  }else{
    type="임산부 응급";
  }


  return (
    <section className="hospital-list-section">

      {showRanking && (
        <div className="section-header">
          <h2 className="section-title"> {type} 추천 TOP 3</h2>
          <br></br>
          <p className="section-description">
            현재 위치로부터 10km 이내,<br />
            <span className="highlight">진료 가능 여부와 실시간 상황</span>을 종합 분석한 추천 결과입니다.
          </p>
          <button
            type = "button"
            className = "hospital-map-view-button"
            onClick={() => {
              const params = new URLSearchParams();

              if (normalizedCategory) {
                params.set("category",normalizedCategory);
              }

              navigate(`/map?${params.toString()}`);
            }
          }>지도보기
          </button>
        </div>
      )}
      {!showRanking && (
        <div className="hospital-list-toolbar">
          <div className="community-guide">
            병원 커뮤니티에 공유된 응급실 현장 상황을 확인해보세요.
          </div>

          <div className="hospital-list-top-row">
            <SortSelect sort={sort} />

            <div className="hospital-view-switch">
              <button type="button" className="hospital-view-switch__button active">
                리스트
              </button>

              <button type="button" className="hospital-view-switch__button" onClick={()=> {
                const params = new URLSearchParams();

                if (normalizedCategory) {
                  params.set("category", normalizedCategory);
                }

                navigate(`/map?${params.toString()}`);
                }
              }>
                지도
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="hospital-list">
        {hospitals.map((hospital, index) => (
          <HospitalCard
            key={hospital.hpid}
            hospital={hospital}
            rank={index + 1}
            userLat={userLat}
            userLon={userLon}
            config={config}
            category={category}
            showRanking={showRanking}
            showDistance={showDistance}
            compact={compact}
          />
        ))}
      </div>
      {showRanking && (
        <HospitalListFooter category={category} userLat={userLat} userLon={userLon} />
      )}
    </section>
  );
};

export default HospitalList;
