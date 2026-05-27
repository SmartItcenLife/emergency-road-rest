import { useState } from "react";
import "../styles/Home.css";
import location from "../assets/home/location.png"
import general from "../assets/home/general.png"
import children from "../assets/home/children.png"
import pregnant from "../assets/home/pregnant.png"

function Home() {
  const [message, setMessage] = useState("버튼을 눌러 내 주변 응급 병원을 확인하세요.");

  const getLocation = (category) => {
    setMessage("위치 정보를 요청 중입니다... 브라우저에서 허용해주세요.");

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
        <h1 className="title">지금 병원이 필요하신가요?</h1>
        <p className="subtitle">
          매우 위급한 상황이라면 즉시 119로 신고하세요.
        </p>
     <div className="info-box">
        <img src={location} alt="location icon" className="location-img" />
         정확한 추천을 위해 위치 권한 허용이 필요합니다.
        </div>

        <div className="button-group">
          <button
            className="recommend-button pediatric"
            onClick={() => getLocation("PEDIATRIC")}
          >
             <div className="btn-detail">
            {/* <span className="emoji">🧒</span> */}
               <img src={children} alt="children icon" className="children-img" />
               소아 응급
               </div>
          </button>

          <button
            className="recommend-button general"
            onClick={() => getLocation("GENERAL")}
          >
            {/* <span className="emoji">🚑</span> */}
            <div className="btn-detail">
              <img src={general} alt="general icon" className="general-img" />
               일반 응급
            </div>
          </button>

          <button
            className="recommend-button pregnant"
            onClick={() => getLocation("PREGNANT")}
          >
            <div className="btn-detail">
            {/* <span className="emoji">🤰</span> */}
              <img src={pregnant} alt="pregnant icon" className="pregnant-img" />

            임산부 응급
            </div>
          </button>
        </div>

        <p className="geo-message">{message}</p>
      </div>
    </div>
    </div>
  );
}

export default Home;