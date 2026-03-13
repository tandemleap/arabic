export async function POST(req: Request) {
  const key = process.env.AZURE_SPEECH_KEY
  const region = process.env.AZURE_SPEECH_REGION

  if (!key || !region) {
    return Response.json({ error: 'Azure not configured' }, { status: 503 })
  }

  const formData = await req.formData()
  const audio = formData.get('audio') as Blob
  const referenceText = formData.get('text') as string
  const mimeType = (formData.get('mimeType') as string) || 'audio/webm'

  if (!audio || !referenceText) {
    return Response.json({ error: 'Missing audio or text' }, { status: 400 })
  }

  // Exchange key for bearer token
  const tokenRes = await fetch(
    `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
    { method: 'POST', headers: { 'Ocp-Apim-Subscription-Key': key } }
  )
  if (!tokenRes.ok) {
    const t = await tokenRes.text()
    return Response.json({ error: `Token exchange ${tokenRes.status}: ${t || 'failed'}` }, { status: 401 })
  }
  const token = await tokenRes.text()

  const assessmentConfig = {
    ReferenceText: referenceText,
    GradingSystem: 'HundredMark',
    Dimension: 'Comprehensive',
  }
  const assessmentHeader = Buffer.from(JSON.stringify(assessmentConfig)).toString('base64')

  const audioBuffer = await audio.arrayBuffer()

  const response = await fetch(
    `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=ar-MA&format=detailed`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': mimeType,
        'Pronunciation-Assessment': assessmentHeader,
      },
      body: audioBuffer,
    }
  )

  if (!response.ok) {
    const errText = await response.text()
    return Response.json({ error: `Azure ${response.status}: ${errText || 'no detail'}` }, { status: response.status })
  }

  const data = await response.json()
  const assessment = data.NBest?.[0]?.PronunciationAssessment

  return Response.json({
    score: Math.round(assessment?.PronScore ?? 0),
    accuracy: Math.round(assessment?.AccuracyScore ?? 0),
    fluency: Math.round(assessment?.FluencyScore ?? 0),
    recognized: data.DisplayText ?? '',
  })
}
