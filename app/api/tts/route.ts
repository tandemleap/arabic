export async function POST(req: Request) {
  const { text, rate = '0.85' } = await req.json()

  const key = process.env.AZURE_SPEECH_KEY
  const region = process.env.AZURE_SPEECH_REGION

  if (!key || !region) {
    return new Response('Azure Speech not configured', { status: 503 })
  }

  const ssml = `
    <speak version='1.0' xml:lang='ar-MA'>
      <voice xml:lang='ar-MA' name='ar-MA-JamalNeural'>
        <prosody rate='${rate}'>
          ${text}
        </prosody>
      </voice>
    </speak>
  `.trim()

  const response = await fetch(
    `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      },
      body: ssml,
    }
  )

  if (!response.ok) {
    return new Response('TTS failed', { status: response.status })
  }

  const audioBuffer = await response.arrayBuffer()
  return new Response(audioBuffer, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400', // cache audio for 24h
    },
  })
}
