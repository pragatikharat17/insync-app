"use client"

import { useEffect, useState } from "react"
import {
  NotebookPen,
  Sparkles,
  Flame,
  Heart,
  Check,
  ChevronDown,
} from "lucide-react"
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

const CONDITIONS = ["PCOS", "PCOD", "PMS", "All"] as const
const PHASES = ["Menstrual", "Follicular", "Ovulatory", "Luteal"] as const
const STORAGE_KEY = "insync-profile"

type Profile = {
  name: string
  condition: (typeof CONDITIONS)[number]
  phase: (typeof PHASES)[number]
}

const DEFAULT_PROFILE: Profile = {
  name: "Aanya",
  condition: "PCOS",
  phase: "Luteal",
}

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wide text-accent-foreground"
      >
        {label}
      </label>
      <div className="relative mt-1.5">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-input bg-secondary/50 px-4 py-3 pr-10 text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

export function ProfileView({ savedCount }: { savedCount: number }) {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)
  const [draft, setDraft] = useState<Profile>(DEFAULT_PROFILE)
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = { ...DEFAULT_PROFILE, ...JSON.parse(raw) } as Profile
        setProfile(parsed)
        setDraft(parsed)
      }
    } catch {
      // ignore malformed storage
    }
  }, [])

  const dirty =
    draft.name !== profile.name ||
    draft.condition !== profile.condition ||
    draft.phase !== profile.phase

  function save() {
    const cleaned: Profile = { ...draft, name: draft.name.trim() || "You" }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned))
    setProfile(cleaned)
    setDraft(cleaned)
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
  }

  const stats = [
    { label: "Foods saved", value: savedCount },
    { label: "Meals logged", value: 24 },
    { label: "Day streak", value: 6 },
  ]

  const initial = profile.name.trim().charAt(0).toUpperCase() || "Y"

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
          {initial}
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">
            {profile.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            Tracking {profile.condition} · {profile.phase} phase
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

      <div className="space-y-4 rounded-3xl border border-border bg-card p-5">
        <h3 className="font-heading text-base font-bold text-foreground">
          Your details
        </h3>

        <div>
          <label
            htmlFor="profile-name"
            className="text-xs font-semibold uppercase tracking-wide text-accent-foreground"
          >
            Name
          </label>
          <input
            id="profile-name"
            value={draft.name}
            onChange={(e) =>
              setDraft((d) => ({ ...d, name: e.target.value }))
            }
            placeholder="Your name"
            className="mt-1.5 w-full rounded-2xl border border-input bg-secondary/50 px-4 py-3 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <SelectField
          id="profile-condition"
          label="Condition"
          value={draft.condition}
          options={CONDITIONS}
          onChange={(v) =>
            setDraft((d) => ({ ...d, condition: v as Profile["condition"] }))
          }
        />

        <SelectField
          id="profile-phase"
          label="Cycle phase"
          value={draft.phase}
          options={PHASES}
          onChange={(v) =>
            setDraft((d) => ({ ...d, phase: v as Profile["phase"] }))
          }
        />

        <button
          type="button"
          onClick={save}
          disabled={!dirty && !justSaved}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition disabled:opacity-50"
        >
          {justSaved ? (
            <>
              <Check className="size-4" aria-hidden="true" />
              Saved
            </>
          ) : (
            "Save profile"
          )}
        </button>
      </div>

      <div className="rounded-3xl bg-primary p-5 text-primary-foreground">
        <Sparkles className="size-6" aria-hidden="true" />
        <p className="mt-2 font-heading font-semibold">Today&apos;s tip</p>
        <p className="mt-1 text-sm leading-relaxed text-primary-foreground/90">
          You&apos;re in your {profile.phase.toLowerCase()} phase — lean into
          magnesium-rich foods like makhana and bajra to ease cravings and PMS.
        </p>
      </div>
    </div>
  )
}
