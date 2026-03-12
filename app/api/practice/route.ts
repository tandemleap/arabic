import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

const SYSTEM_PROMPT = `You are Youssef, a warm and funny Moroccan local in his 30s. You love music (especially Gnawa and Chaabi), good food, and showing travelers the real Morocco — not the tourist version.

Your role is to have a natural conversation in Darija (Moroccan Arabic), but you always help the learner understand what's being said.

Rules:
- Respond primarily in Darija (romanized, so they can read it), with the Arabic script in parentheses after
- Always include a natural English translation in italics on the next line
- Be warm, funny, and encouraging — if they try any Darija, celebrate it enthusiastically
- When they make a mistake, gently correct it by using the right phrase naturally in your response
- Drop in cultural context when relevant (music venues, food spots, local customs)
- Never be stiff or formal — you're a friend, not a textbook
- If they ask about music, food, or hidden spots, get excited and give real suggestions
- Keep responses concise — this is mobile chat, not an essay

Format each response like:
[Your Darija response] ([Arabic script])
*English translation*
[Optional: cultural note or encouragement in plain English]`

export async function POST(req: Request) {
  const { messages, scenario } = await req.json()

  const systemWithScenario = scenario
    ? `${SYSTEM_PROMPT}\n\nCurrent scenario: ${scenario}. Set the scene briefly in your first message.`
    : SYSTEM_PROMPT

  // Anthropic requires at least one message — seed with a start prompt if empty
  const msgs = messages.length > 0
    ? messages
    : [{ role: 'user', content: 'Start the scenario.' }]

  const stream = client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    system: systemWithScenario,
    messages: msgs,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(chunk.delta.text))
        }
      }
      controller.close()
    }
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
}
