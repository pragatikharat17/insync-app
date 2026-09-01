import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// common questions answered from database — no AI needed
const FAQ: Record<string, string> = {
  "rice": "White rice has a high GI (72) and spikes insulin quickly — not ideal for PCOS. Try brown rice or cauliflower rice instead. If you love rice, eat a small portion with dal and sabzi — the protein and fibre slow the glucose spike.",
  "chai": "Masala chai without sugar is actually fine for PCOS — cinnamon and ginger improve insulin sensitivity. The problem is sugar and milk in large amounts. Switch to jaggery, reduce milk, and never drink on an empty stomach.",
  "jalebi": "Jalebi is one of the worst foods for PCOS — maida + sugar syrup = double insulin spike. If it's a festival, have one piece maximum after a full meal and walk after.",
  "poha": "Poha is a decent PCOS breakfast — GI around 52, medium range. Add peanuts for protein, lots of veggies, and a squeeze of lemon. Avoid plain poha with just onion.",
  "chocolate": "Dark chocolate 70%+ is actually good for PCOS — magnesium helps with PMS cramps and mood. Milk chocolate is not the same — it's mostly sugar. Stick to 1-2 squares of dark chocolate.",
}

function getFallbackAnswer(message: string): string | null {
  const lower = message.toLowerCase()
  for (const [keyword, answer] of Object.entries(FAQ)) {
    if (lower.includes(keyword)) return answer
  }
  return null
}

async function callGroqWithRetry(messages: any[], retries = 2): Promise<any> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.7,
        max_tokens: 300,
        stream: true,
      })
    } catch (error: any) {
      // if rate limited, try smaller model
      if (error?.status === 429 && i < retries) {
        console.log(`Rate limited, trying fallback model (attempt ${i + 1})`)
        try {
          return await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages,
            temperature: 0.7,
            max_tokens: 300,
            stream: true,
          })
        } catch {}
      }
      if (i === retries) throw error
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
}

export async function POST(req: NextRequest) {
  const { message, condition, phase } = await req.json()
  if (!message) return NextResponse.json({ error: "No message" }, { status: 400 })

  // check FAQ first — no API call needed
  const faqAnswer = getFallbackAnswer(message)

  const systemPrompt = `You are a warm hormone health nutritionist specialising in Indian women's health.
User has: ${condition || "PCOS"}, currently in ${phase || "follicular"} phase.
Be warm, direct, specific. Reply in Hinglish if user writes in Hinglish. Max 3-4 sentences.`

  try {
    const stream = await callGroqWithRetry([
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ])

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || ""
          if (text) controller.enqueue(encoder.encode(text))
        }
        controller.close()
      }
    })

    return new NextResponse(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    })

  } catch (error: any) {
    console.error("Groq error:", error)

    // if we have a FAQ answer, return it as plain text stream
    if (faqAnswer) {
      const encoder = new TextEncoder()
      const readable = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(faqAnswer))
          controller.close()
        }
      })
      return new NextResponse(readable, {
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      })
    }

    // final fallback
    return NextResponse.json({
      error: "AI is temporarily unavailable. Please try again in a moment!"
    }, { status: 503 })
  }
}
