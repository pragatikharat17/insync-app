import { supabase } from "@/lib/supabase"

export type GiLevel = "low" | "medium" | "high"
export type Category =
  | "Breakfast"
  | "Rice & Roti"
  | "Dal"
  | "Snacks"
  | "Drinks"
  | "Sweets"
export type CyclePhase = "Menstrual" | "Follicular" | "Ovulatory" | "Luteal"

export interface Food {
  id: string
  name: string
  emoji: string
  category: Category
  gi: number
  giLevel: GiLevel
  pcosScore: number
  pcodScore: number
  pmsScore: number
  moodScore: number
  verdict: string
  hacks: [string, string, string]
  bestPhase: CyclePhase
  tags: string[]
}

export const categories: ("All" | Category)[] = [
  "All",
  "Breakfast",
  "Rice & Roti",
  "Dal",
  "Snacks",
  "Drinks",
  "Sweets",
]

export const phaseInfo: Record<CyclePhase, { emoji: string; note: string }> = {
  Menstrual: { emoji: "🌙", note: "Days 1–5 · replenish iron & rest" },
  Follicular: { emoji: "🌱", note: "Days 6–13 · energy is rising" },
  Ovulatory: { emoji: "☀️", note: "Days 14–16 · peak energy" },
  Luteal: { emoji: "🍂", note: "Days 17–28 · calm cravings & PMS" },
}

// maps food name to emoji — add more as needed
const foodEmojis: Record<string, string> = {
  "Poha": "🍚", "Idli": "⚪", "Dosa": "🫓", "Upma": "🥣",
  "Besan Chilla": "🥞", "Paratha": "🫓", "Aloo Paratha": "🫓",
  "Biryani": "🍛", "Khichdi": "🍲", "Curd Rice": "🍚",
  "Brown Rice": "🍚", "White Rice": "🍚", "Jeera Rice": "🍛",
  "Bajra Roti": "🫓", "Jowar Roti": "🫓", "Whole Wheat Roti": "🫓",
  "Dal Tadka": "🥣", "Moong Dal": "🥣", "Rajma": "🫘",
  "Chhole": "🫘", "Sambar": "🥣", "Paneer": "🧀",
  "Samosa": "🥟", "Vada Pav": "🍔", "Bhel Puri": "🥗",
  "Roasted Chana": "🫘", "Makhana": "🍿", "Popcorn": "🍿",
  "Masala Chai": "🫖", "Lassi": "🥛", "Coconut Water": "🥥",
  "Haldi Doodh": "🥛", "Jeera Water": "💧",
  "Jalebi": "🍩", "Gulab Jamun": "🟤", "Kheer": "🍮",
  "Dark Chocolate": "🍫",
}

function getEmoji(name: string): string {
  // try exact match first
  if (foodEmojis[name]) return foodEmojis[name]
  // try partial match
  for (const key of Object.keys(foodEmojis)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return foodEmojis[key]
  }
  return "🍽️"
}


function mapCategory(bestTime: string): Category {
  switch (bestTime) {
    case "morning": return "Breakfast"
    case "afternoon": return "Dal"
    case "evening": return "Snacks"
    default: return "Snacks"
  }
}

function inferPhase(phaseData: Record<string, string>): CyclePhase {
  // find the phase with "eat freely"
  for (const [phase, advice] of Object.entries(phaseData)) {
    if (advice.toLowerCase().includes("eat freely")) {
      if (phase === "menstrual") return "Menstrual"
      if (phase === "follicular") return "Follicular"
      if (phase === "ovulation") return "Ovulatory"
      if (phase === "luteal") return "Luteal"
    }
  }
  return "Follicular"
}

// transform Supabase row → Food type the UI expects
function transformRow(row: any): Food {
  const cyclePhase = {
    menstrual: row.phase_menstrual || "",
    follicular: row.phase_follicular || "",
    ovulation: row.phase_ovulation || "",
    luteal: row.phase_luteal || "",
  }

  return {
    id: row.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    name: row.name,
    emoji: getEmoji(row.name),
    category: (row.category as Category) || "Snacks",
    gi: row.glycemic_index || 50,
    giLevel: (row.gi_category as GiLevel) || "medium",
    pcosScore: row.pcos_score || 5,
    pcodScore: row.pcod_score || 5,
    pmsScore: row.pms_score || 5,
    moodScore: row.mood_score || 5,
    verdict: row.pcos_verdict || "",
    hacks: [
      row.hacks?.[0] || "Eat in moderation",
      row.hacks?.[1] || "Pair with protein",
      row.hacks?.[2] || "Avoid on empty stomach",
    ],
    bestPhase: inferPhase(cyclePhase),
    tags: [
      row.gi_category || "medium GI",
      row.inflammation_score || "neutral",
      row.best_time || "anytime",
    ].filter(Boolean),
  }
}

