import { useState } from "react";
import "./Home.css";
import location from "../assets/home/location.png"
import general from "../assets/home/general.png"
import pediatric from "../assets/home/pediatric.png"
import pregnant from "../assets/home/pregnant.png"
import { useNavigate } from "react-router-dom";
import { useLocation } from "../features/hospitals/hooks/recommend/useLocation"; // 훅 import

function Home() {
  const navigate = useNavigate(); // Hook 호출
  const { getLocation } = useLocation();
  const [message, setMessage] = useState("버튼을 눌러 내 주변 응급 병원을 확인하세요.");

  const handleCategoryClick = async (category) => {
    setMessage("위치 정보를 가져오는 중입니다...");

    try {
      // 훅이 위치 가져오는 복잡한 과정을 처리함
      const { lat, lon } = await getLocation();

      // 이동
      navigate(`/recommend/${category.toUpperCase()}?lat=${lat}&lon=${lon}`);
    } catch (err) {
      setMessage("위치 정보를 사용할 수 없습니다. 권한을 확인해주세요.");
      console.error(err);
    }
  };

  return (
    <div className="mainpage">
      <div className="container">
        <div className="content">
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
              onClick={() => handleCategoryClick("PEDIATRIC")}
            >
              <div className="btn-detail">
                <img src={pediatric} alt="pediatric icon" className="pediatric-img" />
                소아 응급
              </div>
            </button>

            <button
              className="recommend-button general"
              onClick={() => handleCategoryClick("GENERAL")}
            >
              <div className="btn-detail">
                <img src={general} alt="general icon" className="general-img" />
                일반 응급
              </div>
            </button>

            <button
              className="recommend-button pregnant"
              onClick={() => handleCategoryClick("PREGNANT")}
            >
              <div id ="btnDetail_wrap">
              <div className="btn-detail">
                <img src={pregnant} alt="pregnant icon" className="pregnant-img" />
                임산부 응급
              </div>
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