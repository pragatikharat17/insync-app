"use client"
import { useState, useRef, useEffect } from "react"

interface Message {
  role: "user" | "ai"
  content: string
}

interface AskViewProps {
  condition?: string
  phase?: string
}

export function AskView({ condition = "PCOS", phase = "Follicular" }: AskViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: `Hi! I'm your InSync nutrition guide 🌿 Ask me anything about food and your ${condition}`,
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: text }])
    setLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, condition, phase }),
      })
      if (!res.ok) throw new Error("API error")
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let aiText = ""
      setMessages((prev) => [...prev, { role: "ai", content: "" }])
      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        aiText += decoder.decode(value)
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: "ai", content: aiText }
          return updated
        })
      }
    } catch {
      setMessages((prev) => [...prev, { role: "ai", content: "Sorry, trouble connecting. Try again!" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h2 className="font-heading text-2xl font-bold text-foreground">Ask InSync</h2>
        <p className="text-sm text-muted-foreground">ask anything about food & hormones</p>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-card border border-input text-foreground rounded-bl-sm shadow-sm"
            }`}>
              {msg.content || <span className="text-muted-foreground italic">thinking...</span>}
            </div>
          </div>
        ))}
        {loading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="bg-card border border-input rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-muted-foreground italic shadow-sm">
              thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 pt-2 border-t border-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="can i eat this?"
          className="flex-1 rounded-full border border-input bg-card px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
