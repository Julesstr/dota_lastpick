import Button from "react-bootstrap/Button";

interface Props {
  difficulty: string;
  setDifficulty: (item: number) => void;
  setDifficultyDropdownTitle: (item: string) => void;
  setStartEnabledDifficulty: (item: boolean) => void;
}

type DifficultyMap = {
  [key: string]: number;
};

const DifficultyButton = ({
  difficulty,
  setDifficulty,
  setDifficultyDropdownTitle,
  setStartEnabledDifficulty,
}: Props) => {
  const difficultyValues: DifficultyMap = {
    Easy: 0,
    Intermediate: 1,
    Hard: 2,
    Custom: 3,
  };

  const handleClick = () => {
    setDifficulty(difficultyValues[difficulty]);
    setDifficultyDropdownTitle(difficulty);
    setStartEnabledDifficulty(true);
  };

  return (
    <Button variant="primary" onClick={() => handleClick()}>
      {difficulty}
    </Button>
  );
};

export default DifficultyButton;
