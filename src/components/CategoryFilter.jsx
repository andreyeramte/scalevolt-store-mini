import React from 'react'

function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const categories = [
    { id: '', name: 'All Categories' },
    { id: 'solar-panels', name: 'Solar Panels' },
    { id: 'batteries', name: 'Batteries' },
    { id: 'inverters', name: 'Inverters' },
    { id: 'ev-chargers', name: 'EV Chargers' }
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            selectedCategory === category.id
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
