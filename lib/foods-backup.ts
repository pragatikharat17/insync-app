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
  pcosScore: number // out of 10
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

export const foods: Food[] = [
  {
    id: "poha",
    name: "Vegetable Poha",
    emoji: "🍚",
    category: "Breakfast",
    gi: 52,
    giLevel: "low",
    pcosScore: 8,
    pcodScore: 8,
    pmsScore: 7,
    moodScore: 7,
    verdict:
      "A gentle, fibre-rich breakfast that keeps blood sugar steady. Great PCOS pick when you load it with veggies and peanuts.",
    hacks: [
      "Add a fistful of roasted peanuts for protein + healthy fats.",
      "Throw in peas, carrot and onion to slow the glucose spike.",
      "Squeeze lemon on top — vitamin C boosts iron absorption.",
    ],
    bestPhase: "Follicular",
    tags: ["high fibre", "vegetarian", "quick"],
  },
  {
    id: "idli",
    name: "Idli (2 pcs)",
    emoji: "⚪",
    category: "Breakfast",
    gi: 60,
    giLevel: "medium",
    pcosScore: 7,
    pcodScore: 7,
    pmsScore: 6,
    moodScore: 6,
    verdict:
      "Steamed and fermented, so it's light on the gut. Pair smartly to avoid a sugar dip an hour later.",
    hacks: [
      "Eat with sambar, not just chutney, for lentil protein.",
      "Choose a millet or oats idli batter for a lower GI.",
      "Avoid more than 2–3 — the rice base adds up fast.",
    ],
    bestPhase: "Ovulatory",
    tags: ["fermented", "steamed", "south indian"],
  },
  {
    id: "besan-chilla",
    name: "Besan Chilla",
    emoji: "🥞",
    category: "Breakfast",
    gi: 28,
    giLevel: "low",
    pcosScore: 10,
    pcodScore: 9,
    pmsScore: 8,
    moodScore: 8,
    verdict:
      "A PCOS superstar. High-protein gram flour with almost no sugar spike — your hormones will thank you.",
    hacks: [
      "Stuff with grated paneer and spinach for extra protein + iron.",
      "Cook in minimal cold-pressed oil or ghee.",
      "Add ajwain to ease bloating during your luteal phase.",
    ],
    bestPhase: "Luteal",
    tags: ["high protein", "low GI", "gluten free"],
  },
  {
    id: "jeera-rice",
    name: "Jeera Rice",
    emoji: "🍛",
    category: "Rice & Roti",
    gi: 73,
    giLevel: "high",
    pcosScore: 4,
    pcodScore: 4,
    pmsScore: 5,
    moodScore: 6,
    verdict:
      "White rice spikes insulin quickly. Enjoy in small portions and pair with protein + fibre to soften the impact.",
    hacks: [
      "Swap to brown or hand-pounded rice to drop the GI.",
      "Keep the portion to one cupped-hand serving.",
      "Always pair with dal, curd or veggies — never eat alone.",
    ],
    bestPhase: "Ovulatory",
    tags: ["comfort food", "pair with protein"],
  },
  {
    id: "bajra-roti",
    name: "Bajra Roti",
    emoji: "🫓",
    category: "Rice & Roti",
    gi: 54,
    giLevel: "low",
    pcosScore: 9,
    pcodScore: 9,
    pmsScore: 8,
    moodScore: 7,
    verdict:
      "Millet roti is mineral-dense and low GI — one of the best grain swaps for insulin resistance.",
    hacks: [
      "Rich in iron & magnesium — eases PMS cramps.",
      "Pair with a sabzi and curd for a balanced plate.",
      "Best eaten warm; add ghee for satiety and slower digestion.",
    ],
    bestPhase: "Menstrual",
    tags: ["millet", "low GI", "iron rich"],
  },
  {
    id: "moong-dal",
    name: "Moong Dal",
    emoji: "🥣",
    category: "Dal",
    gi: 38,
    giLevel: "low",
    pcosScore: 9,
    pcodScore: 9,
    pmsScore: 8,
    moodScore: 8,
    verdict:
      "Light, easy to digest and protein-packed. A reliable everyday PCOS staple.",
    hacks: [
      "Add a tadka of jeera + curry leaves for digestion.",
      "Throw in spinach or lauki to bump up fibre.",
      "Pair with bajra roti instead of rice for a lower GI meal.",
    ],
    bestPhase: "Follicular",
    tags: ["high protein", "easy to digest"],
  },
  {
    id: "rajma",
    name: "Rajma",
    emoji: "🫘",
    category: "Dal",
    gi: 29,
    giLevel: "low",
    pcosScore: 8,
    pcodScore: 8,
    pmsScore: 7,
    moodScore: 7,
    verdict:
      "Kidney beans are protein- and fibre-rich with a very low GI — keeps you full for hours.",
    hacks: [
      "Soak overnight and cook well to reduce bloating.",
      "Eat with a small portion of brown rice, not white.",
      "Add ginger and hing to the gravy to ease gas.",
    ],
    bestPhase: "Luteal",
    tags: ["fibre", "plant protein"],
  },
  {
    id: "samosa",
    name: "Samosa",
    emoji: "🥟",
    category: "Snacks",
    gi: 71,
    giLevel: "high",
    pcosScore: 2,
    pcodScore: 2,
    pmsScore: 3,
    moodScore: 6,
    verdict:
      "Deep-fried refined flour + potato — a fast insulin spike and inflammatory fats. Save it for rare treats.",
    hacks: [
      "Air-fry or bake a wheat-based version at home.",
      "Pair with a side of salad to slow digestion.",
      "Limit to once in a while; never on an empty stomach.",
    ],
    bestPhase: "Ovulatory",
    tags: ["fried", "occasional treat"],
  },
  {
    id: "roasted-makhana",
    name: "Roasted Makhana",
    emoji: "🍿",
    category: "Snacks",
    gi: 35,
    giLevel: "low",
    pcosScore: 9,
    pcodScore: 9,
    pmsScore: 8,
    moodScore: 8,
    verdict:
      "Fox nuts are the perfect crunchy, low-GI snack — light, mineral-rich and PCOS-friendly.",
    hacks: [
      "Dry-roast in a little ghee with pink salt & pepper.",
      "Great low-calorie swap for chips during cravings.",
      "Rich in magnesium — helps with luteal-phase mood dips.",
    ],
    bestPhase: "Luteal",
    tags: ["low GI", "crunchy", "magnesium"],
  },
  {
    id: "masala-chai",
    name: "Masala Chai (no sugar)",
    emoji: "🫖",
    category: "Drinks",
    gi: 20,
    giLevel: "low",
    pcosScore: 6,
    pcodScore: 6,
    pmsScore: 6,
    moodScore: 7,
    verdict:
      "Fine without sugar, but caffeine can worsen anxiety and cortisol. Keep it to one cup a day.",
    hacks: [
      "Skip sugar; sweeten with a little cinnamon instead.",
      "Use less milk or try it black to reduce bloating.",
      "Avoid on an empty stomach — it can spike cortisol.",
    ],
    bestPhase: "Follicular",
    tags: ["caffeine", "limit"],
  },
  {
    id: "spiced-buttermilk",
    name: "Spiced Buttermilk (Chaas)",
    emoji: "🥛",
    category: "Drinks",
    gi: 15,
    giLevel: "low",
    pcosScore: 9,
    pcodScore: 9,
    pmsScore: 8,
    moodScore: 7,
    verdict:
      "Gut-friendly probiotic drink that cools the body and aids digestion — excellent for PCOS.",
    hacks: [
      "Add roasted jeera powder and curry leaves.",
      "Use fresh curd; skip the salt if you're bloated.",
      "Great post-lunch to steady blood sugar.",
    ],
    bestPhase: "Menstrual",
    tags: ["probiotic", "hydrating"],
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun",
    emoji: "🟤",
    category: "Sweets",
    gi: 75,
    giLevel: "high",
    pcosScore: 1,
    pcodScore: 1,
    pmsScore: 4,
    moodScore: 7,
    verdict:
      "Sugar syrup + fried khoya — one of the highest-impact sweets for insulin. Strictly an occasional indulgence.",
    hacks: [
      "Have just one, and right after a high-protein meal.",
      "Walk for 10 minutes afterward to blunt the spike.",
      "Try a date-and-nut ladoo as a lower-GI craving fix.",
    ],
    bestPhase: "Ovulatory",
    tags: ["high sugar", "rare treat"],
  },
  {
    id: "date-ladoo",
    name: "Date & Nut Ladoo",
    emoji: "🟫",
    category: "Sweets",
    gi: 45,
    giLevel: "medium",
    pcosScore: 7,
    pcodScore: 7,
    pmsScore: 8,
    moodScore: 9,
    verdict:
      "Naturally sweetened with dates and packed with nuts — a smart way to satisfy a sweet tooth without refined sugar.",
    hacks: [
      "No added sugar — dates + nuts only.",
      "The iron in dates helps during your period.",
      "Stick to 1–2; dates are still sugar-dense.",
    ],
    bestPhase: "Menstrual",
    tags: ["no refined sugar", "iron rich"],
  },
]

export function giColorClasses(level: GiLevel) {
  switch (level) {
    case "low":
      return "bg-[oklch(0.95_0.07_150)] text-[oklch(0.4_0.13_150)]"
    case "medium":
      return "bg-[oklch(0.95_0.08_70)] text-[oklch(0.5_0.14_60)]"
    case "high":
      return "bg-[oklch(0.94_0.06_25)] text-[oklch(0.5_0.2_25)]"
  }
}

export function giDotClass(level: GiLevel) {
  switch (level) {
    case "low":
      return "bg-[oklch(0.6_0.16_150)]"
    case "medium":
      return "bg-[oklch(0.7_0.16_60)]"
    case "high":
      return "bg-[oklch(0.6_0.22_25)]"
  }
}

export function scoreColor(score: number) {
  if (score >= 7) return "text-[oklch(0.5_0.15_150)]"
  if (score >= 4) return "text-[oklch(0.55_0.15_60)]"
  return "text-[oklch(0.55_0.2_25)]"
}
