import React, { useState, useEffect } from 'react';
import { ShoppingCart, Info } from 'lucide-react';

// Mock data - you'll replace this with your actual data source
const equipmentData = [
  {
    id: 1,
    name: '19\' Scissor Lift',
    category: 'Construction Lifts',
    image: '/images/equipment/19-scissor-lift.png',
    pricing: {
      day: 150,
      week: 300,
      month: 600
    },
    specifications: [
      'Height: 19 feet',
      'Weight Capacity: 500 lbs',
      'Self-Propelled'
    ]
  },
  {
    id: 2,
    name: '26\' Scissor Lift',
    category: 'Construction Lifts',
    image: '/images/equipment/26-scissor-lift.png',
    pricing: {
      day: 250,
      week: 475,
      month: 925
    },
    specifications: [
      'Height: 26 feet',
      'Weight Capacity: 750 lbs',
      'Electric Drive'
    ]
  },
  {
    id: 3,
    name: '50 Tons Rough Terrain Crane',
    category: 'Heavy Machinery',
    image: '/images/equipment/50-ton-crane.png',
    pricing: {
      day: 1500,
      week: 4500,
      month: 13500
    },
    specifications: [
      'Capacity: 50 Tons',
      'Rough Terrain',
      'Diesel Powered'
    ]
  },
  {
    id: 4,
    name: 'Single Man Lift (12\' Vertical Mast)',
    category: 'Aerial Work Platforms',
    image: '/images/equipment/12-vertical-mast-lift.png',
    pricing: {
      day: 100,
      week: 250,
      month: 750
    },
    specifications: [
      'Height: 12 feet',
      'Self-Propelled',
      'Compact Design'
    ]
  }
];

const EquipmentRentalCard = ({ equipment, onReserve }) => {
  const [selectedDuration, setSelectedDuration] = useState('day');
  const [quantity, setQuantity] = useState(1);

  const calculateTotalPrice = () => {
    return equipment.pricing[selectedDuration] * quantity;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="flex items-center mb-4">
        <img 
          src={equipment.image} 
          alt={equipment.name} 
          className="w-40 h-40 object-contain mr-4 rounded-lg"
        />
        <div>
          <h3 className="text-xl font-bold text-gray-800">{equipment.name}</h3>
          <span className="text-sm text-gray-600 bg-blue-100 px-2 rounded">
            {equipment.category}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-2 text-gray-700">Specifications:</h4>
        <ul className="text-sm text-gray-600">
          {equipment.specifications.map((spec, index) => (
            <li key={index} className="flex items-center">
              <span className="mr-2">•</span>{spec}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-2 text-gray-700">Rental Duration:</h4>
        <div className="flex space-x-2 mb-2">
          {Object.keys(equipment.pricing).map(duration => (
            <button
              key={duration}
              className={`px-3 py-1 rounded text-sm 
                ${selectedDuration === duration 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={() => setSelectedDuration(duration)}
            >
              {duration.charAt(0).toUpperCase() + duration.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4 mt-2">
          <div className="flex items-center">
            <label className="mr-2 text-sm text-gray-700">Quantity:</label>
            <div className="flex items-center border rounded">
              <button 
                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="px-3 text-sm">{quantity}</span>
              <button 
                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-bold text-gray-800">
            Total: ${calculateTotalPrice()}
          </p>
          <p className="text-sm text-gray-600">
            ${equipment.pricing[selectedDuration]} per {selectedDuration}
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600 transition-colors"
            onClick={() => onReserve(equipment, selectedDuration, quantity)}
          >
            <ShoppingCart className="mr-2" size={20} /> Reserve
          </button>
          <button 
            className="border border-blue-500 text-blue-500 px-4 py-2 rounded flex items-center hover:bg-blue-50 transition-colors"
          >
            <Info className="mr-2" size={20} /> Details
          </button>
        </div>
      </div>
    </div>
  );
};

const EquipmentRentalPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredEquipment, setFilteredEquipment] = useState(equipmentData);

  // Unique categories extraction
  const categories = ['All', ...new Set(equipmentData.map(item => item.category))];

  // Filtering logic
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredEquipment(equipmentData);
    } else {
      const filtered = equipmentData.filter(item => item.category === selectedCategory);
      setFilteredEquipment(filtered);
    }
  }, [selectedCategory]);

  const handleReserve = (equipment, duration, quantity) => {
    // Implement reservation logic
    alert(`Reserving ${quantity} ${equipment.name} for ${duration}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Equipment Rental</h1>

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm transition-colors 
              ${selectedCategory === category 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Equipment Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map(equipment => (
          <EquipmentRentalCard 
            key={equipment.id}
            equipment={equipment}
            onReserve={handleReserve}
          />
        ))}
      </div>
    </div>
  );
};

export default EquipmentRentalPage;