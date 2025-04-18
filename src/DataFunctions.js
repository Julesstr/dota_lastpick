export async function pythonPost(url, payload) {
    try {
        const response = await fetch(`http://localhost:5000/${url}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" 
            },
            body: JSON.stringify(payload),
            mode: 'cors', 
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}



export async function updatePythonData(brackets) {
    let data = await pythonPost("update-stratz-data", {
        update: 1,
        brackets: brackets
    })
    return data;
}

export async function findBestHero(opposingLineup, alliedLineup, heroPool, brackets) {
    let data = await pythonPost("find-best-hero", {
        opposing_lineup: opposingLineup,
        allied_lineup: alliedLineup,
        hero_pool: heroPool,
        brackets: brackets
    })
    return data
}

export async function findHeroSynergy(opposingLineup, alliedLineup, heroId, brackets){
    let data = await pythonPost("find-hero-synergy", {
        opposing_lineup: opposingLineup,
        allied_lineup: alliedLineup,
        heroId: heroId,
        brackets: brackets
    })
    return data
}


export async function findHeroRank(opposingLineup, alliedLineup, heroPool, heroId, brackets) {
    let data = await pythonPost("find-hero-rank", {
        opposing_lineup: opposingLineup,
        allied_lineup: alliedLineup,
        hero_pool: heroPool,
        heroId: heroId,
        brackets: brackets
    });
    return data;
}



export function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function lineupValidity(lineup, opposingHeroIds) {

    for (const opposingHero of opposingHeroIds) {
        if (lineup.includes(opposingHero)) {
            return false;
        }
    }

    const hasDuplicates = lineup.length !== new Set(lineup).size;
    if (hasDuplicates) {
        return false;
    }

    return true;

}

export function generateLineup(positionData, playerPosition, opposingHeroIds, heroAttributes) {
    let lineup = [];

    for (let i = 1; i < 6; i++) {
        if (i != playerPosition) {
            lineup.push(getRandomElement(positionData[i]));
        }
    }

    lineup = [...lineup].sort(() => Math.random() - 0.5);

    const validity = lineupValidity(lineup, opposingHeroIds)

    if (!validity) {
        lineup = generateLineup(positionData, playerPosition, opposingHeroIds)
    } 

    return lineup;
}

export function heroNumbersToNames(lineup, heroAttributes) {
    return lineup.map(heroId => {
 
        const hero = heroAttributes[heroId.toString()];
        

        if (!hero) return "";
        
        return hero.name.replace("npc_dota_hero_", "");
    });
}





// const require = createRequire(import.meta.url);
// let positionData = require("../server/cache/position_dict.json");





// let playerPosition = 0;



// let enemyLineup = generateLineup(positionData, playerPosition, [])

// const x = await findBestHero(enemyLineup, [], positionData[2], "[DIVINE_IMMORTAL]")
// console.log(x)
// console.log(heroAttributes[x[0]]["name"])

// const alliedLineup = generateLineup(positionData, playerPosition, enemyLineup)



// generateSynergy(playerHeroId, enemyLineup, alliedLineup)


