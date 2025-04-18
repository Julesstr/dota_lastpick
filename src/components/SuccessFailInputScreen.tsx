import GameOver from "./GameOver";
import MySearchBar from "./MySearchBar";
import RestartButton from "./RestartButton";
interface Props {
  gameOver: boolean;
  message: string;
  position: number;
  totalBestSynergy: number;
  chosenHeroRank: number;
  totalPossibleHeroes: number;
  showRestartButton: boolean;
  currentScore: number;
  highScore: number;
  enemyTeam: number[];
  allyTeam: number[];
  bestHero: number;
  heroAttributes: object;
  handleHeroSelect: (heroId: number) => void;
  setHighScore: (item: number) => void;
  setInitialiseDraft: (item: boolean) => void;
  setGameOver: (item: boolean) => void;
  setShowSynergy: (item: boolean) => void;
  setShowRestartButton: (item: boolean) => void;
  setCurrentScore: (item: number) => void;
  setMessage: (item: string) => void;
}

const SuccessFailInputScreen = (props: Props) => {
  return (
    <>
      <div className="row justify-content-center">
        <div className="col-md-5" style={{ color: "white" }}>
          <div
            className="container"
            style={{
              width: "400px",
              height: "130px",
              paddingTop: "20px",
            }}
          >
            {props.gameOver === false ? (
              <>
                {props.message ? (
                  <h4 style={{ color: "#80ff80" }}>{props.message}</h4>
                ) : (
                  <h4>Choose your Position {props.position} Hero!</h4>
                )}
              </>
            ) : (
              <GameOver
                bestHero={
                  // @ts-ignore
                  props.heroAttributes[props.bestHero]["localized_name"]
                }
                synergy={props.totalBestSynergy}
                rank={props.chosenHeroRank}
                totalHeroes={props.totalPossibleHeroes}
              />
            )}
          </div>
        </div>

        <div className="col-md-5">
          <div
            className="container"
            style={{ width: "200px", height: "130px", paddingTop: "30px" }}
          >
            {!props.showRestartButton ? (
              <MySearchBar
                position={props.position}
                onHeroSelect={props.handleHeroSelect}
                enemyTeam={props.enemyTeam}
                allyTeam={props.allyTeam}
              />
            ) : (
              <RestartButton
                restart={props.gameOver}
                currentScore={props.currentScore}
                highScore={props.highScore}
                setHighScore={props.setHighScore}
                setInitialiseDraft={props.setInitialiseDraft}
                setGameOver={props.setGameOver}
                setShowSynergy={props.setShowSynergy}
                setShowRestartButton={props.setShowRestartButton}
                setCurrentScore={props.setCurrentScore}
                setMessage={props.setMessage}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessFailInputScreen;
