"use client"

import { useMemo, useState, useEffect } from "react"
import { Search, X, Leaf } from "lucide-react"
import { categories, fetchFoods, type Food, type Category } from "@/lib/foods"
import { FoodCard } from "@/components/food-card"
import { BottomNav, type Tab } from "@/components/bottom-nav"
import { SavedView, LogMealView, ProfileView } from "@/components/tab-views"
import { cn } from "@/lib/utils"

export function HarmonieApp() {
  const [tab, setTab] = useState<Tab>("Search")
  const [query, setQuery] = useState("")
  const [activeCat, setActiveCat] = useState<"All" | Category>("All")
  const [allFoods, setAllFoods] = useState<Food[]>([])
  useEffect(() => { fetchFoods().then(setAllFoods) }, [])
  const [savedIds, setSavedIds] = useState<string[]>(["besan-chilla"])

  function toggleSave(id: string) {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allFoods.filter((f) => {
      const matchCat = activeCat === "All" || f.category === activeCat
      const matchQuery =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q)) ||
        f.category.toLowerCase().includes(q)
      return matchCat && matchQuery
    })
  }, [query, activeCat])

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-background pb-24">
      {/* Header */}
      <header className="px-5 pt-8">
        <div className="flex items-center gap-2.5">
          <span
            className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"
            aria-hidden="true"
          >
            <Leaf className="size-5" />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-bold leading-none tracking-tight text-foreground">
              InSync
            </h1>
          </div>
        </div>
        <p className="mt-1.5 text-sm font-semibold text-accent-foreground">
          eat in sync with your cycle
        </p>
      </header>

      <main className="px-5 pt-6">
        {tab === "Search" && (
          <div className="space-y-4">
            {/* Search bar */}
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="search any Indian food..."
                aria-label="Search any Indian food"
                className="w-full rounded-full border border-input bg-card py-3.5 pl-12 pr-10 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-secondary"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Filter chips */}
            <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCat(cat)}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    activeCat === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Results */}
            <p className="text-xs font-medium text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "food" : "foods"}
            </p>

            <div className="space-y-3">
              {filtered.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  saved={savedIds.includes(food.id)}
                  onToggleSave={toggleSave}
                />
              ))}
              {filtered.length === 0 && (
                <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
                  <p className="font-heading font-semibold text-foreground">
                    No foods found
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try a different search or filter.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "Saved" && (
          <SavedView
            foods={allFoods}
            savedIds={savedIds}
            onToggleSave={toggleSave}
          />
        )}

        {tab === "Log Meal" && <LogMealView />}

        {tab === "Profile" && <ProfileView savedCount={savedIds.length} />}
      </main>

      <BottomNav active={tab} onChange={setTab} savedCount={savedIds.length} />
    </div>
  )
}
