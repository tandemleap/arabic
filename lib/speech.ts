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

// Record audio as WAV (PCM 16-bit 16kHz mono) — required for Azure Pronunciation Assessment scoring.
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

  const audioContext = new AudioContext({ sampleRate: 16000 })
  const source = audioContext.createMediaStreamSource(stream)
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const processor = audioContext.createScriptProcessor(4096, 1, 1)
  const pcmChunks: Float32Array[] = []

  processor.onaudioprocess = (e) => {
    const input = e.inputBuffer.getChannelData(0)
    pcmChunks.push(new Float32Array(input))
  }

  source.connect(processor)
  processor.connect(audioContext.destination)

  return () => {
    processor.disconnect()
    source.disconnect()
    stream.getTracks().forEach(t => t.stop())
    audioContext.close()

    const totalLen = pcmChunks.reduce((s, c) => s + c.length, 0)
    const pcm = new Float32Array(totalLen)
    let offset = 0
    for (const chunk of pcmChunks) { pcm.set(chunk, offset); offset += chunk.length }

    const pcm16 = new Int16Array(pcm.length)
    for (let i = 0; i < pcm.length; i++) {
      pcm16[i] = Math.max(-32768, Math.min(32767, Math.round(pcm[i] * 32767)))
    }

    onBlob(new Blob([encodeWav(pcm16, 16000)], { type: 'audio/wav' }), 'audio/wav')
  }
}

function encodeWav(samples: Int16Array, sampleRate: number): ArrayBuffer {
  const buf = new ArrayBuffer(44 + samples.length * 2)
  const v = new DataView(buf)
  const str = (off: number, s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(off + i, s.charCodeAt(i)) }
  str(0, 'RIFF'); v.setUint32(4, 36 + samples.length * 2, true)
  str(8, 'WAVE'); str(12, 'fmt ')
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true)
  v.setUint32(24, sampleRate, true); v.setUint32(28, sampleRate * 2, true)
  v.setUint16(32, 2, true); v.setUint16(34, 16, true)
  str(36, 'data'); v.setUint32(40, samples.length * 2, true)
  for (let i = 0; i < samples.length; i++) v.setInt16(44 + i * 2, samples[i], true)
  return buf
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
