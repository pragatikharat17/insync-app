import json

def merge():
    # load both databases
    with open("hormone_food_db.json", "r", encoding="utf-8") as f:
        indian_foods = json.load(f)

    with open("western_food_db.json", "r", encoding="utf-8") as f:
        western_foods = json.load(f)

    # add cuisine tag to indian foods if not present
    for food in indian_foods:
        if "cuisine" not in food:
            food["cuisine"] = "indian"

    # merge
    all_foods = indian_foods + western_foods

    # remove duplicates by name
    seen = set()
    unique_foods = []
    for food in all_foods:
        if food["name"].lower() not in seen:
            seen.add(food["name"].lower())
            unique_foods.append(food)

    with open("hormone_food_db_complete.json", "w", encoding="utf-8") as f:
        json.dump(unique_foods, f, indent=2, ensure_ascii=False)

    # stats
    indian = [f for f in unique_foods if f.get("cuisine") == "indian"]
    western = [f for f in unique_foods if f.get("cuisine") == "western"]

    print(f"Merged database saved to hormone_food_db_complete.json")
    print(f"Total foods: {len(unique_foods)}")
    print(f"  Indian: {len(indian)}")
    print(f"  Western: {len(western)}")
    print(f"\nNext step: run 3_import_to_supabase.py with the complete database")

if __name__ == "__main__":
    merge()
