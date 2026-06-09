import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  const { message, condition, phase } = await req.json()
  if (!message) return NextResponse.json({ error: "No message" }, { status: 400 })

  const systemPrompt = `You are a warm hormone health nutritionist specialising in Indian women's health — like a knowledgeable desi older sister.

User has: ${condition || "PCOS"}, currently in ${phase || "follicular"} phase.

Rules:
- Be warm, direct, honest — not clinical
- Specific actionable advice for Indian lifestyle
- If they write in Hindi/Hinglish, reply in Hinglish
- If English, reply in English  
- Max 3-4 sentences
- End with one food tip when relevant
- Never be scary or alarmist`

  try {
    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 300,
      stream: true,
    })

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
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "AI unavailable" }, { status: 500 })
  }
}
