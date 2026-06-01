import mascotGif from "../../../assets/emergencygil_running_mascot.gif";
import "./Spinner.css";

function Spinner() {
    console.log(mascotGif);
  return (
    <div className="spinner">
      <img
        src={mascotGif}
        alt="로딩 중"
        className="spinner-mascot"
      />
    </div>
  );
}

export default Spinner;