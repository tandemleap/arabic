'use client'
import { useState, useEffect } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? 'bg-cream/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <span
          className={`font-serif text-lg font-semibold transition-colors duration-200 ${
            scrolled ? 'text-forest' : 'text-cream'
          }`}
        >
          Scott Griffiths
        </span>
        <a
          href="#contact"
          className="bg-rust hover:bg-rust-dark text-white px-5 py-2 rounded text-sm font-medium transition-colors"
        >
          Book a Free Consult
        </a>
      </div>
    </nav>
  )
}
