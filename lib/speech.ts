let currentAudio: HTMLAudioElement | null = null

// Speak by phrase ID — plays local MP3 if available, falls back to Azure TTS
export async function speakById(id: string, fallbackText: string, rate = '0.85') {
  if (typeof window === 'undefined') return

  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }

  const audio = new Audio(`/audio/${id}.mp3`)
  currentAudio = audio

  try {
    await audio.play()
    audio.onended = () => { currentAudio = null }
  } catch {
    // Local MP3 not found or failed — fall back to Azure TTS
    currentAudio = null
    speakArabic(fallbackText, rate)
  }
}

// Speak Arabic text via Azure TTS (ar-MA-JamalNeural — Moroccan Arabic)
export async function speakArabic(text: string, rate = '0.85') {
  if (typeof window === 'undefined') return

  // Stop anything currently playing
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }

  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, rate }),
    })

    if (!res.ok) {
      // Fall back to browser TTS if Azure isn't configured yet
      fallbackSpeak(text)
      return
    }

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    currentAudio = audio
    audio.play()
    audio.onended = () => URL.revokeObjectURL(url)
  } catch {
    fallbackSpeak(text)
  }
}

export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

// Record audio — returns a stop function. Call stop() to end recording and get the blob via onBlob.
export async function startRecording(
  onBlob: (blob: Blob | null, mimeType: string) => void
): Promise<(() => void) | null> {
  if (typeof window === 'undefined') return null

  let stream: MediaStream
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch {
    return null
  }

  const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
    ? 'audio/webm;codecs=opus'
    : MediaRecorder.isTypeSupported('audio/webm')
    ? 'audio/webm'
    : 'audio/mp4'

  const recorder = new MediaRecorder(stream, { mimeType })
  const chunks: Blob[] = []

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data)
  }

  recorder.start()

  return () => {
    recorder.onstop = () => {
      stream.getTracks().forEach(t => t.stop())
      const blob = new Blob(chunks, { type: mimeType })
      onBlob(blob, mimeType)
    }
    if (recorder.state !== 'inactive') recorder.stop()
  }
}

// Browser fallback (used if Azure not configured)
function fallbackSpeak(text: string) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ar-MA'
  utterance.rate = 0.8
  window.speechSynthesis.speak(utterance)
}

// Speech recognition
type RecognitionCallback = (transcript: string) => void
type ErrorCallback = (err: string) => void

export function startListening(
  onResult: RecognitionCallback,
  onError: ErrorCallback,
  lang: 'ar' | 'en-US' = 'en-US'
): (() => void) | null {
  if (typeof window === 'undefined') return null

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

  if (!SpeechRecognition) {
    onError('Speech recognition not supported in this browser')
    return null
  }

  const recognition = new SpeechRecognition()
  recognition.lang = lang
  recognition.interimResults = false
  recognition.maxAlternatives = 1
  recognition.continuous = false

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript
    onResult(transcript)
  }

  recognition.onerror = (event: any) => {
    onError(event.error)
  }

  recognition.onend = () => {
    // recognition ended naturally
  }

  recognition.start()
  return () => { try { recognition.stop() } catch { /* ignore */ } }
}

export function isSpeechSupported(): boolean {
  if (typeof window === 'undefined') return false
  return !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition
}
