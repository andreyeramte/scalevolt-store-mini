import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { RegionProvider } from './contexts/RegionContext.jsx'
import { CartProvider } from './contexts/CartContext.jsx'
import RegionBanner from './components/RegionBanner'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeView from './views/HomeView'
import ProductsView from './views/ProductsView'
import ProductDetailView from './views/ProductDetailView'
import CartView from './views/CartView'
import CheckoutView from './views/CheckoutView'
import CheckoutSuccess from './views/CheckoutSuccess'
import AuthView from './views/AuthView'
import UserProfileView from './views/UserProfileView'
import AdminDashboard from './views/AdminDashboard'
import AboutView from './views/Company/AboutView'
import PrivacyView from './views/Company/PrivacyView'
import LegalTermsView from './views/Company/LegalTermsView'
import './App.css'

function App() {
  return (
    <RegionProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <RegionBanner />
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomeView />} />
                <Route path="/products" element={<ProductsView />} />
                <Route path="/products/:id" element={<ProductDetailView />} />
                <Route path="/cart" element={<CartView />} />
                <Route path="/checkout" element={<CheckoutView />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/auth" element={<AuthView />} />
                <Route path="/profile" element={<UserProfileView />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/about" element={<AboutView />} />
                <Route path="/privacy" element={<PrivacyView />} />
                <Route path="/legal" element={<LegalTermsView />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </RegionProvider>
  )
}

export default App
