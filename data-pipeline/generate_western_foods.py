from groq import Groq
import json
import time
import os
from dotenv import load_dotenv
load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Western foods with known GI values from University of Sydney database
# GI values are sourced from published research / University of Sydney GI database
WESTERN_FOODS = [
    # Breads
    "White bread", "Whole wheat bread", "Sourdough bread", "Rye bread",
    "Multigrain bread", "Bagel", "Croissant", "Pita bread",

    # Breakfast cereals
    "Oatmeal (rolled oats)", "Cornflakes", "Muesli", "Granola",
    "Weetabix", "Bran flakes", "Porridge",

    # Grains & pasta
    "White pasta", "Whole wheat pasta", "Brown rice", "White rice",
    "Quinoa", "Couscous", "Barley", "Buckwheat",

    # Dairy
    "Full fat milk", "Skimmed milk", "Greek yogurt", "Plain yogurt",
    "Cottage cheese", "Cheddar cheese", "Butter",

    # Fruits
    "Apple", "Banana", "Orange", "Strawberries", "Blueberries",
    "Grapes", "Watermelon", "Mango", "Pineapple", "Avocado",
    "Dates", "Cherries",

    # Vegetables
    "Broccoli", "Spinach", "Kale", "Sweet potato", "White potato",
    "Carrots", "Beetroot", "Pumpkin", "Zucchini", "Bell pepper",
    "Cauliflower", "Brussels sprouts",

    # Legumes
    "Chickpeas (canned)", "Lentils", "Black beans", "Kidney beans",
    "Edamame", "Tofu",

    # Proteins
    "Eggs (boiled)", "Grilled chicken", "Salmon", "Tuna (canned)",
    "Almonds", "Walnuts", "Cashews", "Peanut butter", "Chia seeds",
    "Flaxseeds", "Pumpkin seeds",

    # Snacks & processed
    "Dark chocolate (70%+)", "Milk chocolate", "Popcorn (plain)",
    "Rice cakes", "Crackers", "Potato chips", "Pretzels",

    # Drinks
    "Black coffee", "Green tea", "Orange juice", "Apple juice",
    "Coconut water", "Whole milk latte", "Diet soda", "Sports drink",

    # Sweeteners & condiments
    "Honey", "Maple syrup", "White sugar", "Brown sugar",
    "Stevia", "Agave syrup",

    # Fast food & common meals
    "Pizza (cheese)", "Burger (beef)", "French fries",
    "Omelette", "Pancakes", "Waffles", "Smoothie (fruit)",
    "Protein bar", "Energy bar",
]

SYSTEM_PROMPT = """You are a clinical nutritionist specialising in PCOS, PCOD, PMS and hormone health.
You have deep knowledge of Western foods and their glycemic index values from published research including the University of Sydney GI database.
Be accurate with GI values — use published research data where available.
Be honest and specific. No generic advice."""

def analyse_food(food_name: str) -> dict:
    prompt = f"""Analyse "{food_name}" for women across all 4 hormone conditions.
Use accurate GI values from published research (University of Sydney GI database where available).
Return ONLY valid JSON, no markdown:

{{"name":"{food_name}","nutrition":{{"glycemic_index":<accurate number 1-100>,"gi_category":"<low|medium|high>","insulin_impact":"<low|medium|high>","inflammation_score":"<anti-inflammatory|neutral|pro-inflammatory>","key_nutrients":["<top 2 hormone-relevant nutrients>"]}},"conditions":{{"pcos":{{"score":<1-10>,"verdict":"<max 12 words>","why":"<max 10 words>"}},"pcod":{{"score":<1-10>,"verdict":"<max 12 words>","why":"<max 10 words>"}},"pms":{{"score":<1-10>,"verdict":"<max 12 words>","why":"<max 10 words>"}},"mood_swings":{{"score":<1-10>,"verdict":"<max 12 words>","why":"<max 10 words>"}}}},"cycle_phase":{{"menstrual":"<eat freely|moderately|avoid>","follicular":"<eat freely|moderately|avoid>","ovulation":"<eat freely|moderately|avoid>","luteal":"<eat freely|moderately|avoid>"}},"hacks":["<tip1>","<tip2>","<tip3>"],"swap_with":"<better alternative or null>","best_time":"<morning|afternoon|evening|anytime>","regional_note":null,"cuisine":"western"}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    raw = response.choices[0].message.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())


def main():
    results = []
    failed = []

    # resume if file exists
    if os.path.exists("western_food_db.json"):
        with open("western_food_db.json", "r") as f:
            results = json.load(f)
        done = {r["name"] for r in results}
        todo = [f for f in WESTERN_FOODS if f not in done]
        print(f"Resuming — {len(results)} done, {len(todo)} remaining\n")
    else:
        todo = WESTERN_FOODS
        print(f"Starting — {len(todo)} western foods to analyse\n")

    print("=" * 60)

    for i, food in enumerate(todo):
        try:
            print(f"[{i+1}/{len(todo)}] {food}...")
            data = analyse_food(food)
            results.append(data)

            c = data["conditions"]
            print(f"  PCOS {c['pcos']['score']}/10 | GI: {data['nutrition']['glycemic_index']} ({data['nutrition']['gi_category']})")

            # save after every food
            with open("western_food_db.json", "w", encoding="utf-8") as f:
                json.dump(results, f, indent=2, ensure_ascii=False)

            time.sleep(2)

        except Exception as e:
            print(f"  ✗ Failed: {e}")
            failed.append(food)
            time.sleep(3)

    print(f"\n{'='*60}")
    print(f"Done! {len(results)} western foods analysed.")
    if failed:
        print(f"Failed: {failed}")
    print(f"\nNext step: run merge_databases.py to combine with Indian foods")


if __name__ == "__main__":
    main()
