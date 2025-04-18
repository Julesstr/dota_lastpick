import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";

interface Props {
  difficulty: number;
  position: number;
  setGameIntroScreen: (item: number) => void;
}

const GameIntroScreen = ({
  difficulty,
  position,
  setGameIntroScreen,
}: Props) => {
  let introText = "";
  if (difficulty === 0) {
    introText = `You are playing on Easy mode. \n\nLastpick the best position ${position} hero based on the four enemy heroes you see.`;
  } else if (difficulty === 1) {
    introText = `You are playing on Intermediate mode. \n\nLastpick the best positiion ${position} hero based on the four enenmy heroes and four ally heroes you see`;
  } else if (difficulty === 2) {
    introText = `You are playing on Hard mode. \n\n Lastpick the best position ${position} hero based on the four enemy heroes and four ally heroes you see, as well as the position ${position} hero the enemy will lastpick based off your team.`;
  }

  return (
    <Card
      style={{
        width: "30rem",
        height: "300px",
        border: "1px solid #3A4048",
        backgroundColor: "#2A2E35",
        marginTop: "-80px",
      }}
    >
      <div className="row" style={{ padding: "10px" }}></div>
      <div className="container">
        <h5
          style={{
            color: "white",
            justifySelf: "center",
            whiteSpace: "pre-line",
          }}
        >
          {introText}
        </h5>
      </div>
      <div className="row" style={{ padding: "50px" }}>
        <div className="container d-flex justify-content-center">
          <Button variant="secondary" onClick={() => setGameIntroScreen(0)}>
            Let's go{" "}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GameIntroScreen;
