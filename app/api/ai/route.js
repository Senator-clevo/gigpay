import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { title, amount } = await request.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `Write a short professional job brief for a Nigerian freelancer.
Job title: ${title}.
Amount: ₦${Number(amount).toLocaleString()}.
Write exactly 2-3 sentences. Mention what will be delivered and the expected quality.
Be direct and professional. Do not add greetings or sign-offs.`
        }]
      })
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('Anthropic error:', err)
      return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
    }

    const data = await response.json()
    const description = data.content[0].text

    return NextResponse.json({ description })

  } catch (error) {
    console.error('AI route error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}