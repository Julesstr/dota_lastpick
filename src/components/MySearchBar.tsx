import { ReactSearchAutocomplete } from "react-search-autocomplete";
import heroAttributes from "../../server/heroAttributes.json";
import positionData from "../../server/cache/position_dict.json";
import { useState } from "react";

interface Props {
  position: number;
  onHeroSelect: (heroId: number) => void;
  enemyTeam: number[];
  allyTeam: number[];
}

const MySearchBar = ({
  position,
  onHeroSelect,
  enemyTeam,
  allyTeam,
}: Props) => {
  const [currentResults, setCurrentResults] = useState<any[]>([]);

  const items = Object.entries(heroAttributes)
    .filter(
      ([key]) =>
        //@ts-ignore
        positionData[position.toString()].includes(parseInt(key)) &&
        !enemyTeam.includes(parseInt(key)) &&
        !allyTeam.includes(parseInt(key))
    )
    .map(([key, hero]) => ({
      id: parseInt(key),
      name: hero.localized_name,
    }));

  const handleOnSearch = (string: string, results: any[]) => {
    setCurrentResults(results);
  };

  const handleOnHover = (result: any) => {};

  const handleOnSelect = (item: any) => {
    onHeroSelect(item.id);
  };

  const handleOnFocus = () => {};

  const formatResult = (item: any) => {
    return (
      <>
        <span style={{ display: "block", textAlign: "left" }}>{item.name}</span>
      </>
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentResults.length > 0) {
      // Get the best match (first result) and select it
      const bestMatch = currentResults[0];
      handleOnSelect(bestMatch);
      // Optionally clear the search
    }
  };

  return (
    <div onKeyDown={handleKeyPress}>
      <ReactSearchAutocomplete
        items={items}
        onSearch={handleOnSearch}
        onHover={handleOnHover}
        onSelect={handleOnSelect}
        onFocus={handleOnFocus}
        autoFocus
        formatResult={formatResult}
        fuseOptions={{
          keys: ["name"],
          threshold: 0.3,
          distance: 100,
          minMatchCharLength: 0,
          shouldSort: true,
          findAllMatches: false,
          location: 0,
        }}
      />
    </div>
  );
};

export default MySearchBar;
