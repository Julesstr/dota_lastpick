import { useState } from "react";
import GameIntroScreen from "./GameIntroScreen";
import GamePlayScreen from "./GamePlayScreen";

interface Props {
  difficulty: number;
  position: number;
  currentScore: number;
  highScore: number;
  setCurrentScore: (item: number) => void;
  setHighScore: (item: number) => void;
}

const GameScreen = ({
  difficulty,
  position,
  currentScore,
  highScore,
  setCurrentScore,
  setHighScore,
}: Props) => {
  const [gameIntroScreen, setGameIntroScreen] = useState(1);
  void difficulty;
  void position;

  return (
    <>
      <div>
        {gameIntroScreen === 1 && (
          <GameIntroScreen
            difficulty={difficulty}
            position={position}
            setGameIntroScreen={setGameIntroScreen}
          />
        )}
        {gameIntroScreen === 0 && (
          <GamePlayScreen
            difficulty={difficulty}
            position={position}
            currentScore={currentScore}
            highScore={highScore}
            setCurrentScore={setCurrentScore}
            setHighScore={setHighScore}
          ></GamePlayScreen>
        )}
      </div>
    </>
  );
};

export default GameScreen;
