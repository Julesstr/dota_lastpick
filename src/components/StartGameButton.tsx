import { useState } from "react";
import Button from "react-bootstrap/Button";

interface Props {
  setMenuScreen: (item: number) => void;
  difficulty: number;
  position: number;
  startEnabledDifficulty: boolean;
  startEnabledPosition: boolean;
}

const StartGameButton = ({
  setMenuScreen,
  difficulty,
  position,
  startEnabledDifficulty,
  startEnabledPosition
}: Props) => {
  const isEnabled =
    startEnabledDifficulty !== false && startEnabledPosition !== false;

  const handleClick = () => {
    if (difficulty === 3) {
      setMenuScreen(3);
    } else {
      setMenuScreen(2);
    }
  };
  return (
    <Button
      variant="primary"
      onClick={() => handleClick()}
      disabled={!isEnabled}
    >
      Start Game!
    </Button>
  );
};

export default StartGameButton;
