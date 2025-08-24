import React from 'react'
import { Link } from 'react-router-dom'

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Power Your Future with
          <span className="block text-yellow-300">Renewable Energy</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Premium solar panels, batteries, inverters, and EV charging stations 
          for your sustainable energy needs. Join the green revolution today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/products" 
            className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold text-lg rounded-lg hover:bg-yellow-300 transition-colors duration-200"
          >
            Shop Now
          </Link>
          <Link 
            to="/about" 
            className="px-8 py-4 border-2 border-white text-white font-bold text-lg rounded-lg hover:bg-white hover:text-gray-900 transition-colors duration-200"
          >
            Learn More
          </Link>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-300 mb-2">1000+</div>
            <div className="text-lg">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-300 mb-2">50+</div>
            <div className="text-lg">Product Categories</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-300 mb-2">24/7</div>
            <div className="text-lg">Expert Support</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
