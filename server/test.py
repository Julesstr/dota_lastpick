import pandas as pd

def findBestHero(opposing_lineup, allied_lineup, hero_pool, brackets):
    # request_data = request.json
    # opposing_lineup = request_data["opposing_lineup"]
    # allied_lineup = request_data["allied_lineup"]
    # hero_pool = request_data["hero_pool"]
    # brackets = request_data["brackets"]

    file_path = "./server/cache/"
    enemy_df = pd.read_csv(f"{file_path}{brackets}_vs_df_month.csv")
    ally_df = pd.read_csv(f"{file_path}{brackets}_with_df_month.csv")

    hero_pool = list(set(hero_pool) - set(opposing_lineup) - set(allied_lineup))

    enemy_df = enemy_df[(enemy_df["heroId1"].isin(hero_pool)) & (enemy_df["heroId2"].isin(opposing_lineup))].reset_index(drop=True)
    ally_df = ally_df[(ally_df["heroId1"].isin(hero_pool)) & (ally_df["heroId2"].isin(allied_lineup))].reset_index(drop=True)


    enemy_synergy = enemy_df.groupby("heroId1")["synergy"].sum().reset_index()

    enemy_synergy.sort_values(by="synergy", inplace=True, ascending=False)
        
    ally_synergy = ally_df.groupby("heroId1")["synergy"].sum().reset_index()


    synergy_df = enemy_synergy.merge(ally_synergy, on="heroId1", how="left").reset_index(drop=True)

    synergy_df["synergy"] = synergy_df["synergy_x"].fillna(0) + synergy_df["synergy_y"].fillna(0)

    synergy_df = synergy_df = synergy_df[["heroId1", "synergy"]]
    synergy_df.sort_values(by="synergy", inplace=True, ascending=False)
    synergy_df.reset_index(drop=True, inplace=True)

    best_hero_id = int(synergy_df["heroId1"][0])
    total_synergy = float(synergy_df["synergy"][0])

    enemy_synergies = enemy_df[enemy_df["heroId1"] == best_hero_id]["synergy"].tolist()
    ally_synergies = ally_df[ally_df["heroId1"] == best_hero_id]["synergy"].tolist()

    result = {"best_hero": best_hero_id, "total_synergy": total_synergy, "enemy_synergies": enemy_synergies, "ally_synergies": ally_synergies}

    return result

result = findBestHero([1,2,3,4], [5,6,7,8], [9,10,11,12,13], "[DIVINE_IMMORTAL]")
print(result)
