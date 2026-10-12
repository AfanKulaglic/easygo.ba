'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Uključi svijetli mod' : 'Uključi tamni mod'}
      aria-pressed={isDark}
      className={`group relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-3xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:gap-4 sm:p-5 lg:p-6 ${
        isDark
          ? 'border-white/10 bg-gradient-to-b from-[#1B2442] to-surface shadow-[0_12px_40px_-18px_rgba(99,102,241,0.45)] hover:border-white/15'
          : 'border-slate-200/80 bg-gradient-to-b from-white to-slate-50 shadow-[0_12px_40px_-18px_rgba(15,23,42,0.18)] hover:border-slate-300/80'
      }`}
    >
      {/* Meki statički sjaj iza prekidača */}
      <span
        className={`pointer-events-none absolute right-10 top-1/2 h-24 w-44 -translate-y-1/2 rounded-full blur-3xl opacity-20 ${
          isDark ? 'bg-indigo-500' : 'bg-amber-400'
        }`}
      />

      {/* Lijeva strana — ikona + tekst */}
      <div className="relative flex min-w-0 items-center gap-3 sm:gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-lg transition-shadow duration-300 sm:h-12 sm:w-12 ${
            isDark
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/25'
              : 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/25'
          }`}
        >
          {isDark ? (
            <Moon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
          ) : (
            <Sun className="h-5 w-5 text-white sm:h-6 sm:w-6" />
          )}
        </div>

        <div className="min-w-0">
          <h3
            className={`text-lg font-bold tracking-tight sm:text-xl lg:text-2xl ${
              isDark ? 'text-white' : 'text-text'
            }`}
          >
            {isDark ? 'Tamni mod' : 'Svijetli mod'}
          </h3>
          <p className="mt-0.5 truncate text-[11px] text-muted sm:text-xs">
            {isDark ? 'Ugodan za oči u mraku' : 'Klasičan svijetli izgled'}
          </p>
        </div>
      </div>

      {/* Premium prekidač (iOS stil) */}
      <span
        className={`relative z-10 flex h-11 w-[92px] shrink-0 items-center rounded-full p-1 transition-colors duration-300 sm:h-12 sm:w-28 ${
          isDark
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)]'
            : 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-[inset_0_2px_6px_rgba(0,0,0,0.12)]'
        }`}
      >
        {/* Sunce lijevo */}
        <span className="flex h-full w-1/2 items-center justify-center">
          <Sun
            className={`h-4 w-4 sm:h-5 sm:w-5 ${
              isDark ? 'text-white/40' : 'text-white/90'
            }`}
          />
        </span>
        {/* Mjesec desno */}
        <span className="flex h-full w-1/2 items-center justify-center">
          <Moon
            className={`h-4 w-4 sm:h-5 sm:w-5 ${
              isDark ? 'text-white/90' : 'text-white/40'
            }`}
          />
        </span>
        {/* Klizajući knob */}
        <span
          className={`absolute left-1 top-1 z-10 flex h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)] items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-out ${
            isDark ? 'translate-x-full' : 'translate-x-0'
          }`}
        >
          {isDark ? (
            <Moon className="h-4 w-4 text-indigo-600 sm:h-5 sm:w-5" />
          ) : (
            <Sun className="h-4 w-4 text-orange-500 sm:h-5 sm:w-5" />
          )}
        </span>
      </span>
    </button>
  )
}
