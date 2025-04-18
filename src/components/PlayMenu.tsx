import DifficultyDropdown from "./DifficultyDropdown";
import PositionDropdown from "./PositionDropdown";

interface Props {
  setDifficulty: (item: number) => void;
  setPosition: (item: number) => void;
  setStartEnabledDifficulty: (item: boolean) => void;
  setStartEnabledPosition: (item: boolean) => void;
}
const PlayMenu = ({
  setDifficulty,
  setPosition,
  setStartEnabledDifficulty,
  setStartEnabledPosition,
}: Props) => {
  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <DifficultyDropdown
            setDifficulty={setDifficulty}
            setStartEnabledDifficulty={setStartEnabledDifficulty}
          />
        </div>
        <div className="col-md-6">
          <PositionDropdown
            setPosition={setPosition}
            setStartEnabledPosition={setStartEnabledPosition}
          />
        </div>
      </div>
    </>
  );
};

export default PlayMenu;
