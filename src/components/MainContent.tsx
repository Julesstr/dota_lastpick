
import HeroLineup from "./HeroLineup";
import ShowSynergy from "./ShowSynergy";

const MainContent = () => {
  return (
    <div>
      <div className="row">
        <HeroLineup heroList={["axe", "bane", "meepo", "kez", "shredder"]} />
      </div>
      <div className="row">
        <ShowSynergy />
      </div>
      <div className="row">
        <HeroLineup heroList={["axe", "bane", "meepo", "kez", "shredder"]} />
      </div>
      <div className="row">
        <ShowSynergy />
      </div>
    </div>
  );
};

export default MainContent;
