"use client"

import { useState } from "react"
import { ChevronDown, Bookmark } from "lucide-react"
import {
  type Food,
  giColorClasses,
  giDotClass,
  scoreColor,
  phaseInfo,
} from "@/lib/foods"
import { cn } from "@/lib/utils"

function ScorePill({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-secondary/60 px-2 py-3">
      <span className={cn("font-heading text-xl font-bold", scoreColor(value))}>
        {value}
      </span>
      <span className="text-[11px] font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

export function FoodCard({
  food,
  saved,
  onToggleSave,
}: {
  food: Food
  saved: boolean
  onToggleSave: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const phase = phaseInfo[food.bestPhase]

  return (
    <article
      className={cn(
        "overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow",
        open && "shadow-md",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-4 text-left"
      >
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-3xl">
          <span aria-hidden="true">{food.emoji}</span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-base font-semibold leading-tight text-foreground text-balance">
            {food.name}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                giColorClasses(food.giLevel),
              )}
            >
              <span
                className={cn("size-1.5 rounded-full", giDotClass(food.giLevel))}
                aria-hidden="true"
              />
              GI {food.gi} · {food.giLevel}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
              PCOS{" "}
              <span className={scoreColor(food.pcosScore)}>
                {food.pcosScore}/10
              </span>
            </span>
          </div>
        </div>

        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="space-y-5 border-t border-border px-4 pb-5 pt-4">
          <div className="grid grid-cols-4 gap-2">
            <ScorePill label="PCOS" value={food.pcosScore} />
            <ScorePill label="PCOD" value={food.pcodScore} />
            <ScorePill label="PMS" value={food.pmsScore} />
            <ScorePill label="Mood" value={food.moodScore} />
          </div>

          <div className="rounded-2xl bg-secondary/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Verdict
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground">
              {food.verdict}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
              3 hacks
            </p>
            <ul className="space-y-2">
              {food.hacks.map((hack, i) => (
                <li key={i} className="flex gap-3 text-sm text-foreground">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="leading-snug">{hack}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border p-3">
            <span className="text-2xl" aria-hidden="true">
              {phase.emoji}
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Best in your {food.bestPhase} phase
              </p>
              <p className="text-xs text-muted-foreground">{phase.note}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onToggleSave(food.id)}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-colors",
              saved
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent",
            )}
          >
            <Bookmark
              className={cn("size-4", saved && "fill-current")}
              aria-hidden="true"
            />
            {saved ? "Saved" : "Save this food"}
          </button>
        </div>
      )}
    </article>
  )
}
