"use client"

import { Search, Bookmark, NotebookPen, User, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type Tab = "Search" | "Saved" | "Log Meal" | "Ask" | "Profile"

const items: { tab: Tab; label: string; icon: typeof Search }[] = [
  { tab: "Search", label: "Search", icon: Search },
  { tab: "Saved", label: "Saved", icon: Bookmark },
  { tab: "Log Meal", label: "Log Meal", icon: NotebookPen },
  { tab: "Ask", label: "Ask", icon: MessageCircle },
  { tab: "Profile", label: "Profile", icon: User },
]

export function BottomNav({
  active,
  onChange,
  savedCount,
}: {
  active: Tab
  onChange: (tab: Tab) => void
  savedCount: number
}) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {items.map(({ tab, label, icon: Icon }) => {
          const isActive = active === tab
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[11px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <span className="relative">
                <Icon
                  className={cn("size-6", isActive && "stroke-[2.5]")}
                  aria-hidden="true"
                />
                {tab === "Saved" && savedCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {savedCount}
                  </span>
                )}
              </span>
              {label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}