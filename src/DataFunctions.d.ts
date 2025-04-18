export function updatePythonData(brackets: string): Promise<string>;
export function pythonPost(endpoint: string, data: any): Promise<string>;
export function findBestHero(opposingLineup: number[], alliedLineup: number[], heroPool: number[], brackets: string): Promise<object>;
export function getRandomElement<T>(array: T[]): T;
export function lineupValidity(lineup: number[], playerHeroId: number, opposingHeroIds: number[]): boolean;
export function generateLineup(positionData: { [key: number]: number[] }, playerPosition: number, opposingHeroIds: number[], heroAttributes: object): number[];
export function heroNumbersToNames(lineup: number[], heroAttributes: any): string[];
export function findHeroSynergy(opposingLineup: number[] , alliedLineup: number[], heroId:number, brackets: string): Promise<object>;
export function findHeroRank(
    opposingLineup: number[],
    alliedLineup: number[],
    heroPool: number[],
    heroId: number,
    brackets: string
): Promise<{
    hero_rank: number,
    total_heroes: number,
    hero_synergy: number,
    best_hero_synergy: number,
    best_hero_id: number
}>;