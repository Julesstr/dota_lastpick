import { useEffect } from "react";
import "../App.css";
import GameBox from "./components/GameBox";
import { preloadImages } from "./ImagePreloader";

const App = () => {
  useEffect(() => {
    preloadImages();
  }, []);
  return (
    <>
      <div
        className="row text-center"
        style={{
          padding: "10px",
          fontFamily: "fantasy",
        }}
      >
        <h1 style={{ color: "#963737" }}></h1>
      </div>
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <div className="container d-flex justify-content-center">
            <GameBox />
          </div>
        </div>
        <div className="col-md-2"> </div>
      </div>
    </>
  );
};

export default App;
