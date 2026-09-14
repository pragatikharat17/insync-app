"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Leaf } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit() {
    setLoading(true)
    setError("")
    
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setError("Check your email to confirm your account!")
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push("/")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="flex items-center gap-2.5 mb-2">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Leaf className="size-6" />
        </span>
        <h1 className="text-3xl font-bold text-foreground">InSync</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-12">eat in sync with your cycle</p>

      <div className="w-full max-w-sm space-y-3">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border border-input bg-card px-4 py-3.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full rounded-2xl border border-input bg-card px-4 py-3.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />

        {error && (
          <p className="text-sm text-center text-red-500">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          className="w-full bg-primary text-primary-foreground rounded-2xl px-6 py-4 text-sm font-medium disabled:opacity-40"
        >
          {loading ? "Loading..." : isSignUp ? "Create account" : "Sign in"}
        </button>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-sm text-muted-foreground"
        >
          {isSignUp ? "Already have an account? Sign in" : "New here? Create account"}
        </button>
      </div>
    </div>
  )
}