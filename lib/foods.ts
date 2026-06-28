import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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


function inferCategory(name: string, bestTime: string): Category {
  if (!name) return "Snacks"
  const n = name.toLowerCase()
  
  // Drinks first — most specific
  if (["chai", "lassi", "water", "juice", "coffee", "milk", "doodh", 
       "sherbet", "tea", "soda", "latte", "smoothie", "coconut"].some(w => n.includes(w))) return "Drinks"
  
  // Sweets
  if (["halwa", "ladoo", "barfi", "kheer", "jalebi", "gulab", "chocolate", 
       "mithai", "pedha", "honey", "syrup", "kulfi", "falooda", "burfi",
       "rasgulla", "sandesh", "modak"].some(w => n.includes(w))) return "Sweets"
  
  // Dal & protein
  if (["dal", "rajma", "chhole", "sambar", "kadhi", "chana", "lentil", 
       "bean", "tofu", "chickpea", "moong", "masoor", "toor", "urad",
       "edamame", "legume"].some(w => n.includes(w))) return "Dal"
  
  // Rice & Roti
  if (["rice", "biryani", "roti", "naan", "puri", "paratha", "bread",
       "pasta", "pizza", "burger", "pancake", "waffle", "croissant", 
       "bagel", "couscous", "quinoa", "barley", "buckwheat"].some(w => n.includes(w))) return "Rice & Roti"
  
  // Breakfast
  if (["poha", "idli", "dosa", "upma", "chilla", "rava", "sabudana",
       "oatmeal", "oats", "cornflake", "muesli", "granola", "porridge",
       "uttapam", "appam", "puttu", "dhokla", "handvo", "thepla",
       "besan", "moong"].some(w => n.includes(w))) return "Breakfast"
  
  // use best_time as fallback
  if (bestTime === "morning") return "Breakfast"
  
  return "Snacks"
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
    category: inferCategory(row.name, row.best_time || ""),
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
  const { data, error } = await supabase
    .from("foods")
    .select("*")
    .order("pcos_score", { ascending: false })

  if (error) {
    console.error("Supabase error:", error)
    return []
  }

  return (data || []).map(transformRow)
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
