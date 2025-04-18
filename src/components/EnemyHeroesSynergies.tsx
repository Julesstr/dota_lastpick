import HeroIcon from "./HeroIcon";

interface Props {
  enemyTeamHeroes: string[];
  enemySynergies: number[];
  showSynergy: boolean;
}

const EnemyHeroesSynergies = ({
  enemyTeamHeroes,
  enemySynergies,
  showSynergy,
}: Props) => {
  return (
    <>
      <div className="row justify-content-center" style={{ marginTop: "10px" }}>
        {enemyTeamHeroes.map((heroName, index) => (
          <div className="col-md-2" key={index}>
            <HeroIcon heroName={heroName} enemy={true} />
          </div>
        ))}
      </div>
      <div className="row justify-content-center">
        {enemySynergies.map((value, index) => {
          const getColor = () => {
            if (value === 1000) return "white";
            if (!showSynergy) return "white";
            return value > 0 ? "#80ff80" : "#ff3333";
          };

          const getText = () => {
            if (value === 1000) return "N/A";
            if (!showSynergy) return "?";
            return value > 0 ? `+${value}%` : `${value}%`;
          };

          return (
            <div
              className="col-md-2"
              key={index}
              style={{
                color: getColor(),
                textAlign: "center",
              }}
            >
              {getText()}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default EnemyHeroesSynergies;
