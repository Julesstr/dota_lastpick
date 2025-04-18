import { Card } from "react-bootstrap";
import MenuButtons from "./MenuButtons";
import { useState } from "react";
import PlayMenu from "./PlayMenu";
import Disclaimer from "./Disclaimer";
import StartGameButton from "./StartGameButton";
import GameScreen from "./GameScreen";
import CustomSettingsMenu from "./CustomSettingsMenu";

import GameIntroScreen from "./GameIntroScreen";
import HomeButton from "./HomeButton";

function GameBox() {
  const [menuScreen, setMenuScreen] = useState(-1);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [difficulty, setDifficulty] = useState(-1);
  const [position, setPosition] = useState(-1);

  // Probably a bad solution, but these go to their respective buttons to turn on the start game button
  const [startEnabledDifficulty, setStartEnabledDifficulty] = useState(false);
  const [startEnabledPosition, setStartEnabledPosition] = useState(false);

  return (
    <Card
      className="m-3"
      style={{
        width: "80rem",
        height: "700px",
        border: "5px solid #1A1A1A",
        backgroundColor: "#1E2229",
      }}
    >
      <div className="row">
        <div className="col" style={{ color: "white" }}>
          Current Score: {currentScore}
        </div>
      </div>
      <div className="row">
        <div className="col" style={{ color: "white" }}>
          High Score: {highScore}
        </div>
      </div>
      <div className="row" style={{ padding: "10px" }}>
        <div className="col">
          <HomeButton
            setMenuScreen={setMenuScreen}
            setCurrentScore={setCurrentScore}
          ></HomeButton>
        </div>
      </div>

      <div className="row" style={{ padding: "60px" }}></div>
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <div className="container d-flex justify-content-center">
            {menuScreen === -1 && <MenuButtons setMenuScreen={setMenuScreen} />}
            {menuScreen === 0 && (
              <PlayMenu
                setDifficulty={setDifficulty}
                setPosition={setPosition}
                setStartEnabledDifficulty={setStartEnabledDifficulty}
                setStartEnabledPosition={setStartEnabledPosition}
              />
            )}
            {menuScreen === 1 && <Disclaimer />}
            {menuScreen === 2 && (
              <GameScreen
                difficulty={difficulty}
                position={position}
                currentScore={currentScore}
                highScore={highScore}
                setCurrentScore={setCurrentScore}
                setHighScore={setHighScore}
              />
            )}
            {menuScreen === 3 && <CustomSettingsMenu />}
          </div>
        </div>
        <div className="col-md-2"></div>
      </div>
      <div className="row" style={{ padding: "50px" }}>
        <div className="col-md-5"></div>
        <div className="col-md-2">
          <div
            className="container d-flex justify-content-center"
            style={{ color: "white" }}
          >
            {menuScreen === 0 && (
              <StartGameButton
                setMenuScreen={setMenuScreen}
                difficulty={difficulty}
                position={position}
                startEnabledDifficulty={startEnabledDifficulty}
                startEnabledPosition={startEnabledPosition}
              />
            )}
          </div>
        </div>
        <div className="col-md-5"></div>
      </div>
    </Card>
  );
}

export default GameBox;
