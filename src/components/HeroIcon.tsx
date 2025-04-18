import { getImage } from "../ImagePreloader";

interface Props {
  heroName: string;
  enemy: boolean;
}

const HeroIcon = ({ heroName, enemy }: Props) => {
  const colour = enemy ? "#f33333" : "#80ff80";

  const imagePath =
    heroName !== ""
      ? `/panorama/images/heroes/selection/npc_dota_hero_${heroName}_png.png`
      : `/panorama/images/heroes/selection/empty.png`;

  const cachedImage = getImage(imagePath);
  const imageSource = cachedImage?.src || imagePath;

  return (
    <div
      className="container d-flex justify-content-center"
      style={{ padding: "0px" }}
    >
      <div className="p-1 shadow rounded-2" style={{ backgroundColor: colour }}>
        <img
          src={imageSource}
          className="img-fluid"
          alt={heroName || "empty"}
          style={{
            width: "142px",
            height: "188px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
          loading="eager"
        />
      </div>
    </div>
  );
};

export default HeroIcon;
