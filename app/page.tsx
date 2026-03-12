'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createUser, getAllUsers } from '@/lib/progress'

export default function Home() {
  const [name, setName] = useState('')
  const [existingUsers, setExistingUsers] = useState<{ token: string; name: string }[]>([])
  const router = useRouter()

  useEffect(() => {
    setExistingUsers(getAllUsers())
  }, [])

  function handleStart() {
    if (!name.trim()) return
    const user = createUser(name.trim())
    router.push(`/u/${user.token}`)
  }

  function handleResume(token: string) {
    router.push(`/u/${token}`)
  }

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">

        <div className="text-center space-y-2">
          <div className="text-5xl">🇲🇦</div>
          <h1 className="text-3xl font-bold text-amber-400">Morocco Ready</h1>
          <p className="text-stone-400 text-sm">Darija that opens doors — not just menus</p>
        </div>

        {existingUsers.length > 0 && (
          <div className="space-y-2">
            <p className="text-stone-500 text-xs uppercase tracking-widest">Continue as</p>
            {existingUsers.map(user => (
              <button
                key={user.token}
                onClick={() => handleResume(user.token)}
                className="w-full bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl p-4 text-left flex items-center gap-3 transition-colors"
              >
                <span className="text-2xl">👤</span>
                <div>
                  <div className="font-semibold text-stone-100">{user.name}</div>
                  <div className="text-xs text-stone-500">Tap to continue</div>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <p className="text-stone-500 text-xs uppercase tracking-widest">
            {existingUsers.length > 0 ? 'Or start new' : "Who's learning?"}
          </p>
          <input
            type="text"
            placeholder="Your name (e.g. Scott)"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStart()}
            className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
          <button
            onClick={handleStart}
            disabled={!name.trim()}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-stone-700 disabled:text-stone-500 text-stone-950 font-bold rounded-xl py-3 transition-colors"
          >
            Start Learning →
          </button>
        </div>

        <p className="text-center text-stone-600 text-xs">
          Progress saves to this browser.<br />Bookmark your URL after you start.
        </p>

      </div>
    </main>
  )
}
