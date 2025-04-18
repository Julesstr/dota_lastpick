import Button from "react-bootstrap/Button";
import { useEffect } from "react";
interface Props {
  restart: boolean;
  currentScore: number;
  highScore: number;
  setHighScore: (item: number) => void;
  setInitialiseDraft: (item: boolean) => void;
  setGameOver: (item: boolean) => void;
  setShowSynergy: (item: boolean) => void;
  setShowRestartButton: (item: boolean) => void;
  setCurrentScore: (item: number) => void;
  setMessage: (item: string) => void;
}
const RestartButton = ({
  restart,
  currentScore,
  highScore,
  setHighScore,
  setInitialiseDraft,
  setGameOver,
  setShowSynergy,
  setShowRestartButton,
  setCurrentScore,
  setMessage,
}: Props) => {
  const handleClick = () => {
    if (restart) {
      setInitialiseDraft(true);
      setGameOver(false);
      setShowSynergy(false);
      setShowRestartButton(false);
      if (currentScore > highScore) {
        setHighScore(currentScore);
      }

      setCurrentScore(0);
    } else {
      setInitialiseDraft(true);
      setShowSynergy(false);
      setShowRestartButton(false);
      setMessage("");
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleClick();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div>
      <Button onClick={handleClick}>{restart ? "Restart" : "Next"}</Button>
    </div>
  );
};

export default RestartButton;
