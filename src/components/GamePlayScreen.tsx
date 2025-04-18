import { Card } from "react-bootstrap";
import HeroIcon from "./HeroIcon";
import {
  generateLineup,
  updatePythonData,
  heroNumbersToNames,
  findBestHero,
  findHeroSynergy,
  findHeroRank,
} from "../DataFunctions";
import positionData from "../../server/cache/position_dict.json";
import heroAttributes from "../../server/heroAttributes.json";
import { useEffect, useState } from "react";
import MySearchBar from "./MySearchBar";
import GameOver from "./GameOver";
import { resourceLimits } from "worker_threads";
import RestartButton from "./RestartButton";
import EnemyHeroesSynergies from "./EnemyHeroesSynergies";
import SuccessFailInputScreen from "./SuccessFailInputScreen";
import AllyHeroesSynergies from "./AllyHeroesSynergies";

interface Props {
  difficulty: number;
  position: number;
  currentScore: number;
  highScore: number;
  setCurrentScore: (item: number) => void;
  setHighScore: (item: number) => void;
}

interface HeroData {
  best_hero: number;
  total_synergy: number;
  enemy_synergies: number[];
  ally_synergies: number[];
}

interface SynergyData {
  enemySynergies: number[];
  allySynergies: number[];
}

interface heroRank {
  hero_rank: number;
  total_heroes: number;
  hero_synergy: number;
  best_hero_synergy: number;
  best_hero_id: number;
}

