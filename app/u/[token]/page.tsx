'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { categories, tierOrder, tierLabels, Category } from '@/data/phrases'
import { getUser, getCategoryProgress, getStarred } from '@/lib/progress'

export default function Dashboard() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()
  const [name, setName] = useState('')
  const [categoryProgress, setCategoryProgress] = useState<Record<string, { pct: number; gotIt: number; total: number }>>({})
  const [starredCount, setStarredCount] = useState(0)

  useEffect(() => {
    const user = getUser(token)
    if (!user) {
      router.push('/')
      return
    }
    setName(user.name)
    const prog: Record<string, { pct: number; gotIt: number; total: number }> = {}
    for (const cat of categories) {
      prog[cat.slug] = getCategoryProgress(token, cat.phrases.map(p => p.id))
    }
    setCategoryProgress(prog)
    setStarredCount(getStarred(token).size)
  }, [token, router])

  const totalPhrases = categories.reduce((sum, c) => sum + c.phrases.length, 0)
  const totalGotIt = Object.values(categoryProgress).reduce((sum, p) => sum + p.gotIt, 0)
  const overallPct = totalPhrases > 0 ? Math.round((totalGotIt / totalPhrases) * 100) : 0

  const grouped = tierOrder.reduce<Record<string, Category[]>>((acc, tier) => {
    acc[tier] = categories.filter(c => c.tier === tier)
    return acc
  }, {})

  // Find first incomplete category as a nudge
  const nextUp = categories.find(c => (categoryProgress[c.slug]?.pct ?? 0) < 100)

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 pb-24">
      {/* Header */}
      <div className="bg-stone-900 border-b border-stone-800 px-4 py-5">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-amber-400">🇲🇦 Morocco Ready</h1>
              <p className="text-stone-400 text-sm">Marhba, {name}!</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-400">{overallPct}%</div>
              <div className="text-xs text-stone-500">{totalGotIt}/{totalPhrases} phrases</div>
            </div>
          </div>
          {/* Overall progress bar */}
          <div className="mt-3 bg-stone-800 rounded-full h-2">
            <div
              className="bg-amber-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-sm mx-auto px-4 pt-5 space-y-6">

        {/* Nudge */}
        {nextUp && (categoryProgress[nextUp.slug]?.pct ?? 0) < 100 && (
          <Link href={`/u/${token}/category/${nextUp.slug}`}>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">{nextUp.icon}</span>
              <div className="flex-1">
                <div className="text-xs text-amber-400 uppercase tracking-widest">Up Next</div>
                <div className="font-semibold text-stone-100">{nextUp.title}</div>
              </div>
              <span className="text-amber-400">→</span>
            </div>
          </Link>
        )}

        {/* Categories by tier */}
        {tierOrder.map(tier => (
          <div key={tier}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                tier === 'essential' ? 'bg-red-900/50 text-red-400' :
                tier === 'core' ? 'bg-amber-900/50 text-amber-400' :
                tier === 'good-to-have' ? 'bg-stone-700 text-stone-400' :
                'bg-purple-900/50 text-purple-400'
              }`}>
                {tierLabels[tier]}
              </span>
            </div>
            <div className="space-y-2">
              {grouped[tier].map(cat => {
                const prog = categoryProgress[cat.slug] || { pct: 0, gotIt: 0, total: cat.phrases.length }
                return (
                  <Link key={cat.slug} href={`/u/${token}/category/${cat.slug}`}>
                    <div className="bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl p-4 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cat.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-stone-100 text-sm">{cat.title}</div>
                          <div className="text-xs text-stone-500 truncate">{cat.description}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs text-stone-400">{prog.gotIt}/{prog.total}</div>
                        </div>
                      </div>
                      <div className="mt-2 bg-stone-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${prog.pct === 100 ? 'bg-green-500' : 'bg-amber-400'}`}
                          style={{ width: `${prog.pct}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}

        {/* Keepers */}
        <Link href={`/u/${token}/keepers`}>
          <div className="bg-amber-900/20 hover:bg-amber-900/30 border border-amber-700/40 rounded-xl p-4 flex items-center gap-3 transition-colors">
            <span className="text-2xl">★</span>
            <div className="flex-1">
              <div className="font-semibold text-amber-300">Keepers</div>
              <div className="text-xs text-stone-500">
                {starredCount === 0 ? 'Star cards to drill your favourites' : `${starredCount} phrase${starredCount === 1 ? '' : 's'} starred`}
              </div>
            </div>
            <span className="text-amber-400">→</span>
          </div>
        </Link>

        {/* Practice button */}
        <Link href={`/u/${token}/practice`}>
          <div className="bg-purple-900/30 hover:bg-purple-900/50 border border-purple-700/50 rounded-xl p-4 flex items-center gap-3 transition-colors">
            <span className="text-2xl">💬</span>
            <div className="flex-1">
              <div className="font-semibold text-purple-300">AI Conversation Practice</div>
              <div className="text-xs text-stone-500">Chat with a Moroccan local (powered by Claude)</div>
            </div>
            <span className="text-purple-400">→</span>
          </div>
        </Link>

      </div>
    </main>
  )
}
