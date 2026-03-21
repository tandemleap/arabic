'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { categories, Phrase } from '@/data/phrases'
import { getProgress, setPhrasStatus, getStarred, toggleStar } from '@/lib/progress'
import { PhraseStatus } from '@/data/phrases'
import { speakById, startRecording } from '@/lib/speech'

type CardFace = 'english' | 'arabic'
type StudyMode = 'learn' | 'flashcard'

export default function CategoryPage() {
  const { token, slug } = useParams<{ token: string; slug: string }>()
  const router = useRouter()
  const category = categories.find(c => c.slug === slug)

  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [startFace] = useState<CardFace>('english')
  const [progress, setProgress] = useState<Record<string, PhraseStatus>>({})
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [done, setDone] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [mode, setMode] = useState<StudyMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('morocco_study_mode') as StudyMode) || 'learn'
    }
    return 'learn'
  })
  type MicState = 'idle' | 'recording' | 'scoring'
  const [micState, setMicState] = useState<MicState>('idle')
  const [assessment, setAssessment] = useState<{ score: number; accuracy: number; fluency: number; recognized?: string; error?: string } | null>(null)
  const stopRecordingRef = useRef<(() => void) | null>(null)
  const [starred, setStarred] = useState<Set<string>>(new Set())

  useEffect(() => {
    setStarred(getStarred(token))
  }, [token])

  useEffect(() => {
    if (!category) { router.push('/'); return }
    const p = getProgress(token)
    setProgress(p)
    const sorted = [...category.phrases].sort((a, b) => {
      const order = { 'new': 0, 'learning': 1, 'got-it': 2 }
      return (order[p[a.id] || 'new']) - (order[p[b.id] || 'new'])
    })
    setPhrases(sorted)
  }, [category, token, router])

  const currentPhrase = phrases[index]

  // Auto-speak when card flips to Arabic (flashcard mode)
  useEffect(() => {
    if (mode === 'flashcard' && flipped && currentPhrase?.arabic) {
      setAssessment(null)
      handleSpeak(currentPhrase.id, currentPhrase.arabic)
    }
  }, [flipped, currentPhrase?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-speak when advancing to next card in learn mode
  useEffect(() => {
    if (mode === 'learn' && currentPhrase?.arabic) {
      setAssessment(null)
      handleSpeak(currentPhrase.id, currentPhrase.arabic)
    }
  }, [currentPhrase?.id, mode]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSpeak(id: string, arabic: string) {
    setSpeaking(true)
    speakById(id, arabic)
    setTimeout(() => setSpeaking(false), 2000)
  }

  function handleMic() {
    if (micState === 'recording') {
      stopRecordingRef.current?.()
      return
    }
    setAssessment(null)
    setMicState('recording')
    startRecording(async (blob, mimeType) => {
      if (!blob || blob.size === 0) { setMicState('idle'); return }
      setMicState('scoring')
      try {
        const form = new FormData()
        form.append('audio', blob)
        form.append('text', currentPhrase.arabic)
        form.append('mimeType', mimeType)
        const res = await fetch('/api/pronounce', { method: 'POST', body: form })
        const data = await res.json()
        if (res.ok) {
          setAssessment(data)
        } else {
          setAssessment({ score: 0, accuracy: 0, fluency: 0, error: data.detail || data.error || 'Scoring failed' })
        }
      } catch (e) {
        setAssessment({ score: 0, accuracy: 0, fluency: 0, error: String(e) })
      }
      setMicState('idle')
    }).then(stop => {
      if (!stop) { setMicState('idle'); return }
      stopRecordingRef.current = stop
    })
  }

  function handleStar() {
    if (!currentPhrase) return
    toggleStar(token, currentPhrase.id)
    setStarred(getStarred(token))
  }

  function toggleMode() {
    const next: StudyMode = mode === 'learn' ? 'flashcard' : 'learn'
    setMode(next)
    localStorage.setItem('morocco_study_mode', next)
    setFlipped(false)
    setAssessment(null)
    setShowMnemonic(false)
  }

  const handleStatus = useCallback((status: PhraseStatus) => {
    if (!currentPhrase) return
    setPhrasStatus(token, currentPhrase.id, status)
    setProgress(prev => ({ ...prev, [currentPhrase.id]: status }))
    setFlipped(false)
    setShowMnemonic(false)
    setAssessment(null)
    if (index + 1 >= phrases.length) {
      setDone(true)
    } else {
      setIndex(i => i + 1)
    }
  }, [currentPhrase, token, index, phrases.length])

  if (!category) return null

  const gotItCount = phrases.filter(p => progress[p.id] === 'got-it').length
  const pct = phrases.length > 0 ? Math.round((gotItCount / phrases.length) * 100) : 0

  if (done || phrases.length === 0) {
    return (
      <main className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="text-6xl">{pct === 100 ? '🎉' : '✅'}</div>
          <h2 className="text-2xl font-bold text-amber-400">
            {pct === 100 ? 'Mzyan bzzaf!' : 'Good round!'}
          </h2>
          <p className="text-stone-400">
            {pct === 100
              ? `You've got all ${phrases.length} phrases in ${category.title}.`
              : `${gotItCount} of ${phrases.length} phrases locked in.`}
          </p>
          <div className="flex gap-3 justify-center pt-4">
            <button
              onClick={() => { setIndex(0); setDone(false); setFlipped(false) }}
              className="bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl px-5 py-3 text-sm font-semibold transition-colors"
            >
              Go Again
            </button>
            <button
              onClick={() => router.push(`/u/${token}`)}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl px-5 py-3 text-sm font-semibold transition-colors"
            >
              Dashboard →
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Header */}
      <div className="bg-stone-900 border-b border-stone-800 px-4 py-3">
        <div className="max-w-sm mx-auto flex items-center gap-3">
          <button onClick={() => router.push(`/u/${token}`)} className="text-stone-400 hover:text-stone-200">
            ←
          </button>
          <div className="flex-1">
            <div className="text-sm font-semibold text-stone-100">{category.icon} {category.title}</div>
            <div className="text-xs text-stone-500">{index + 1} / {phrases.length} · {gotItCount} got it</div>
          </div>
          {/* Mode toggle */}
          <button
            onClick={toggleMode}
            className="flex items-center gap-1 bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors hover:border-stone-500"
          >
            <span className={mode === 'learn' ? 'text-amber-400' : 'text-stone-500'}>Learn</span>
            <span className="text-stone-600">|</span>
            <span className={mode === 'flashcard' ? 'text-amber-400' : 'text-stone-500'}>Flash</span>
          </button>
          <div className="text-amber-400 font-bold text-sm">{pct}%</div>
        </div>
        <div className="max-w-sm mx-auto mt-2 bg-stone-800 rounded-full h-1.5">
          <div className="bg-amber-400 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Card area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-sm space-y-4">

          {/* Star button */}
          <div className="flex justify-end">
            <button
              onClick={handleStar}
              className={`text-2xl transition-transform active:scale-90 ${starred.has(currentPhrase?.id) ? 'text-amber-400' : 'text-stone-400 hover:text-stone-200'}`}
              title={starred.has(currentPhrase?.id) ? 'Remove from Keepers' : 'Add to Keepers'}
            >
              {starred.has(currentPhrase?.id) ? '★' : '☆'}
            </button>
          </div>

          {/* Status badge */}
          {progress[currentPhrase?.id] && (
            <div className="text-center">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                progress[currentPhrase.id] === 'got-it' ? 'bg-green-900/50 text-green-400' : 'bg-amber-900/50 text-amber-400'
              }`}>
                {progress[currentPhrase.id] === 'got-it' ? '✓ Got it' : '↺ Still learning'}
              </span>
            </div>
          )}

          {/* Bonus badge */}
          {currentPhrase?.bonus && (
            <div className="text-center">
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-400">✨ Surprise Phrase</span>
            </div>
          )}

          {mode === 'learn' ? (
            /* ── LEARN MODE: everything visible, no flip ── */
            <>
              <div className="w-full bg-stone-800 border border-stone-700 rounded-2xl p-8 text-center space-y-3 min-h-[220px] flex flex-col items-center justify-center">
                <div className="text-stone-400 text-sm font-medium">{currentPhrase?.english}</div>
                <div className="text-3xl font-bold text-amber-400 leading-relaxed" dir="rtl">
                  {currentPhrase?.arabic}
                </div>
                <div className="text-xl text-stone-200 font-semibold">{currentPhrase?.romanized}</div>
              </div>

              {/* Hear it / Say it */}
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => handleSpeak(currentPhrase.id, currentPhrase.arabic)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    speaking
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                      : 'bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700'
                  }`}
                >
                  <span>{speaking ? '🔊' : '🔈'}</span>
                  <span>{speaking ? 'Playing...' : 'Hear it'}</span>
                </button>

                <button
                  onClick={handleMic}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    micState === 'recording'
                      ? 'bg-red-600/20 text-red-400 border-red-500/50 scale-105'
                      : micState === 'scoring'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                      : 'bg-stone-800 text-stone-400 hover:text-stone-200 border-stone-700'
                  }`}
                >
                  <span>🎤</span>
                  <span>{micState === 'recording' ? 'Stop' : micState === 'scoring' ? 'Scoring...' : 'Say it'}</span>
                </button>
              </div>

              {/* Pronunciation feedback */}
              {assessment !== null && (
                <div className="bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-center space-y-2">
                  {assessment.error ? (
                    <div className="text-sm text-red-400">{assessment.error}</div>
                  ) : (
                    <>
                      <div className={`text-3xl font-bold ${
                        assessment.score >= 85 ? 'text-green-400' :
                        assessment.score >= 60 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {assessment.score}/100
                      </div>
                      <div className={`text-sm font-semibold ${
                        assessment.score >= 85 ? 'text-green-400' :
                        assessment.score >= 60 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {assessment.score >= 85 ? 'Great pronunciation!' :
                         assessment.score >= 60 ? 'Pretty close!' : 'Keep practicing!'}
                      </div>
                      <div className="flex justify-center gap-4 text-xs text-stone-500">
                        <span>Accuracy: <span className="text-stone-300">{assessment.accuracy}</span></span>
                        <span>Fluency: <span className="text-stone-300">{assessment.fluency}</span></span>
                      </div>
                      {assessment.recognized && (
                        <div className="text-xs text-stone-500">
                          Heard: <span className="text-stone-400" dir="rtl">{assessment.recognized}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Mnemonic */}
              {currentPhrase?.mnemonic && (
                <button
                  onClick={() => setShowMnemonic(m => !m)}
                  className="w-full text-sm text-stone-500 hover:text-stone-300 text-left px-1 transition-colors"
                >
                  {showMnemonic ? (
                    <span className="text-amber-400/80">💡 {currentPhrase.mnemonic}</span>
                  ) : (
                    <span>💡 Memory tip (tap)</span>
                  )}
                </button>
              )}

              {/* Still Learning / Got It */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleStatus('learning')}
                  className="bg-stone-700 hover:bg-stone-600 border border-stone-600 rounded-xl py-4 font-semibold text-stone-200 transition-colors"
                >
                  Still Learning
                </button>
                <button
                  onClick={() => handleStatus('got-it')}
                  className="bg-green-700 hover:bg-green-600 border border-green-600 rounded-xl py-4 font-semibold text-green-100 transition-colors"
                >
                  Got It ✓
                </button>
              </div>
            </>
          ) : (
            /* ── FLASHCARD MODE: original flip behavior ── */
            <>
              <button
                onClick={() => setFlipped(f => !f)}
                className="w-full bg-stone-800 border border-stone-700 rounded-2xl p-8 text-center space-y-3 hover:bg-stone-750 transition-colors min-h-[220px] flex flex-col items-center justify-center"
              >
                {!flipped ? (
                  <>
                    <div className="text-2xl font-bold text-stone-100">{currentPhrase?.english}</div>
                    <div className="text-stone-500 text-sm mt-4">Tap to reveal Darija</div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-amber-400 leading-relaxed" dir="rtl">
                      {currentPhrase?.arabic}
                    </div>
                    <div className="text-lg text-stone-300 font-medium">{currentPhrase?.romanized}</div>
                    <div className="text-stone-500 text-sm">{currentPhrase?.english}</div>
                  </>
                )}
              </button>

              {/* Audio + Mic row — shown after flip */}
              {flipped && (
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSpeak(currentPhrase.id, currentPhrase.arabic) }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      speaking
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                        : 'bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700'
                    }`}
                  >
                    <span>{speaking ? '🔊' : '🔈'}</span>
                    <span>{speaking ? 'Playing...' : 'Hear it'}</span>
                  </button>

                  <button
                    onClick={handleMic}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                      micState === 'recording'
                        ? 'bg-red-600/20 text-red-400 border-red-500/50 scale-105'
                        : micState === 'scoring'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                        : 'bg-stone-800 text-stone-400 hover:text-stone-200 border-stone-700'
                    }`}
                  >
                    <span>🎤</span>
                    <span>{micState === 'recording' ? 'Stop' : micState === 'scoring' ? 'Scoring...' : 'Say it'}</span>
                  </button>
                </div>
              )}

              {/* Pronunciation feedback */}
              {assessment !== null && (
                <div className="bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-center space-y-2">
                  {assessment.error ? (
                    <div className="text-sm text-red-400">{assessment.error}</div>
                  ) : (
                    <>
                      <div className={`text-3xl font-bold ${
                        assessment.score >= 85 ? 'text-green-400' :
                        assessment.score >= 60 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {assessment.score}/100
                      </div>
                      <div className={`text-sm font-semibold ${
                        assessment.score >= 85 ? 'text-green-400' :
                        assessment.score >= 60 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {assessment.score >= 85 ? 'Great pronunciation!' :
                         assessment.score >= 60 ? 'Pretty close!' : 'Keep practicing!'}
                      </div>
                      <div className="flex justify-center gap-4 text-xs text-stone-500">
                        <span>Accuracy: <span className="text-stone-300">{assessment.accuracy}</span></span>
                        <span>Fluency: <span className="text-stone-300">{assessment.fluency}</span></span>
                      </div>
                      {assessment.recognized && (
                        <div className="text-xs text-stone-500">
                          Heard: <span className="text-stone-400" dir="rtl">{assessment.recognized}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Mnemonic */}
              {currentPhrase?.mnemonic && (
                <button
                  onClick={() => setShowMnemonic(m => !m)}
                  className="w-full text-sm text-stone-500 hover:text-stone-300 text-left px-1 transition-colors"
                >
                  {showMnemonic ? (
                    <span className="text-amber-400/80">💡 {currentPhrase.mnemonic}</span>
                  ) : (
                    <span>💡 Memory tip (tap)</span>
                  )}
                </button>
              )}

              {/* Action buttons */}
              {flipped && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleStatus('learning')}
                    className="bg-stone-700 hover:bg-stone-600 border border-stone-600 rounded-xl py-4 font-semibold text-stone-200 transition-colors"
                  >
                    Still Learning
                  </button>
                  <button
                    onClick={() => handleStatus('got-it')}
                    className="bg-green-700 hover:bg-green-600 border border-green-600 rounded-xl py-4 font-semibold text-green-100 transition-colors"
                  >
                    Got It ✓
                  </button>
                </div>
              )}

              {!flipped && (
                <div className="grid grid-cols-1 gap-3 pt-2">
                  <button
                    onClick={() => setFlipped(true)}
                    className="bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl py-4 font-bold transition-colors"
                  >
                    Show Darija
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </main>
  )
}
