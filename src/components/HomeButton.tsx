import Button from "react-bootstrap/Button";
import { AiOutlineHome } from "react-icons/ai";

interface Props {
  setMenuScreen: (item: number) => void;
  setCurrentScore: (item: number) => void;
}
const HomeButton = ({ setMenuScreen, setCurrentScore }: Props) => {
  return (
    <Button
      variant="secondary"
      onClick={() => (setMenuScreen(-1), setCurrentScore(0))}
    >
      <AiOutlineHome size={25} />
    </Button>
  );
};

export default HomeButton;
