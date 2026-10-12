'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Menu, ShoppingCart, Home, MessageCircle, X, TrendingUp, Clock, ArrowLeft, Moon, Sun, Phone, User, LogOut, LogIn, Package, ChevronDown, Truck, ShieldCheck, MapPin, LayoutGrid, Headphones } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useProducts, useCategories } from '@/hooks/useProducts'
import { Product } from '@/lib/realtimeProducts'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { useCartStore } from '@/store/cartStore'

const isImageUrl = (str: string) => str?.startsWith('http') || str?.startsWith('/') || str?.startsWith('data:')

const popularSearches = ['Kamera', 'WiFi', 'Sigurnost', 'Smart Home']

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { products } = useProducts()
  const { categories } = useCategories()
  const { theme, toggleTheme } = useTheme()
  const { user, userProfile, logout } = useAuth()
  const totalItems = useCartStore((state) => state.getTotalItems())
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)
  const [catDropdown, setCatDropdown] = useState(false)
  const [infoDropdown, setInfoDropdown] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const [searchCatOpen, setSearchCatOpen] = useState(false)
  const catRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const searchCatRef = useRef<HTMLDivElement>(null)
  const desktopSearchRef = useRef<HTMLDivElement>(null)
  const desktopInputRef = useRef<HTMLInputElement>(null)

  const isDark = theme === 'dark'

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { href: '/', icon: Home, label: 'Početna' },
    { href: '/chat', icon: MessageCircle, label: 'Chat' },
    { href: '/cart', icon: ShoppingCart, label: 'Korpa' },
    { href: '/tracking', icon: Package, label: 'Narudžbe' },
    { href: '/contact', icon: Phone, label: 'Kontakt' },
  ]

  // Mobile quick-nav — mirrors the desktop navigation row (RED 2)
  const mobileNavItems = [
    { href: '/', label: 'Početna', active: pathname === '/', accent: false },
    { href: '/products?filter=sale', label: 'Akcije', active: false, accent: true },
    { href: '/products?filter=new', label: 'Novo', active: false, accent: false },
    { href: '/blog', label: 'Blog', active: pathname.startsWith('/blog'), accent: false },
    { href: '/contact', label: 'Kontakt', active: pathname.startsWith('/contact'), accent: false },
  ]

  // Search products
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const query = searchQuery.toLowerCase()
      const results = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      ).slice(0, 6)
      setSearchResults(results)
      setShowResults(true)
    } else {
      setSearchResults([])
      if (searchQuery.length === 0 && isFocused) {
        setShowResults(true)
      } else {
        setShowResults(false)
      }
    }
  }, [searchQuery, products, isFocused])

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const targetNode = e.target as Node
      const clickedInsideMobileSearch = !!searchRef.current && searchRef.current.contains(targetNode)
      const clickedInsideDesktopSearch = !!desktopSearchRef.current && desktopSearchRef.current.contains(targetNode)

      if (!clickedInsideMobileSearch && !clickedInsideDesktopSearch) {
        setShowResults(false)
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (catRef.current && !catRef.current.contains(target)) setCatDropdown(false)
      if (infoRef.current && !infoRef.current.contains(target)) setInfoDropdown(false)
      if (userRef.current && !userRef.current.contains(target)) setUserDropdown(false)
      if (searchCatRef.current && !searchCatRef.current.contains(target)) setSearchCatOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close everything on route change
  useEffect(() => {
    setMenuOpen(false)
    setCatDropdown(false)
    setInfoDropdown(false)
    setUserDropdown(false)
    setSearchCatOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
      closeSearch()
    }
  }

  const handleResultClick = (slugOrId: string) => {
    setSearchQuery('')
    closeSearch()
    router.push(`/product/${slugOrId}`)
  }

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term)
    router.push(`/products?search=${encodeURIComponent(term)}`)
    closeSearch()
  }

  const handleFocus = () => {
    setIsFocused(true)
    setShowResults(true)
  }

  const closeSearch = () => {
    setIsFocused(false)
    setShowResults(false)
    setSearchQuery('')
    inputRef.current?.blur()
    desktopInputRef.current?.blur()
  }

  const navLink =
    'h-full flex items-center text-[15px] font-medium border-b-[3px] border-transparent transition-colors whitespace-nowrap'

  return (
    <>
      {/* Overlay for mobile when search is focused */}
      {isFocused && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={closeSearch}
        />
      )}

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-down Menu */}
      <div className={`fixed top-0 left-0 right-0 bg-background z-[70] lg:hidden transform transition-transform duration-300 ease-out ${
        menuOpen ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-h-[85vh] overflow-y-auto">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-lg font-bold text-text">Menu</h2>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 hover:bg-white/5 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-muted" />
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isDark
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                    : 'bg-gradient-to-br from-yellow-400 to-orange-500'
                }`}>
                  {isDark ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-text">{isDark ? 'Tamni mod' : 'Svijetli mod'}</p>
                  <p className="text-xs text-muted">{isDark ? 'Ugodan za oči' : 'Klasičan izgled'}</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-12 h-6 rounded-full transition-all ${
                  isDark ? 'bg-indigo-500' : 'bg-orange-400'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  isDark ? 'left-1' : 'left-7'
                }`} />
              </button>
            </div>
          </div>

          {/* User Account Section */}
          <div className="p-4 border-b border-white/5">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">
                        {(userProfile?.displayName || user.email || '?')[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">{userProfile?.displayName || 'Korisnik'}</p>
                    <p className="text-xs text-muted truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 py-2 rounded-lg transition-colors"
                  >
                    Moj profil
                  </Link>
                  <Link
                    href="/tracking"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 py-2 rounded-lg transition-colors"
                  >
                    Narudžbe
                  </Link>
                  <button
                    onClick={async () => { await logout(); setMenuOpen(false) }}
                    className="flex-1 text-center text-xs font-medium text-danger bg-danger/10 hover:bg-danger/20 py-2 rounded-lg transition-colors"
                  >
                    Odjava
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 w-full"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text">Prijavite se</p>
                    <p className="text-xs text-muted">Za sve funkcije i praćenje narudžbi</p>
                  </div>
                  <div className="bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-lg">
                    Prijava
                  </div>
                </Link>
                <Link
                  href="/tracking"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 w-full p-2 bg-blue-500/5 hover:bg-blue-500/10 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-blue-400">Prati narudžbu</span>
                </Link>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <div className="p-2">
            {navItems.map(({ href, label }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-text hover:bg-white/5'
                  }`}
                >
                  <span className="font-medium">{label}</span>
                  {label === 'Korpa' && mounted && totalItems > 0 && (
                    <span className="bg-danger text-white text-xs px-2 py-0.5 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Categories Section */}
          <div className="p-4 border-t border-white/5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Kategorije</h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products/category/${category.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-text hover:bg-white/5 transition-colors font-medium"
                >
                  {category.name}
                </Link>
              ))}

              {/* Rasprodaja */}
              <Link
                href="/products/category/rasprodaja"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl bg-danger/10 text-danger hover:bg-danger/20 transition-colors font-medium"
              >
                Rasprodaja
              </Link>
            </div>
          </div>

          {/* Informacije Section */}
          <div className="p-4 border-t border-white/5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Informacije</h3>
            <div className="space-y-1">
              <Link
                href="/o-nama"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-text hover:bg-white/5 transition-colors font-medium"
              >
                O nama
              </Link>
              <Link
                href="/dostava"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-text hover:bg-white/5 transition-colors font-medium"
              >
                Dostava
              </Link>
              <Link
                href="/garancija"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-text hover:bg-white/5 transition-colors font-medium"
              >
                Garancija
              </Link>
              <Link
                href="/reklamacije"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-text hover:bg-white/5 transition-colors font-medium"
              >
                Reklamacije i povrat
              </Link>
            </div>
          </div>
        </div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 shadow-sm">
        {/* MOBILNA TRUST TRAKA — ekvivalent desktop RED 0 */}
        <div className={`lg:hidden bg-surface border-b border-white/10 overflow-hidden ${isFocused ? 'hidden' : ''}`}>
          <div className="flex items-center gap-3 px-4 h-8 overflow-x-auto scrollbar-hide whitespace-nowrap text-[11px] font-medium text-text">
            <span className="flex items-center gap-1.5 shrink-0">
              <Truck className="w-3.5 h-3.5 text-primary" />
              Brza dostava 24-48h
            </span>
            <span className="w-px h-3.5 bg-white/10 shrink-0" />
            <span className="flex items-center gap-1.5 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              6 mjeseci garancije
            </span>
            <span className="w-px h-3.5 bg-white/10 shrink-0" />
            <span className="flex items-center gap-1.5 shrink-0">
              <Headphones className="w-3.5 h-3.5 text-primary" />
              Podrška nakon kupovine
            </span>
            <span className="w-px h-3.5 bg-white/10 shrink-0" />
            <span className="flex items-center gap-1.5 shrink-0 text-muted">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              BiH · KM
            </span>
          </div>
        </div>

        {/* RED 0 - info traka (trust + država/valuta) */}
        <div className="hidden lg:block bg-surface border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8 h-10">
            <div className="flex items-center gap-5 xl:gap-6 text-[12px] font-medium text-text">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-primary" />
                Brza dostava 24-48h
              </span>
              <span className="w-px h-4 bg-white/10" />
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                6 mjeseci garancije
              </span>
              <span className="w-px h-4 bg-white/10" />
              <span className="flex items-center gap-1.5">
                <Headphones className="w-4 h-4 text-primary" />
                Podrška nakon kupovine
              </span>
            </div>
            <div className="flex items-center gap-4 xl:gap-5 text-[12px] text-muted">
              <button type="button" className="flex items-center gap-1.5 hover:text-text transition-colors">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium tracking-[0.08em]">BOSNA I HERCEGOVINA</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <span className="w-px h-4 bg-white/10" />
              <button type="button" className="flex items-center gap-1.5 hover:text-text transition-colors">
                <span className="font-medium">KM</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* RED 1 - logo + velika search traka + korisničke akcije */}
        <div className="bg-surface border-b border-white/10">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-x-3 lg:gap-6 px-4 lg:px-8 py-2 lg:py-0 min-h-[60px] lg:h-[80px]">
            {/* Logo */}
            <Link href="/" className={`items-center flex-shrink-0 ${isFocused ? 'hidden lg:flex' : 'flex'}`}>
              <img
                src="/assets/images/elesonic-logo.png"
                alt="ELESONIC"
                className="h-8 lg:h-10 w-auto object-contain max-w-[150px] min-[360px]:max-w-none"
              />
            </Link>

            {/* Desktop search - velika, centralna traka */}
            <div ref={desktopSearchRef} className="hidden lg:flex flex-1 justify-center relative">
              <form onSubmit={handleSearch} className="w-full max-w-xl xl:max-w-2xl">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted pointer-events-none" />
                  <input
                    ref={desktopInputRef}
                    type="text"
                    placeholder="Šta tražite danas?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => { setIsFocused(false); setShowResults(true) }}
                    className="w-full bg-background border border-white/10 rounded-full py-3 pl-12 pr-[136px] xl:pr-[256px] text-sm text-text placeholder:text-muted focus:outline-none focus:border-primary"
                  />
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-3">
                    {/* Sve kategorije (skraćeni izbor) */}
                    <div ref={searchCatRef} className="relative hidden xl:block">
                      <button
                        type="button"
                        onClick={() => setSearchCatOpen(!searchCatOpen)}
                        className="flex items-center gap-1 text-[13px] text-muted hover:text-text pl-2.5 pr-0 py-1.5 whitespace-nowrap transition-colors"
                      >
                        Sve kategorije
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${searchCatOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {searchCatOpen && (
                        <div className="absolute top-full right-0 mt-2 w-56 bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 py-1 max-h-72 overflow-y-auto">
                          <Link
                            href="/products"
                            onClick={() => setSearchCatOpen(false)}
                            className="block px-4 py-2.5 text-sm text-text hover:bg-white/5 transition-colors"
                          >
                            Sve kategorije
                          </Link>
                          {categories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/products/category/${category.slug}`}
                              onClick={() => setSearchCatOpen(false)}
                              className="block px-4 py-2.5 text-sm text-text hover:bg-white/5 transition-colors"
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="hidden xl:block w-px h-5 bg-white/10" />
                    <button
                      type="submit"
                      className="flex items-center bg-primary hover:opacity-90 text-white text-[13px] font-semibold px-5 py-2.5 rounded-full transition-all"
                    >
                      <span className="flex items-center gap-1.5 text-[13px] font-semibold text-white">
                        <Search className="w-3.5 h-3.5" />
                        Pretraži
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Mobile Search — svoj red ispod logoa i dugmadi da se ne preklapa */}
            <div
              className={`relative z-50 order-3 transition-all duration-200 lg:hidden ${
                isFocused
                  ? 'w-full min-w-0'
                  : 'w-full min-w-0 mt-1.5'
              }`}
              ref={searchRef}
            >
              <form onSubmit={handleSearch}>
                <div className="relative flex items-center gap-2">
                  {/* Back button on mobile when focused */}
                  {isFocused && (
                    <button
                      type="button"
                      onClick={closeSearch}
                      className="p-2 -ml-2 lg:hidden flex-shrink-0"
                    >
                      <ArrowLeft className="w-5 h-5 text-text" />
                    </button>
                  )}
                  <div className="relative flex-1 min-w-0">
                    <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 transition-colors ${
                      isFocused ? 'text-primary' : 'text-muted'
                    }`} />
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Šta tražite danas?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={handleFocus}
                      className={`w-full min-w-0 bg-background border rounded-full py-2.5 lg:py-3 pl-10 lg:pl-12 pr-10 text-sm text-text placeholder:text-muted focus:outline-none transition-all ${
                        isFocused
                          ? 'border-primary shadow-lg shadow-primary/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => { setSearchQuery(''); inputRef.current?.focus() }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-muted" />
                      </button>
                    )}
                  </div>
                </div>
              </form>

              {/* Search Dropdown (mobile) */}
              {showResults && (
                <div className={`bg-surface border border-white/10 shadow-2xl shadow-black/30 overflow-hidden z-50 max-h-[75vh] overflow-y-auto ${
                  isFocused
                    ? 'fixed left-0 right-0 top-[60px] rounded-none border-x-0 border-t-0 lg:absolute lg:left-0 lg:right-0 lg:top-full lg:mt-2 lg:rounded-2xl lg:border'
                    : 'absolute top-full left-0 right-0 mt-2 rounded-2xl'
                }`}>

                  {/* No query - show suggestions */}
                  {searchQuery.length === 0 && (
                    <>
                      <div className="p-4 border-b border-white/5">
                        <div className="flex items-center gap-2 text-xs text-muted mb-3">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Popularno</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {popularSearches.map((term) => (
                            <button
                              key={term}
                              onClick={() => handlePopularSearch(term)}
                              className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-sm rounded-full transition-colors"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>

                      {products.length > 0 && (
                        <div className="p-4">
                          <div className="flex items-center gap-2 text-xs text-muted mb-3">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Preporučeno</span>
                          </div>
                          <div className="space-y-1">
                            {products.slice(0, 4).map((product) => (
                              <button
                                key={product.id}
                                onClick={() => handleResultClick(product.slug || product.id!)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors text-left"
                              >
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                                  {isImageUrl(product.image) ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-xl">{product.image}</span>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-text truncate">{product.name}</p>
                                  <p className="text-xs text-muted">{product.category}</p>
                                </div>
                                <span className="text-sm font-bold text-primary">{product.price.toFixed(2)} KM</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Search Results */}
                  {searchQuery.length > 1 && searchResults.length > 0 && (
                    <>
                      <div className="p-2">
                        {searchResults.map((product, index) => (
                          <button
                            key={product.id}
                            onClick={() => handleResultClick(product.slug || product.id!)}
                            className={`w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors text-left ${
                              index === 0 ? 'bg-white/[0.02]' : ''
                            }`}
                          >
                            <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {isImageUrl(product.image) ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-2xl">{product.image}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-text line-clamp-1 font-medium">{product.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted">{product.category}</span>
                                {product.badge && (
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                    product.badge === 'sale' ? 'bg-danger/20 text-danger' : 'bg-accent/20 text-accent'
                                  }`}>
                                    {product.badge === 'sale' ? 'Akcija' : 'Novo'}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className="text-base font-bold text-primary">{product.price.toFixed(2)} KM</span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-[11px] text-muted line-through block">{product.originalPrice.toFixed(2)}</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                      <Link
                        href={`/products?search=${encodeURIComponent(searchQuery)}`}
                        onClick={closeSearch}
                        className="flex items-center justify-center gap-2 p-4 text-sm text-primary hover:bg-primary/5 border-t border-white/5 transition-colors font-medium"
                      >
                        <Search className="w-4 h-4" />
                        <span>Vidi sve rezultate za &quot;{searchQuery}&quot;</span>
                      </Link>
                    </>
                  )}

                  {/* No Results */}
                  {searchQuery.length > 1 && searchResults.length === 0 && (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-muted" />
                      </div>
                      <p className="text-base text-text mb-1">Nema rezultata</p>
                      <p className="text-sm text-muted">Pokušajte s drugim pojmom za &quot;{searchQuery}&quot;</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right side - theme, Moj račun, Korpa, burger */}
            <div className={`order-2 items-center gap-1.5 lg:gap-5 lg:order-none ${isFocused ? 'hidden lg:flex' : 'flex'}`}>
              {/* Theme toggle - kružno dugme */}
              <button
                onClick={toggleTheme}
                className={`${isFocused ? 'hidden' : 'flex'} items-center justify-center w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-background border border-white/10 hover:bg-white/5 transition-colors shrink-0`}
                aria-label="Toggle theme"
              >
                {isDark ? <Moon className="w-5 h-5 text-text" /> : <Sun className="w-5 h-5 text-text" />}
              </button>

              {/* Moj račun */}
              <div ref={userRef} className="relative hidden lg:block">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 px-2.5 h-10 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <User className="w-[18px] h-[18px] text-text" />
                  <span className="text-[13px] font-medium text-text">Moj račun</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform ${userDropdown ? 'rotate-180' : ''}`} />
                </button>
                {userDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-60 bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 py-1">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-white/5">
                          <p className="text-sm font-medium text-text truncate">{userProfile?.displayName || 'Korisnik'}</p>
                          <p className="text-xs text-muted truncate">{user.email}</p>
                        </div>
                        <Link href="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text hover:bg-white/5 transition-colors">
                          <User className="w-4 h-4 text-muted" />
                          Moj profil
                        </Link>
                        <Link href="/tracking" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text hover:bg-white/5 transition-colors">
                          <Package className="w-4 h-4 text-muted" />
                          Moje narudžbe
                        </Link>
                        <button
                          onClick={async () => { setUserDropdown(false); await logout() }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-danger hover:bg-danger/5 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Odjava
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/auth/login" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text hover:bg-white/5 transition-colors">
                          <LogIn className="w-4 h-4 text-muted" />
                          Prijava
                        </Link>
                        <Link href="/auth/register" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text hover:bg-white/5 transition-colors">
                          <User className="w-4 h-4 text-muted" />
                          Registracija
                        </Link>
                        <Link href="/tracking" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text hover:bg-white/5 transition-colors border-t border-white/5">
                          <Package className="w-4 h-4 text-muted" />
                          Praćenje narudžbe
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Korpa sa narandžastim badžom */}
              <Link
                href="/cart"
                className="relative flex items-center gap-2 px-2.5 h-10 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Korpa"
              >
                <div className="relative">
                  <ShoppingCart className="w-[18px] h-[18px] text-text" />
                  {mounted && (
                    <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 bg-orange-500 rounded-full text-[11px] flex items-center justify-center font-bold text-[#ffffff]">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="hidden lg:block text-[13px] font-medium text-text">Korpa</span>
              </Link>

              {/* Mobile burger menu */}
              <button
                onClick={() => setMenuOpen(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5 text-text" />
              </button>
            </div>
          </div>
        </div>

        {/* MOBILNA NAVIGACIJA — ekvivalent desktop RED 2 (kategorije + glavni linkovi) */}
        <div className={`lg:hidden bg-surface border-b border-white/10 ${isFocused ? 'hidden' : ''}`}>
          <div className="flex items-center gap-2 px-4 h-11 overflow-x-auto scrollbar-hide">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="shrink-0 flex items-center gap-1.5 bg-primary hover:opacity-90 text-white text-[12px] font-semibold px-3 h-7 rounded-lg transition-opacity"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Sve kategorije
              <ChevronDown className="w-3 h-3" />
            </button>

            {mobileNavItems.map(({ href, label, accent, active }) => (
              <Link
                key={href}
                href={href}
                className={`shrink-0 flex items-center h-7 px-3 rounded-lg text-[12px] font-medium whitespace-nowrap border transition-colors ${
                  active
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : accent
                      ? 'bg-orange-500/10 text-orange-500 border-orange-500/30 font-semibold'
                      : 'text-text border-white/10 hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* RED 2 - kategorije + glavna navigacija */}
        <div className="hidden lg:block bg-surface border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center gap-10 px-4 lg:px-8 h-16">
            {/* Sve kategorije dugme + mega dropdown */}
            <div ref={catRef} className="relative h-full flex items-center">
              <button
                onClick={() => { setCatDropdown(!catDropdown); setInfoDropdown(false) }}
                className="flex items-center bg-primary hover:opacity-90 text-white text-sm font-semibold px-7 h-11 rounded-lg transition-all"
              >
                <span className="flex items-center gap-2.5 text-sm font-semibold text-white">
                  <LayoutGrid className="w-[18px] h-[18px]" />
                  Sve kategorije
                  <ChevronDown className={`w-4 h-4 transition-transform ${catDropdown ? 'rotate-180' : ''}`} />
                </span>
              </button>
              {catDropdown && (
                <div className="absolute top-full left-0 mt-1 w-[640px] bg-surface border border-white/10 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden z-50">
                  <div className="p-4 grid grid-cols-4 gap-3 max-h-[70vh] overflow-y-auto">
                    {categories.map((category) => (
                      <Link key={category.id} href={`/products/category/${category.slug}`} className="group">
                        <div className="aspect-square rounded-xl overflow-hidden bg-white/5 flex items-center justify-center mb-1.5 group-hover:ring-2 ring-primary transition-all">
                          {category.imageUrl ? (
                            <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl">{category.icon}</span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-text group-hover:text-primary transition-colors text-center line-clamp-2">
                          {category.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-white/5 py-1">
                    <Link
                      href="/products/category/rasprodaja"
                      className="block px-4 py-2.5 text-sm text-danger hover:bg-danger/5 transition-colors"
                    >
                      😥 Rasprodaja
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Glavni linkovi */}
            <nav className="flex items-center gap-10 h-full">
              <Link
                href="/"
                className={`${navLink} ${
                  pathname === '/' ? 'text-primary border-primary' : 'text-text hover:text-primary'
                }`}
              >
                Početna
              </Link>
              <Link
                href="/products?filter=sale"
                className={`${navLink} text-orange-500 hover:text-orange-600 font-semibold`}
              >
                Akcije
              </Link>
              <Link
                href="/products?filter=new"
                className={`${navLink} text-text hover:text-primary`}
              >
                Novo
              </Link>
              <Link
                href="/blog"
                className={`${navLink} ${
                  pathname.startsWith('/blog') ? 'text-primary border-primary' : 'text-text hover:text-primary'
                }`}
              >
                Blog
              </Link>

              {/* Informacije dropdown */}
              <div ref={infoRef} className="relative h-full flex items-center">
                <button
                  onClick={() => { setInfoDropdown(!infoDropdown); setCatDropdown(false) }}
                  className={`${navLink} gap-1 ${
                    infoDropdown ? 'text-primary border-primary' : 'text-text hover:text-primary'
                  }`}
                >
                  Informacije
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${infoDropdown ? 'rotate-180' : ''}`} />
                </button>
                {infoDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 py-1">
                    <Link href="/o-nama" className="block px-4 py-2.5 text-sm text-text hover:bg-white/5 transition-colors">O nama</Link>
                    <Link href="/dostava" className="block px-4 py-2.5 text-sm text-text hover:bg-white/5 transition-colors">Dostava</Link>
                    <Link href="/garancija" className="block px-4 py-2.5 text-sm text-text hover:bg-white/5 transition-colors">Garancija</Link>
                    <Link href="/reklamacije" className="block px-4 py-2.5 text-sm text-text hover:bg-white/5 transition-colors">Reklamacije i povrat</Link>
                    <Link href="/usluge" className="block px-4 py-2.5 text-sm text-text hover:bg-white/5 transition-colors">Usluge</Link>
                  </div>
                )}
              </div>

              <Link
                href="/contact"
                className={`${navLink} ${
                  pathname.startsWith('/contact') ? 'text-primary border-primary' : 'text-text hover:text-primary'
                }`}
              >
                Kontakt
              </Link>
            </nav>
          </div>
        </div>
      </header>
    </>
  )
}
