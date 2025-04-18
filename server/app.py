from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from data import Data, save_json, load_json, generate_heroes_per_position

app = Flask(__name__)
CORS(app)
@app.route("/update-stratz-data", methods=["POST"])
def update_straz_data():
    request_data = request.json
    update_stratz = request_data["update"]
    brackets = request_data["brackets"]
    if update_stratz == 1:
        api_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdWJqZWN0IjoiMWQ1NDAxYTYtNzE5Mi00MmUwLTk4MDctOTdhYzdkMzEzNDNhIiwiU3RlYW1JZCI6IjIxNzU5NDExMCIsIm5iZiI6MTczNzA1MTg5OCwiZXhwIjoxNzY4NTg3ODk4LCJpYXQiOjE3MzcwNTE4OTgsImlzcyI6Imh0dHBzOi8vYXBpLnN0cmF0ei5jb20ifQ.vwr-uQVMttXKJIWgP7Sp5fT_fwrhSSON4T9Nv4cIgYQ"

        file_path = "./server/cache/"
        stratz_data = Data(api_token, file_path)
        stratz_data.load_monthly_matchup_data(brackets)
        generate_heroes_per_position(stratz_data.load_monthly_position_data(brackets))
        

    return jsonify("success")

@app.route("/find-best-hero", methods=["POST"])
def findBestHero():
    request_data = request.json
    opposing_lineup = [x for x in request_data["opposing_lineup"] if x != 0]  
    allied_lineup = [x for x in request_data["allied_lineup"] if x != 0] 
    hero_pool = request_data["hero_pool"]
    brackets = request_data["brackets"]

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
    synergy_df = synergy_df[["heroId1", "synergy"]]
    synergy_df.sort_values(by="synergy", inplace=True, ascending=False)
    synergy_df.reset_index(drop=True, inplace=True)

    best_hero_id = int(synergy_df["heroId1"][0])
    total_synergy = float(synergy_df["synergy"][0])

    enemy_synergies = []
    ally_synergies = []

    enemy_df_best = enemy_df[enemy_df["heroId1"] == best_hero_id]
    ally_df_best = ally_df[ally_df["heroId1"] == best_hero_id]

    for enemy in opposing_lineup:
        temp_df = enemy_df_best[enemy_df_best["heroId2"] == enemy]
        if not temp_df.empty:
            enemy_synergies.append(round(temp_df["synergy"].iloc[0], 2))
        else:
            enemy_synergies.append(0)

    for ally in allied_lineup:
        temp_df = ally_df_best[ally_df_best["heroId2"] == ally]
        if not temp_df.empty:
            ally_synergies.append(round(temp_df["synergy"].iloc[0], 2))
        else:
            ally_synergies.append(0)

    result = {
        "best_hero": best_hero_id, 
        "total_synergy": round(total_synergy,2), 
        "enemy_synergies": enemy_synergies, 
        "ally_synergies": ally_synergies
    }
    print(result["enemy_synergies"])
    return jsonify(result)

@app.route("/find-hero-synergy", methods=["POST"])
def findHeroSynergy():
    request_data = request.json
    hero_id = request_data["heroId"]
    opposing_lineup = [x for x in request_data["opposing_lineup"] if x not in [0, hero_id]]  
    allied_lineup = [x for x in request_data["allied_lineup"] if x not in [0, hero_id]] 

    hero_id = request_data["heroId"]
    brackets = request_data["brackets"]


    file_path = "./server/cache/"
    enemy_df = pd.read_csv(f"{file_path}{brackets}_vs_df_month.csv")
    ally_df = pd.read_csv(f"{file_path}{brackets}_with_df_month.csv")

    enemy_synergies = []
    ally_synergies = []

    enemy_df = enemy_df[enemy_df["heroId1"] == hero_id]
    ally_df = ally_df[ally_df["heroId1"] == hero_id]

    for enemy in opposing_lineup:
        temp_df = enemy_df[enemy_df["heroId2"] == enemy]
        if not temp_df.empty:
            enemy_synergies.append(round(temp_df["synergy"].iloc[0], 2))
        else:
            enemy_synergies.append(0)

    for ally in allied_lineup:
        temp_df = ally_df[ally_df["heroId2"] == ally]
        if not temp_df.empty:
            ally_synergies.append(round(temp_df["synergy"].iloc[0], 2))
        else:
            ally_synergies.append(0)

    result = {"enemySynergies": enemy_synergies, "allySynergies": ally_synergies}
    print(result)
    return jsonify(result)


@app.route("/find-hero-rank", methods=["POST"])
def findHeroRank():
    request_data = request.json
    target_hero = request_data["heroId"]
    opposing_lineup = [x for x in request_data["opposing_lineup"] if x not in [0, target_hero]]  
    allied_lineup = [x for x in request_data["allied_lineup"] if x not in [0, target_hero]] 
    hero_pool = request_data["hero_pool"]
    brackets = request_data["brackets"]



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
    synergy_df = synergy_df[["heroId1", "synergy"]]
    synergy_df.sort_values(by="synergy", inplace=True, ascending=False)
    synergy_df.reset_index(drop=True, inplace=True)


    hero_rank = synergy_df.index[synergy_df["heroId1"] == target_hero].tolist()[0] + 1
    total_heroes = len(synergy_df)
    hero_synergy = float(synergy_df[synergy_df["heroId1"] == target_hero]["synergy"].iloc[0])


    best_hero_synergy = float(synergy_df["synergy"].iloc[0])
    best_hero_id = int(synergy_df["heroId1"].iloc[0])

    result = {
        "hero_rank": hero_rank,
        "total_heroes": total_heroes,
        "hero_synergy": round(hero_synergy, 2),
        "best_hero_synergy": round(best_hero_synergy, 2),
        "best_hero_id": best_hero_id
    }

    return jsonify(result)

# TODO make a function that clears the cache

        

if __name__ == "__main__":    
    app.run(debug=True)