const GamePlayScreen = ({
  difficulty,
  position,
  currentScore,
  highScore,
  setCurrentScore,
  setHighScore,
}: Props) => {
  const [initialiseDraft, setInitialiseDraft] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [enemyTeam, setEnemyTeam] = useState<number[]>([]);
  const [allyTeam, setAllyTeam] = useState<number[]>([]);
  const [enemyTeamHeroes, setEnemyTeamHeroes] = useState<string[]>([]);
  const [allyTeamHeroes, setAllyTeamHeroes] = useState<string[]>([]);
  const [enemySynergies, setEnemySynergies] = useState<number[]>([]);
  const [allySynergies, setAllySynergies] = useState<number[]>([]);
  const [heroData, setHeroData] = useState<HeroData>({
    best_hero: 0,
    total_synergy: 0,
    enemy_synergies: [],
    ally_synergies: [],
  });
  const [showSynergy, setShowSynergy] = useState(false);
  const [playerHeroId, setPlayerHeroId] = useState(1000);
  const [bestHero, setBestHero] = useState(0);
  const [totalBestSynergy, setTotalBestSynergy] = useState(0);
  const [showRestartButton, setShowRestartButton] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [chosenHeroRank, setChosenHeroRank] = useState(-1);
  const [totalPossibleHeroes, setTotalPossibleHeroes] = useState(-1);
  let dotaRanksConsidered: string = "[LEGEND_ANCIENT, DIVINE_IMMORTAL]";

  useEffect(() => {
    if (!initialiseDraft) return;
    setInitialiseDraft(false);

    const setupGame = async () => {
      if (difficulty === 0) {
        const newEnemyTeam = generateLineup(
          positionData,
          position,
          [],
          heroAttributes
        );
        newEnemyTeam.splice(2, 0, 0);
        const newAllyTeam = [0, 0, 0, 0, 0];

        setEnemyTeam(newEnemyTeam);
        setAllyTeam(newAllyTeam);
        setEnemyTeamHeroes(heroNumbersToNames(newEnemyTeam, heroAttributes));
        setAllyTeamHeroes(heroNumbersToNames(newAllyTeam, heroAttributes));

        try {
          const result = (await findBestHero(
            newEnemyTeam,
            newAllyTeam,
            positionData[position as unknown as "1" | "2" | "3" | "4" | "5"], // steve was here
            dotaRanksConsidered
          )) as HeroData;

          let newEnemySynergies = [...result.enemy_synergies];
          newEnemySynergies.splice(2, 0, 1000);

          setHeroData(result as HeroData);
          setEnemySynergies(newEnemySynergies);
          setAllySynergies([1000, 1000, 1001, 1000, 1000]);
          setBestHero(result.best_hero);
          setTotalBestSynergy(result.total_synergy);
        } catch (error) {
          console.error("Error updating data:", error);
        }
      } else if (difficulty === 1) {
        const newEnemyTeam = generateLineup(
          positionData,
          position,
          [],
          heroAttributes
        );
        newEnemyTeam.splice(2, 0, 0);
        const newAllyTeam = generateLineup(
          positionData,
          position,
          newEnemyTeam,
          heroAttributes
        );
        newAllyTeam.splice(2, 0, 0);

        setEnemyTeam(newEnemyTeam);
        setAllyTeam(newAllyTeam);
        setEnemyTeamHeroes(heroNumbersToNames(newEnemyTeam, heroAttributes));
        setAllyTeamHeroes(heroNumbersToNames(newAllyTeam, heroAttributes));

        try {
          const result = (await findBestHero(
            newEnemyTeam,
            newAllyTeam,
            positionData[position as unknown as "1" | "2" | "3" | "4" | "5"], // steve was here
            dotaRanksConsidered
          )) as HeroData;
          setBestHero(result.best_hero);
          setHeroData(result as HeroData);

          let newEnemySynergies = [...result.enemy_synergies];
          newEnemySynergies.splice(2, 0, 1000);
          setEnemySynergies(newEnemySynergies);

          let newAllySynergies = [...result.ally_synergies];
          newAllySynergies.splice(2, 0, 1001);
          setAllySynergies(newAllySynergies);
          setTotalBestSynergy(result.total_synergy);
        } catch (error) {
          console.error("Error updating data:", error);
        }
      }
    };

    setupGame();
  }, [difficulty, position, initialiseDraft]);

  const handleHeroSelect = async (heroId: number) => {
    setPlayerHeroId(heroId);
    let revealedAllyTeam = allyTeam;
    revealedAllyTeam.splice(2, 1, heroId);

    if (heroId === heroData["best_hero"]) {
      setMessage("Correct!");
      setShowRestartButton(true);
      //@ts-ignore
      setCurrentScore((prev) => prev + 1);

      setShowSynergy(true);
    } else {
      // if not the best option
      setGameOver(true);
      setShowRestartButton(true);

      try {
        // Get synergy data
        const synergyResult = (await findHeroSynergy(
          enemyTeam,
          allyTeam,
          heroId,
          dotaRanksConsidered
        )) as SynergyData;

        // Get rank data
        const rankResult = await findHeroRank(
          enemyTeam,
          allyTeam,
          positionData[position as unknown as "1" | "2" | "3" | "4" | "5"],
          heroId,
          dotaRanksConsidered
        );

        // Set message based on rank
        setChosenHeroRank(rankResult.hero_rank);
        setTotalPossibleHeroes(rankResult.total_heroes);
        setMessage("");

        setAllyTeamHeroes(heroNumbersToNames(revealedAllyTeam, heroAttributes));

        if (difficulty === 0) {
          let newEnemySynergies = [...synergyResult.enemySynergies];
          let newAllySynergies = [1000, 1000, 1001, 1000, 1000];
          newEnemySynergies.splice(2, 0, 1000);
          setEnemySynergies(newEnemySynergies);
          setAllySynergies(newAllySynergies);
        } else if (difficulty === 1) {
          let newEnemySynergies = [...synergyResult.enemySynergies];
          let newAllySynergies = [...synergyResult.allySynergies];
          newEnemySynergies.splice(2, 0, 1000);
          newAllySynergies.splice(2, 0, 1001);
          setEnemySynergies(newEnemySynergies);
          setAllySynergies(newAllySynergies);
        }

        setShowSynergy(true);
      } catch (error) {
        console.error("Error getting data:", error);
      }
    }
  };

  const propsForSuccessFailScreen = {
    gameOver,
    message,
    position,
    totalBestSynergy,
    chosenHeroRank,
    totalPossibleHeroes,
    showRestartButton,
    currentScore,
    highScore,
    enemyTeam,
    allyTeam,
    bestHero,
    heroAttributes,
    handleHeroSelect,
    setHighScore,
    setInitialiseDraft,
    setGameOver,
    setShowSynergy,
    setShowRestartButton,
    setCurrentScore,
    setMessage,
  };

  return (
    <div className="container d-flex" style={{ marginTop: "-175px" }}>
      <Card
        className="m-3"
        style={{
          width: "55rem",
          height: "600px",
          border: "1px solid #FFFFFF",
          backgroundColor: "#1E2229",
        }}
      >
        <EnemyHeroesSynergies
          enemyTeamHeroes={enemyTeamHeroes}
          enemySynergies={enemySynergies}
          showSynergy={showSynergy}
        />

        <SuccessFailInputScreen {...propsForSuccessFailScreen} />

        <AllyHeroesSynergies
          allyTeamHeroes={allyTeamHeroes}
          allySynergies={allySynergies}
          showSynergy={showSynergy}
        />
      </Card>
    </div>
  );
};

export default GamePlayScreen;
