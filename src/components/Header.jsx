import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../contexts/CartContext.jsx'
import LanguageSwitcher from './LanguageSwitcher'
import DropdownMenu from './DropdownMenu'

function Header() {
  const { t } = useTranslation()
  const { getCartItemCount } = useCart()
  const [open, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const dropdownRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function onDocClick(e) {
      if (!dropdownRef.current) return
      if (!dropdownRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  useEffect(() => {
    function onMobileMenuClick(e) {
      if (!mobileMenuRef.current) return
      if (!mobileMenuRef.current.contains(e.target)) setMobileMenuOpen(false)
    }
    document.addEventListener('click', onMobileMenuClick)
    return () => document.removeEventListener('click', onMobileMenuClick)
  }, [])

  const submitSearch = (e) => {
    e?.preventDefault?.()
    if (!query.trim()) return
    navigate(`/products?search=${encodeURIComponent(query.trim())}`)
    setSearchOpen(false)
    setMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar - Hidden on mobile */}
        <div className="hidden md:block bg-green-600 text-white py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <span>🌍 {t('header.freeDelivery')}</span>
              <span>📞 {t('header.phone')}</span>
            </div>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Main Header */}
        <div className="py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Company Info */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-600 rounded-xl flex items-center justify-center group-hover:bg-green-700 transition-colors duration-200">
                  <span className="text-white font-bold text-xl md:text-2xl">S</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg md:text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                    ScaleVolt
                  </h1>
                  <p className="text-xs md:text-sm text-gray-600">Renewable Energy Store</p>
                </div>
              </Link>
            </div>

            {/* Search Bar - Hidden on mobile, shown in mobile menu */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={submitSearch} className="relative w-full">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className="w-full px-4 py-3 pl-12 pr-20 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 px-6 bg-green-600 text-white rounded-r-xl hover:bg-green-700 transition-colors duration-200 font-medium"
                >
                  {t('btn.search')}
                </button>
              </form>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4 md:space-x-6">
              {/* Language Selector - Mobile */}
              <div className="md:hidden">
                <LanguageSwitcher />
              </div>

              {/* User Account */}
              <Link to="/auth" className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200 group">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors duration-200">
                  <svg className="w-4 h-4 md:w-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="hidden md:block font-medium">{t('header.account')}</span>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200 group relative">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors duration-200">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                </div>
                <span className="hidden md:block font-medium">{t('header.cart')}</span>
                {/* Cart Badge */}
                {getCartItemCount() > 0 && (
                  <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {getCartItemCount()}
                  </div>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-gray-600 hover:text-green-600 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Menu - Desktop */}
        <nav className="hidden lg:block border-t border-gray-200" ref={dropdownRef}>
          <div className="flex items-center justify-center space-x-8 py-4">
            <Link to="/" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200">
              {t('nav.home')}
            </Link>

            {/* Products with dropdown */}
            <div className="relative">
              <button 
                onClick={() => setOpen((v) => !v)} 
                className="text-gray-700 hover:text-green-600 font-medium inline-flex items-center gap-1 transition-colors duration-200"
              >
                {t('nav.products')}
                <svg className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                </svg>
              </button>
              <DropdownMenu open={open} onClose={() => setOpen(false)} />
            </div>

            <Link to="/about" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200">
              {t('nav.about')}
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200">
              {t('nav.contact')}
            </Link>
            <Link to="/delivery" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200">
              {t('nav.delivery')}
            </Link>
            <Link to="/warranty" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200">
              {t('nav.warranty')}
            </Link>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white" ref={mobileMenuRef}>
            {/* Mobile Search */}
            <div className="p-4 border-b border-gray-200">
              <form onSubmit={submitSearch} className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className="w-full px-4 py-3 pl-12 pr-20 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 px-4 bg-green-600 text-white rounded-r-xl hover:bg-green-700 transition-colors duration-200 font-medium"
                >
                  {t('btn.search')}
                </button>
              </form>
            </div>

            {/* Mobile Navigation */}
            <div className="py-4 space-y-2">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors duration-200"
              >
                {t('nav.home')}
              </Link>
              
              <Link 
                to="/products" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors duration-200"
              >
                {t('nav.products')}
              </Link>
              
              <Link 
                to="/about" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors duration-200"
              >
                {t('nav.about')}
              </Link>
              
              <Link 
                to="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors duration-200"
              >
                {t('nav.contact')}
              </Link>
              
              <Link 
                to="/delivery" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors duration-200"
              >
                {t('nav.delivery')}
              </Link>
              
              <Link 
                to="/warranty" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors duration-200"
              >
                {t('nav.warranty')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
