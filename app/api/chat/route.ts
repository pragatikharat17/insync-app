import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// common questions answered locally — no API call needed
const FAQ: Record<string, string> = {
  "rice": "White rice has a high GI (72) and spikes insulin quickly — not ideal for PCOS. Try brown rice instead. If you love rice, eat a small portion with dal and sabzi — protein and fibre slow the glucose spike.",
  "chai": "Masala chai without sugar is fine for PCOS — cinnamon and ginger improve insulin sensitivity. Switch to jaggery, reduce milk, and never drink on an empty stomach.",
  "jalebi": "Jalebi is one of the worst foods for PCOS — maida plus sugar syrup equals double insulin spike. If it's a festival, one piece maximum after a full meal, then walk after.",
  "poha": "Poha is a decent PCOS breakfast — GI around 52. Add peanuts for protein, lots of veggies, and a squeeze of lemon. Avoid plain poha with just onion.",
  "chocolate": "Dark chocolate 70%+ is actually good for PCOS — magnesium helps with PMS cramps and mood. Milk chocolate is mostly sugar. Stick to 1-2 squares of dark chocolate.",
  "biryani": "Biryani is tricky for PCOS — white rice base spikes insulin. Eat a small portion, pair with raita, and walk after. Avoid on an empty stomach.",
  "roti": "Whole wheat roti is much better than maida roti for PCOS. GI around 62 — pair with dal and sabzi for a balanced meal. 2 rotis maximum per meal.",
  "idli": "Idli is one of the best PCOS breakfasts — fermented so GI is low around 38. Eat with sambar for protein. Max 2-3 pieces.",
  "sugar": "Sugar directly worsens insulin resistance which is the root problem in PCOS. Switch to jaggery for a slightly lower GI, or use dates for natural sweetness. Even better — train yourself to prefer less sweet over time.",
  "coffee": "Black coffee is fine for PCOS in moderation. Avoid adding sugar or flavoured syrups. Caffeine can spike cortisol so limit to 1 cup per day, never on empty stomach.",
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
      // rate limited — try smaller faster model
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
      // wait before retry: 1s, 2s
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
}

export async function POST(req: NextRequest) {
  const { message, condition, phase } = await req.json()
  if (!message) return NextResponse.json({ error: "No message" }, { status: 400 })

  const systemPrompt = `You are a warm hormone health nutritionist specialising in Indian women's health — like a knowledgeable desi older sister.

User has: ${condition || "PCOS"}, currently in ${phase || "follicular"} phase.

Rules:
- Be warm, direct, honest — not clinical
- Specific actionable advice for Indian lifestyle
- If they write in Hindi or Hinglish, reply in Hinglish
- If English, reply in English
- Max 3-4 sentences
- End with one food tip when relevant
- Never be scary or alarmist`

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

    // check FAQ for common questions
    const faqAnswer = getFallbackAnswer(message)
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
