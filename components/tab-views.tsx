"use client"

import { useState } from "react"
import { NotebookPen, User, Sparkles, Flame, Heart } from "lucide-react"
import type { Food } from "@/lib/foods"
import { FoodCard } from "@/components/food-card"

export function SavedView({
  foods,
  savedIds,
  onToggleSave,
}: {
  foods: Food[]
  savedIds: string[]
  onToggleSave: (id: string) => void
}) {
  const saved = foods.filter((f) => savedIds.includes(f.id))

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Saved foods
        </h2>
        <p className="text-sm text-muted-foreground">
          Your hormone-friendly favourites, all in one place.
        </p>
      </div>

      {saved.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
          <Heart className="size-8 text-primary" aria-hidden="true" />
          <p className="font-heading font-semibold text-foreground">
            Nothing saved yet
          </p>
          <p className="text-sm text-muted-foreground">
            Tap the bookmark on any food to keep it here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {saved.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              saved
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function LogMealView() {
  const [meal, setMeal] = useState("")
  const [logged, setLogged] = useState<string[]>([
    "Besan Chilla · Breakfast",
    "Moong Dal + Bajra Roti · Lunch",
  ])

  function add() {
    if (!meal.trim()) return
    setLogged((l) => [meal.trim(), ...l])
    setMeal("")
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Log a meal
        </h2>
        <p className="text-sm text-muted-foreground">
          Track what you eat to spot patterns with your cycle.
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-4">
        <label
          htmlFor="meal-input"
          className="text-xs font-semibold uppercase tracking-wide text-primary"
        >
          What did you eat?
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="meal-input"
            value={meal}
            onChange={(e) => setMeal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="e.g. Poha with peanuts"
            className="min-w-0 flex-1 rounded-full border border-input bg-secondary/50 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="button"
            onClick={add}
            className="flex items-center gap-1 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
          >
            <NotebookPen className="size-4" aria-hidden="true" />
            Log
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">Today</p>
        {logged.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3"
          >
            <Flame className="size-4 text-primary" aria-hidden="true" />
            <span className="text-sm text-foreground">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProfileView({ savedCount }: { savedCount: number }) {
  const stats = [
    { label: "Foods saved", value: savedCount },
    { label: "Meals logged", value: 24 },
    { label: "Day streak", value: 6 },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
          A
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">
            Aanya
          </h2>
          <p className="text-sm text-muted-foreground">
            Tracking PCOS · Luteal phase 🍂
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-3 text-center"
          >
            <p className="font-heading text-2xl font-bold text-primary">
              {s.value}
            </p>
            <p className="text-[11px] font-medium text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-primary p-5 text-primary-foreground">
        <Sparkles className="size-6" aria-hidden="true" />
        <p className="mt-2 font-heading font-semibold">Today&apos;s tip</p>
        <p className="mt-1 text-sm leading-relaxed text-primary-foreground/90">
          You&apos;re in your luteal phase — lean into magnesium-rich foods like
          makhana and bajra to ease cravings and PMS.
        </p>
      </div>

      <div className="space-y-2">
        {["My conditions", "Cycle settings", "Notifications", "Help & support"].map(
          (item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3.5"
            >
              <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                <User className="size-4 text-muted-foreground" aria-hidden="true" />
                {item}
              </span>
              <span className="text-muted-foreground" aria-hidden="true">
                ›
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  )
}
