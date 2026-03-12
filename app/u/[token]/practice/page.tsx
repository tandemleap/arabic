'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getUser } from '@/lib/progress'
import { speakArabic, startListening } from '@/lib/speech'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SCENARIOS = [
  { id: 'cafe', label: '☕ Small café', description: 'You walk into a neighborhood café. No English menu.' },
  { id: 'souk', label: '🛍️ The souk', description: 'A craftsman shows you his leather goods. Time to negotiate.' },
  { id: 'music', label: '🎵 Live music night', description: 'You hear Gnawa music from a doorway. You ask what\'s happening.' },
  { id: 'taxi', label: '🚕 Grand taxi', description: 'You need to get to the medina. The driver speaks no English.' },
  { id: 'riad', label: '🏨 Checking in', description: 'Arriving at your riad after a long travel day.' },
  { id: 'hidden', label: '🗺️ Off the map', description: 'Asking a local where people actually go around here.' },
]

// Extract the first Arabic script block from Youssef's message to speak aloud
function extractArabic(text: string): string | null {
  const match = text.match(/[\u0600-\u06FF\s،؟!]+/)
  return match ? match[0].trim() : null
}

export default function PracticePage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()
  const [scenario, setScenario] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [micLang, setMicLang] = useState<'ar' | 'en-US'>('en-US')
  const [micError, setMicError] = useState('')
  const stopListeningRef = useRef<(() => void) | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const user = getUser(token)
    if (!user) { router.push('/'); return }
  }, [token, router])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Auto-speak Youssef's latest response
  useEffect(() => {
    const last = messages[messages.length - 1]
    if (last?.role === 'assistant' && last.content && !loading) {
      const arabic = extractArabic(last.content)
      if (arabic) speakArabic(arabic, '0.75')
    }
  }, [messages, loading])

  async function startScenario(scenarioId: string) {
    setScenario(scenarioId)
    setMessages([])
    setLoading(true)
    await sendToAPI([], scenarioId)
    setLoading(false)
  }

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    await sendToAPI(newMessages, scenario)
    setLoading(false)
  }

  async function sendToAPI(msgs: Message[], sc: string | null) {
    const res = await fetch('/api/practice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: msgs, scenario: sc }),
    })
    if (!res.body) return
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let text = ''
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      text += decoder.decode(value, { stream: true })
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: text }
        return updated
      })
    }
  }

  const handleMic = useCallback(() => {
    setMicError('')
    if (listening) {
      stopListeningRef.current?.()
      setListening(false)
      return
    }
    setListening(true)
    const stop = startListening(
      (transcript) => {
        setInput(transcript)
        setListening(false)
      },
      (err) => {
        setListening(false)
        if (err === 'not-allowed') setMicError('Mic permission denied — check browser settings')
        else if (err === 'not-supported') setMicError('Mic not supported in this browser — try Safari')
        else setMicError(`Mic error: ${err}`)
      },
      micLang
    )
    if (!stop) {
      setListening(false)
      setMicError('Speech recognition not supported — try Safari or Chrome')
    }
    stopListeningRef.current = stop
  }, [listening, micLang])

  // Scenario picker
  if (!scenario) {
    return (
      <main className="min-h-screen bg-stone-950 text-stone-100 pb-10">
        <div className="bg-stone-900 border-b border-stone-800 px-4 py-3">
          <div className="max-w-sm mx-auto flex items-center gap-3">
            <button onClick={() => router.push(`/u/${token}`)} className="text-stone-400 hover:text-stone-200">←</button>
            <div>
              <div className="font-semibold text-stone-100">💬 AI Practice</div>
              <div className="text-xs text-stone-500">Pick a scenario, then just talk</div>
            </div>
          </div>
        </div>
        <div className="max-w-sm mx-auto px-4 pt-6 space-y-3">
          <p className="text-stone-400 text-sm">
            You&apos;ll chat with Youssef — a warm Moroccan local. He responds in Darija with translations, speaks his lines aloud, and listens when you tap the mic. He won&apos;t judge, and he loves a good laugh.
          </p>
          <div className="space-y-2 pt-2">
            {SCENARIOS.map(s => (
              <button
                key={s.id}
                onClick={() => startScenario(s.id)}
                className="w-full bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl p-4 text-left transition-colors"
              >
                <div className="font-semibold text-stone-100">{s.label}</div>
                <div className="text-xs text-stone-500 mt-0.5">{s.description}</div>
              </button>
            ))}
          </div>
        </div>
      </main>
    )
  }

  const currentScenario = SCENARIOS.find(s => s.id === scenario)

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Header */}
      <div className="bg-stone-900 border-b border-stone-800 px-4 py-3 shrink-0">
        <div className="max-w-sm mx-auto flex items-center gap-3">
          <button onClick={() => setScenario(null)} className="text-stone-400 hover:text-stone-200">←</button>
          <div className="flex-1">
            <div className="font-semibold text-stone-100">{currentScenario?.label}</div>
            <div className="text-xs text-stone-500">Chatting with Youssef 🔊</div>
          </div>
          <button
            onClick={() => { setScenario(null); setMessages([]) }}
            className="text-xs text-stone-500 hover:text-stone-300 border border-stone-700 rounded-lg px-2 py-1"
          >
            New
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-sm mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-amber-500 text-stone-950 rounded-br-sm'
                  : 'bg-stone-800 text-stone-100 rounded-bl-sm'
              }`}>
                {msg.content || (loading && i === messages.length - 1 ? '...' : '')}
              </div>
            </div>
          ))}
          {loading && messages.length === 0 && (
            <div className="flex justify-start">
              <div className="bg-stone-800 rounded-2xl rounded-bl-sm px-4 py-3 text-stone-400 text-sm">
                Youssef is typing...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 bg-stone-900 border-t border-stone-800 px-4 py-3">
        <div className="max-w-sm mx-auto space-y-2">

          {/* Mic language toggle + error */}
          <div className="flex items-center justify-between">
            {micError ? (
              <span className="text-xs text-red-400">{micError}</span>
            ) : (
              <span className="text-xs text-stone-600">
                {listening ? '🔴 Listening — tap mic to stop' : ''}
              </span>
            )}
            <button
              onClick={() => setMicLang(l => l === 'ar' ? 'en-US' : 'ar')}
              className="text-xs border border-stone-700 rounded-full px-2 py-0.5 text-stone-400 hover:text-stone-200 transition-colors ml-auto"
            >
              {micLang === 'ar' ? '🇲🇦 Arabic mic' : '🇺🇸 English mic'}
            </button>
          </div>

          <div className="flex gap-2">
            {/* Mic button — always visible */}
            <button
              onClick={handleMic}
              className={`rounded-xl px-3 py-2.5 font-bold transition-all text-lg ${
                listening
                  ? 'bg-red-600 hover:bg-red-500 text-white scale-110'
                  : 'bg-stone-700 hover:bg-stone-600 text-stone-200'
              }`}
              title={listening ? 'Tap to stop' : 'Tap to speak'}
            >
              🎤
            </button>

            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder={listening ? 'Listening...' : 'Type or tap 🎤 to speak...'}
              className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 text-sm"
            />

            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="bg-amber-500 hover:bg-amber-400 disabled:bg-stone-700 disabled:text-stone-500 text-stone-950 font-bold rounded-xl px-4 py-2.5 transition-colors"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
