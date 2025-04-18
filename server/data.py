import requests
from urllib.parse import urljoin
import pandas as pd
import json
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta



def get_thursday_epoc(weeks_back):
    today = datetime.now()
    days_to_subtract = (today.weekday() - 3) % 7

    last_thursday = today - timedelta(days=days_to_subtract + 7 * weeks_back)
   
    last_thursday = last_thursday.replace(hour=0, minute=0, second=0, microsecond=0)
   
    return int(last_thursday.timestamp())



def save_json(data, cache_path, name):
    with open(f"{cache_path}{name}.json", "w") as file:
        json.dump(data, file, indent=4)

def load_json(cache_path, name):
    try:
        with open(f"{cache_path}{name}.json", "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return None
    

class Data():
    def __init__(self, api_token, cache_path):
        self.cache_path = cache_path        
        self.api_token = api_token    
        self.hero_ids = list(range(1, 151))  



    def load_monthly_matchup_data(self, brackets):
        vs_dfs = []
        with_dfs = []
        

        for week in range(4):
            unique_name = f"matchups_{brackets}_{week}"    
            

                    
            week_epoc = get_thursday_epoc(week)
          
            query = f"""
            {{
            heroStats {{
                matchUp(take: 150, bracketBasicIds: {brackets}, orderBy: 2, week: {week_epoc}) {{
                vs {{
                    heroId1
                    heroId2
                    winsAverage
                    synergy
                    matchCount
                }}
                with {{
                    heroId1
                    heroId2
                    winsAverage
                    synergy
                    matchCount
                }}
                }}
            }}
            }}
            """
            raw_matchup_data = self.initialize_data(unique_name, query)
            vs_df, with_df = self.dataframify_matchup_data(raw_matchup_data)
            vs_dfs.append(vs_df)
            with_dfs.append(with_df)

        
        vs_df_monthly = self.create_monthly_matchup_dfs(vs_dfs)
        with_df_monthly = self.create_monthly_matchup_dfs(with_dfs)
        vs_df_monthly.to_csv(f"{self.cache_path}{brackets}_vs_df_month.csv", index=False)
        with_df_monthly.to_csv(f"{self.cache_path}{brackets}_with_df_month.csv", index=False)

        return vs_df_monthly, with_df_monthly

    def load_monthly_position_data(self, brackets):
        hero_pos_dfs = []
        
        for week in range(4):
            week_epoc = get_thursday_epoc(week)
            week_dfs = []
            for position_num in range(1,6):
                
                position = f"POSITION_{position_num}"

                unique_name = f"{position}_{brackets}_{week}"
                query = f"""
                {{
                heroStats {{
                    stats(positionIds: {position} bracketBasicIds:{brackets}, week: {week_epoc}) {{
                    heroId
                    matchCount
                    }}
                }}
                }}
                """
                raw_position_data = self.initialize_data(unique_name, query)
                position_df = self.dataframify_position_data(unique_name, raw_position_data, position_num)
                week_dfs.append(position_df)

            hero_pos_dfs.append(self.merge_hero_pos_dfs(week_dfs))
            
        return self.create_monthly_pos_df(hero_pos_dfs)



    def initialize_data(self, unique_name, query):
        
        data = load_json(self.cache_path, unique_name)
        if not data:
            data = self.post_query(unique_name, query)


        return data
    
    def post_query(self, unique_name, query):
        headers = {
        "Authorization": f"Bearer {self.api_token}",
        "Content-Type": "application/json",
        "User-Agent": "STRATZ_API"
    }
        graphql_endpoint = "https://api.stratz.com/graphql"

        response = requests.post(graphql_endpoint, headers=headers, json={"query": query})
        if response.status_code == 200:
            response_json = response.json()
            save_json(response_json, self.cache_path, unique_name)
            return response.json()
        else:
            raise Exception(f"Failed to fetch data: {response.status_code} {response.text}")
        
    def dataframify_matchup_data(self, raw_matchup_data):
            
        vs_data = []
        for match_up in raw_matchup_data["data"]["heroStats"]["matchUp"]:
            vs_data.extend(match_up["vs"])

        vs_df = pd.DataFrame(vs_data)

        with_data = []
        for match_up in raw_matchup_data["data"]["heroStats"]["matchUp"]:
            with_data.extend(match_up["with"])

        with_df = pd.DataFrame(with_data)

        return vs_df, with_df
        
    def dataframify_position_data(self, unique_name, raw_position_data, position_num):
        try:
            position_df = pd.read_csv(f"{self.cache_path}vs_{unique_name}.csv")
        
        except FileNotFoundError:
            
            
            position_df = pd.DataFrame(raw_position_data["data"]["heroStats"]["stats"])
            position_df.rename(columns={"matchCount": position_num}, inplace=True)
            
            return position_df


    def find_synergy(self, df, heroId1, heroId2):
               
        synergy_value = df.loc[
            ((df["heroId1"] == heroId1) & (df["heroId2"] == heroId2)) |
            ((df["heroId1"] == heroId2) & (df["heroId2"] == heroId1)),
            "synergy"
        ]

        
        result = synergy_value.iloc[0] if not synergy_value.empty else None

        return result
    
    def create_monthly_matchup_dfs(self, dfs):
        combined_df = pd.concat(dfs)
        result = combined_df.groupby(["heroId1", "heroId2"]).agg({
            "winsAverage": "mean",  #
            "synergy": "mean",      
            "matchCount": "sum",    
        }).reset_index()

        return result

    def merge_hero_pos_dfs(self, week_dfs):
        return week_dfs[0].merge(week_dfs[1], on="heroId", how="left") \
                                 .merge(week_dfs[2], on="heroId", how="left") \
                                 .merge(week_dfs[3], on="heroId", how="left") \
                                 .merge(week_dfs[4], on="heroId", how="left") \

    def create_monthly_pos_df(self, dfs):
        combined_df = pd.concat(dfs)
 
        result = combined_df.groupby(["heroId"]).agg({
            1: "sum",  
            2: "sum",      
            3: "sum",    
            4: "sum",
            5: "sum"
        }).reset_index()
        
        result["total"] = 0
        for i in range(1,6):
            result["total"] += result[i]
       
        return result    

def generate_heroes_per_position(position_data):

    position_dict = {}

    for position in range(1,6):
        position_data[position] /= position_data["total"]
    
        played_heroes = position_data[position_data[position] >= 0.2]
      
        position_dict[position] = list(played_heroes["heroId"])
    
    
    
    return position_dict

        
        
def main(): 
    load_dotenv()
    api_token = os.getenv("API_TOKEN")
    cache_path = "./server/cache/"
    brackets = "[LEGEND_ANCIENT, DIVINE_IMMORTAL]"

    data = Data(api_token, cache_path)

    data.load_monthly_matchup_data(brackets)
    position_dict = generate_heroes_per_position(data.load_monthly_position_data(brackets))
    generate_heroes_per_position(data.load_monthly_position_data(brackets))
    save_json(position_dict, cache_path, "position_dict")

  


if __name__ == "__main__":
    main()