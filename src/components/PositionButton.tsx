import Button from "react-bootstrap/Button";

interface Props {
  position: string;
  setPosition: (item: number) => void;
  setPositionDropdownTitle: (item: string) => void;
  setStartEnabledPosition: (item: boolean) => void;
}

type PositionMap = {
  [key: string]: number;
};

const PositionButton = ({
  position,
  setPosition,
  setPositionDropdownTitle,
  setStartEnabledPosition,
}: Props) => {
  const positionValues: PositionMap = {
    "Safe Lane": 1,
    "Mid Lane": 2,
    "Off Lane": 3,
    Support: 4,
    "Hard Support": 5,
  };

  const handleClick = () => {
    setPosition(positionValues[position]);
    setPositionDropdownTitle(position);
    setStartEnabledPosition(true);
  };

  return (
    <Button variant="primary" onClick={() => handleClick()}>
      {position}
    </Button>
  );
};

export default PositionButton;
