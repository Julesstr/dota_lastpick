import HeroIcon from "./HeroIcon";

interface Props {
  allyTeamHeroes: string[];
  allySynergies: number[];
  showSynergy: boolean;
}

const AllyHeroesSynergies = ({
  allyTeamHeroes,
  allySynergies,
  showSynergy,
}: Props) => {
  return (
    <>
      <div className="row justify-content-center">
        {allySynergies.map((value, index) => {
          const getColor = () => {
            if (value === 1000) return "white";
            if (!showSynergy) return "white";
            return value > 0 ? "#80ff80" : "#ff3333";
          };

          const getText = () => {
            if (value === 1000) return "N/A";
            if (value === 1001) return "Your Hero";
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
      <div className="row justify-content-center" style={{ marginTop: "10px" }}>
        {allyTeamHeroes.map((heroName, index) => (
          <div className="col-md-2" key={index}>
            <HeroIcon heroName={heroName} enemy={false} />
          </div>
        ))}
      </div>
    </>
  );
};

export default AllyHeroesSynergies;
