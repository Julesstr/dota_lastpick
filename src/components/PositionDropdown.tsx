import Dropdown from "react-bootstrap/Dropdown";
import { useState } from "react";

import PositionButton from "./PositionButton";

interface Props {
  setPosition: (item: number) => void;
  setStartEnabledPosition: (item: boolean) => void;
}

const PositionDropdown = ({ setPosition, setStartEnabledPosition }: Props) => {
  const [positionDropdownTitle, setPositionDropdownTitle] = useState(
    "Choose your Position"
  );
  const positions = [
    "Safe Lane",
    "Mid Lane",
    "Off Lane",
    "Support",
    "Hard Support",
  ];
  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="success"
        id="dropdown-basic"
        style={{ width: "180px" }}
      >
        {positionDropdownTitle}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {positions.map((pos) => (
          <Dropdown.Item as="div" key={pos}>
            <PositionButton
              position={pos}
              setPosition={setPosition}
              setPositionDropdownTitle={setPositionDropdownTitle}
              setStartEnabledPosition={setStartEnabledPosition}
            />
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default PositionDropdown;
