'use client'
import { useState, FormEvent } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [formData, setFormData] = useState({
    name: '',
    org: '',
    email: '',
    message: '',
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', org: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const field =
    'w-full border border-cream-dark bg-white rounded px-4 py-3 text-forest placeholder:text-forest/30 focus:outline-none focus:ring-2 focus:ring-rust/30 focus:border-rust transition'

  return (
    <section id="contact" className="bg-cream py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left column */}
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-forest mb-4">
              Let's talk
            </h2>
            <p className="text-forest/65 text-lg mb-10 leading-relaxed">
              The first conversation is free. Tell me a bit about what's going on and we'll
              find 30 minutes to talk it through.
            </p>
            <div className="bg-cream-dark rounded-lg p-6">
              <p className="text-forest/50 text-xs uppercase tracking-widest font-medium mb-2">
                Book directly
              </p>
              <a
                href="https://calendly.com/scottgriffiths"
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif text-xl text-forest hover:text-rust transition-colors"
              >
                Schedule a free consult →
              </a>
              <p className="text-forest/40 text-sm mt-1">Opens Calendly</p>
            </div>
          </div>

          {/* Right column — form */}
          <div>
            {status === 'success' ? (
              <div className="border border-forest/15 rounded-lg p-10 text-center">
                <p className="text-3xl mb-4">✓</p>
                <h3 className="font-serif text-xl text-forest mb-2">Got it, thanks.</h3>
                <p className="text-forest/60">I'll be in touch within a day or two.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-forest/65 mb-1.5"
                  >
                    Your name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={field}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="org"
                    className="block text-sm font-medium text-forest/65 mb-1.5"
                  >
                    Organization
                  </label>
                  <input
                    id="org"
                    type="text"
                    required
                    value={formData.org}
                    onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                    className={field}
                    placeholder="Your organization"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-forest/65 mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={field}
                    placeholder="you@yourorg.org"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-forest/65 mb-1.5"
                  >
                    What's working? What hurts?
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`${field} resize-none`}
                    placeholder="Tell me what's going on. No wrong answers here."
                  />
                </div>
                {status === 'error' && (
                  <p className="text-rust text-sm">
                    Something went wrong — try again or email directly.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-rust hover:bg-rust-dark disabled:opacity-50 text-white py-4 rounded font-medium text-lg transition-colors"
                >
                  {status === 'submitting' ? 'Sending…' : 'Send it'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
