// GameOver.tsx
interface Props {
  bestHero: string;
  synergy: number;
  rank?: number; // Add these new props
  totalHeroes?: number; // for the rank information
}

const GameOver = ({ bestHero, synergy, rank, totalHeroes }: Props) => {
  return (
    <div>
      <h4 style={{ color: "#ff3333" }}>Game Over!</h4>
      {rank && totalHeroes && (
        <p>
          Your pick was rank {rank} out of {totalHeroes} possible heroes
        </p>
      )}
      <p>
        Best hero: {bestHero} with{" "}
        <span style={{ color: synergy > 0 ? "#80ff80" : "#ff3333" }}>
          {synergy > 0 ? "+" : ""}
          {synergy}%
        </span>{" "}
        synergy
      </p>
    </div>
  );
};
export default GameOver;
