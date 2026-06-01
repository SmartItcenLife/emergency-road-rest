import "./HospitalEmpty.css";

const HospitalEmpty = () => {
  return (
    <div className="empty">
      10km 반경 내에 추천 가능한 병원이 없습니다.
      <br />
      아래 버튼을 눌러 전체 병원 목록을 확인해보세요.
    </div>
  );
};

export default HospitalEmpty;