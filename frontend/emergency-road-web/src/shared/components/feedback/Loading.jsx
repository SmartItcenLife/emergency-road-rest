import Spinner from "./Spinner";
import "./Loading.css";

function Loading({ text }) {
     console.log("Loading 렌더링");
  return (
    <div className="loading">
      <Spinner />
      <p>{text}</p>
    </div>
  );
}

export default Loading;