// fetch all foods from Supabase
export async function fetchFoods(): Promise<Food[]> {
  try {
    const { data, error } = await supabase
      .from("foods")
      .select("*")
      .order("pcos_score", { ascending: false })

    if (error) throw error
    if (!data || data.length === 0) throw new Error("No data returned")

    return data.map(transformRow)

  } catch (error) {
    console.error("Supabase failed, using fallback:", error)
    return FALLBACK_FOODS
  }
}

// search foods by name
export async function searchFoods(query: string): Promise<Food[]> {
  const { data, error } = await supabase
    .from("foods")
    .select("*")
    .ilike("name", `%${query}%`)
    .order("pcos_score", { ascending: false })
    .limit(50)

  if (error) {
    console.error("Supabase error:", error)
    return []
  }

  return (data || []).map(transformRow)
}

// keep these so existing UI code doesn't break
export function giColorClasses(level: GiLevel) {
  switch (level) {
    case "low": return "bg-[oklch(0.95_0.07_150)] text-[oklch(0.4_0.13_150)]"
    case "medium": return "bg-[oklch(0.95_0.08_70)] text-[oklch(0.5_0.14_60)]"
    case "high": return "bg-[oklch(0.94_0.06_25)] text-[oklch(0.5_0.2_25)]"
  }
}

export function giDotClass(level: GiLevel) {
  switch (level) {
    case "low": return "bg-[oklch(0.6_0.16_150)]"
    case "medium": return "bg-[oklch(0.7_0.16_60)]"
    case "high": return "bg-[oklch(0.6_0.22_25)]"
  }
}

export function scoreColor(score: number) {
  if (score >= 7) return "text-[oklch(0.5_0.15_150)]"
  if (score >= 4) return "text-[oklch(0.55_0.15_60)]"
  return "text-[oklch(0.55_0.2_25)]"
}

// fallback empty export so old imports don't crash before data loads
export const foods: Food[] = []

const FALLBACK_FOODS: Food[] = [
  {
    id: "besan-chilla", name: "Besan Chilla", emoji: "🥞",
    category: "Breakfast", gi: 28, giLevel: "low",
    pcosScore: 10, pcodScore: 9, pmsScore: 8, moodScore: 8,
    verdict: "PCOS superstar — high protein, almost no sugar spike.",
    hacks: ["Add spinach and paneer", "Cook in minimal ghee", "Add ajwain for bloating"],
    bestPhase: "Luteal", tags: ["high protein", "low GI"]
  },
  {
    id: "idli", name: "Idli", emoji: "⚪",
    category: "Breakfast", gi: 38, giLevel: "low",
    pcosScore: 9, pcodScore: 9, pmsScore: 8, moodScore: 9,
    verdict: "Best PCOS breakfast — fermented, light, gut-friendly.",
    hacks: ["Ferment 12+ hours", "Eat with sambar", "Max 2-3 pieces"],
    bestPhase: "Follicular", tags: ["fermented", "low GI"]
  },
  {
    id: "rajma", name: "Rajma", emoji: "🫘",
    category: "Dal", gi: 29, giLevel: "low",
    pcosScore: 8, pcodScore: 8, pmsScore: 7, moodScore: 7,
    verdict: "High protein, very low GI — keeps you full for hours.",
    hacks: ["Soak overnight", "Eat with brown rice", "Add ginger and hing"],
    bestPhase: "Luteal", tags: ["plant protein", "fibre"]
  },
]


export async function logMeal(foodName: string, mealType: string, userId: string) {
  const { error } = await supabase
    .from("meal_logs")
    .insert({ food_name: foodName, meal_type: mealType, user_id: userId })
  if (error) console.error("Meal log error:", error)
  return !error
}

export async function getTodaysMeals(sessionId: string) {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from("meal_logs")
    .select("*")
    .eq("session_id", sessionId)
    .gte("logged_at", today)
    .order("logged_at", { ascending: false })
  if (error) return []
  return data || []
}

export async function saveFood(foodName: string, sessionId: string) {
  await supabase.from("saved_foods")
    .upsert({ food_name: foodName, session_id: sessionId },
             { onConflict: "session_id,food_name" })
}

export async function unsaveFood(foodName: string, sessionId: string) {
  await supabase.from("saved_foods")
    .delete()
    .eq("food_name", foodName)
    .eq("session_id", sessionId)
}

export async function getSavedFoods(sessionId: string): Promise<string[]> {
  const { data } = await supabase
    .from("saved_foods")
    .select("food_name")
    .eq("session_id", sessionId)
  return data?.map((r: any) => r.food_name) || []
}