import HeroIcon from "./HeroIcon";
interface Props {
  heroList: string[];
}

const HeroLineup = ({ heroList: enemyHeroes }: Props) => {
  return (
    <>
      <div className="container">
        <div className="row">
          {enemyHeroes.map((hero, index) => (
            <div key={index} className="col-2">
              <div className="container mt-5">
                <div
                  className="border p-1 shadow rounded-2"
                  style={{ backgroundColor: "  #563471  " }}
                >
                  <HeroIcon heroName={hero} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HeroLineup;
