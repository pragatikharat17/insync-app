import { NextRequest, NextResponse } from "next/server"

const FAQ: Record<string, string> = {
  "rice": "White rice has high GI — not ideal for PCOS. Eat small portion with dal and sabzi.",
  "chai": "Masala chai without sugar is fine — cinnamon improves insulin sensitivity.",
  "jalebi": "Worst PCOS food — maida plus sugar. One piece max after a full meal.",
  "poha": "Decent PCOS breakfast — add peanuts, veggies and lemon.",
  "chocolate": "Dark chocolate 70%+ is good for PCOS — magnesium helps with PMS.",
}

function getFallbackAnswer(message: string): string | null {
  const lower = message.toLowerCase()
  for (const [keyword, answer] of Object.entries(FAQ)) {
    if (lower.includes(keyword)) return answer
  }
  return null
}

export async function POST(req: NextRequest) {
  const { message, condition, phase } = await req.json()
  if (!message) return NextResponse.json({ error: "No message" }, { status: 400 })

  const systemPrompt = `You are a warm hormone health nutritionist for Indian women. User has ${condition || "PCOS"}, in ${phase || "follicular"} phase. Be direct, max 3-4 sentences. Reply in Hinglish if user writes in Hinglish.`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [{
            parts: [{ text: message }]
          }],
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7
          }
        })
      }
    )

    if (!response.ok) {
      const err = await response.json()
      throw new Error(JSON.stringify(err))
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    if (!text) throw new Error("Empty response")

    const encoder = new TextEncoder()
    return new NextResponse(new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(text))
        controller.close()
      }
    }), { headers: { "Content-Type": "text/plain; charset=utf-8" } })

  } catch (error) {
    console.error("Gemini error:", error)
    const faqAnswer = getFallbackAnswer(message)
    if (faqAnswer) {
      const encoder = new TextEncoder()
      return new NextResponse(new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(faqAnswer))
          controller.close()
        }
      }), { headers: { "Content-Type": "text/plain; charset=utf-8" } })
    }
    return NextResponse.json({ error: "AI unavailable" }, { status: 503 })
  }
}