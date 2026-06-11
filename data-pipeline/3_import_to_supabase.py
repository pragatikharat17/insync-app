import json
import os
from dotenv import load_dotenv
load_dotenv()

# pip install supabase
from supabase import create_client

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")  # use service key, not anon key

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def flatten_food(food: dict) -> dict:
    """flatten nested JSON into Supabase table rows"""
    c = food["conditions"]
    n = food["nutrition"]
    cp = food["cycle_phase"]
    return {
        "name": food["name"],
        # nutrition
        "glycemic_index": n["glycemic_index"],
        "gi_category": n["gi_category"],
        "insulin_impact": n["insulin_impact"],
        "inflammation_score": n["inflammation_score"],
        "key_nutrients": n["key_nutrients"],  # stored as array
        # condition scores
        "pcos_score": c["pcos"]["score"],
        "pcos_verdict": c["pcos"]["verdict"],
        "pcos_why": c["pcos"]["why"],
        "pcod_score": c["pcod"]["score"],
        "pcod_verdict": c["pcod"]["verdict"],
        "pcod_why": c["pcod"]["why"],
        "pms_score": c["pms"]["score"],
        "pms_verdict": c["pms"]["verdict"],
        "pms_why": c["pms"]["why"],
        "mood_score": c["mood_swings"]["score"],
        "mood_verdict": c["mood_swings"]["verdict"],
        "mood_why": c["mood_swings"]["why"],
        # cycle phases
        "phase_menstrual": cp["menstrual"],
        "phase_follicular": cp["follicular"],
        "phase_ovulation": cp["ovulation"],
        "phase_luteal": cp["luteal"],
        # extras
        "hacks": food["hacks"],  # stored as array
        "swap_with": food.get("swap_with"),
        "best_time": food.get("best_time"),
        "regional_note": food.get("regional_note"),
    }

def main():
    with open("hormone_food_db_complete.json", "r") as f:
        foods = json.load(f)

    print(f"Importing {len(foods)} foods to Supabase...\n")

    success = 0
    failed = []

    for food in foods:
        try:
            row = flatten_food(food)
            supabase.table("foods").upsert(row, on_conflict="name").execute()
            print(f"  ✓ {food['name']}")
            success += 1
        except Exception as e:
            print(f"  ✗ {food['name']}: {e}")
            failed.append(food["name"])

    print(f"\nDone! {success} imported, {len(failed)} failed")
    if failed:
        print(f"Failed: {failed}")

if __name__ == "__main__":
    main()
