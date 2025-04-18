import Dropdown from "react-bootstrap/Dropdown";
import { useState } from "react";
import DifficultyButton from "./DifficultyButton";

interface Props {
  setDifficulty: (item: number) => void;
  setStartEnabledDifficulty: (item: boolean) => void;
}
const DifficultyDropdown = ({
  setDifficulty,
  setStartEnabledDifficulty,
}: Props) => {
  const [difficultyDropdownTitle, setDifficultyDropdownTitle] =
    useState("Choose Difficulty");
  const difficulties = ["Easy", "Intermediate", "Hard", "Custom"];
  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="success"
        id="dropdown-basic"
        style={{ width: "180px" }}
      >
        {difficultyDropdownTitle}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {difficulties.map((diff) => (
          <Dropdown.Item as="div" key={diff}>
            <DifficultyButton
              difficulty={diff}
              setDifficulty={setDifficulty}
              setDifficultyDropdownTitle={setDifficultyDropdownTitle}
              setStartEnabledDifficulty={setStartEnabledDifficulty}
            ></DifficultyButton>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DifficultyDropdown;
