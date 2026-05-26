import { useState } from "react";
import "../styles/Home.css";

function Home() {
  const [message, setMessage] = useState("병원 추천을 위해 현재 위치 정보가 필요합니다.");

  const getLocation = (category) => {
    setMessage("📍 위치 정보를 요청 중입니다... 브라우저에서 허용해주세요.");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // 페이지 이동 처리
          window.location.href = `/recommend/rank?category=${category}&lat=${lat}&lon=${lon}`;
        },
        (error) => {
          setMessage("위치 권한이 거부되었습니다. 설정에서 허용해주세요.");
          console.error("Geolocation error:", error.code, error.message);
        }
      );
    } else {
      alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className= "content">
        <h1 className="title">응급의료 추천</h1>
        <p className="subtitle">
          현재 위치를 기반으로 가까운 응급 병원을 추천해드립니다.
        </p>

        <div className="info-box">
          📍 정확한 추천을 위해 위치 권한 허용이 필요합니다.
        </div>

        <div className="button-group">
          <button
            className="recommend-button pediatric"
            onClick={() => getLocation("PEDIATRIC")}
          >
            <span className="emoji">🧒</span>
            소아 응급 추천
          </button>

          <button
            className="recommend-button general"
            onClick={() => getLocation("GENERAL")}
          >
            <span className="emoji">🚑</span>
            일반 응급 추천
          </button>

          <button
            className="recommend-button pregnant"
            onClick={() => getLocation("PREGNANT")}
          >
            <span className="emoji">🤰</span>
            임산부 응급 추천
          </button>
        </div>

        <p className="geo-message">{message}</p>
      </div>
    </div>
    </div>
  );
}

export default Home;