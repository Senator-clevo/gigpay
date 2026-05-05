import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { title, amount } = await request.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Write a short professional job brief for a Nigerian freelancer.
Job title: ${title}.
Amount: ₦${Number(amount).toLocaleString()}.
Write exactly 2-3 sentences. Mention what will be delivered and the expected quality.
Be direct and professional. Do not add greetings or sign-offs.`
            }]
          }]
        })
      }
    )

    if (!response.ok) {
      const err = await response.json()
      console.error('Gemini error:', err)
      return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
    }

    const data = await response.json()
    const description = data.candidates[0].content.parts[0].text

    return NextResponse.json({ description })

  } catch (error) {
    console.error('AI route error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}