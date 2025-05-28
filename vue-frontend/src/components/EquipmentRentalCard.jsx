import React, { useState, useEffect } from 'react';

const EquipmentRental = () => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [selectedDurations, setSelectedDurations] = useState({});
  const [quantities, setQuantities] = useState({});
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    fetchEquipment();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, searchQuery, sortOption, equipment]);

  const fetchEquipment = async () => {
    setIsLoading(true);
    try {
      // This would be replaced with an actual API call
      // For demo, we're using the sample data
      const data = [
        {
          id: 1,
          name: 'Генератор 10 кВт',
          category: 'Генератори',
          image: '/images/Categories/equipment/generator-10kw.jpg',
          pricing: {
            day: 150,
            week: 900,
            month: 2700
          },
          specifications: [
            'Потужність: 10 кВт',
            'Паливо: Дизель',
            'Рівень шуму: 65 dB'
          ]
        },
        {
          id: 2,
          name: 'Генератор 20 кВт',
          category: 'Генератори',
          image: '/images/Categories/equipment/generator-20kw.jpg',
          pricing: {
            day: 250,
            week: 1500,
            month: 4500
          },
          specifications: [
            'Потужність: 20 кВт',
            'Паливо: Дизель',
            'Рівень шуму: 68 dB'
          ]
        },
        {
          id: 3,
          name: 'Ножичний підйомник 8м',
          category: 'Підйомники',
          image: '/images/Categories/equipment/scissor-lift-8m.jpg',
          pricing: {
            day: 180,
            week: 1080,
            month: 3240
          },
          specifications: [
            'Висота підйому: 8 метрів',
            'Вантажопідйомність: 450 кг',
            'Електричний привід'
          ]
        },
        {
          id: 4,
          name: 'Компресор повітряний',
          category: 'Компресори',
          image: '/images/Categories/equipment/air-compressor.jpg',
          pricing: {
            day: 120,
            week: 720,
            month: 2160
          },
          specifications: [
            'Продуктивність: 400 л/хв',
            'Тиск: 8 бар',
            'Мобільний'
          ]
        },
        {
          id: 5,
          name: 'Мінінавантажувач Bobcat',
          category: 'Спецтехніка',
          image: '/images/Categories/equipment/bobcat.jpg',
          pricing: {
            day: 350,
            week: 2100,
            month: 6300
          },
          specifications: [
            'Вантажопідйомність: 950 кг',
            'Кабіна закрита',
            'Дизельний двигун'
          ]
        },
        {
          id: 6,
          name: 'Відбійний молоток',
          category: 'Інструменти',
          image: '/images/Categories/equipment/jackhammer.jpg',
          pricing: {
            day: 80,
            week: 480,
            month: 1440
          },
          specifications: [
            'Потужність: 1600 Вт',
            'Енергія удару: 40 Дж',
            'Вага: 15 кг'
          ]
        }
      ];
      
      setEquipment(data);
      
      // Initialize the selected durations and quantities
      const initialDurations = {};
      const initialQuantities = {};
      data.forEach(item => {
        initialDurations[item.id] = 'day';
        initialQuantities[item.id] = 1;
      });
      setSelectedDurations(initialDurations);
      setQuantities(initialQuantities);
      
      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(data.map(item => item.category))];
      setCategories(uniqueCategories);
      
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyFilters = () => {
    if (equipment.length === 0) return;
    
    let result = [...equipment];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item => item.name.toLowerCase().includes(query) || 
              item.category.toLowerCase().includes(query) ||
              item.specifications.some(spec => spec.toLowerCase().includes(query))
      );
    }

    // Sorting
    switch (sortOption) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        result.sort((a, b) => a.pricing.day - b.pricing.day);
        break;
      case 'price-desc':
        result.sort((a, b) => b.pricing.day - a.pricing.day);
        break;
      default:
        break;
    }

    setFilteredEquipment(result);
  };
  
  const selectCategory = (category) => {
    setSelectedCategory(category);
  };
  
  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };
  
  const selectDuration = (itemId, duration) => {
    setSelectedDurations(prev => ({
      ...prev,
      [itemId]: duration
    }));
  };
  
  const incrementQuantity = (itemId) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 1) + 1
    }));
  };
  
  const decrementQuantity = (itemId) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 1) - 1, 1)
    }));
  };
  
  const calculateTotalPrice = (item) => {
    const duration = selectedDurations[item.id] || 'day';
    const quantity = quantities[item.id] || 1;
    return item.pricing[duration] * quantity;
  };
  
  const formatPrice = (price) => {
    try {
      // Use Ukrainian Hryvnia (UAH) as the currency format
      return new Intl.NumberFormat('uk-UA', { 
        style: 'currency', 
        currency: 'UAH',
        minimumFractionDigits: 0
      }).format(price);
    } catch (e) {
      // Fallback formatting if Intl is not supported
      return price + ' ₴';
    }
  };
  
  const getDurationLabel = (duration) => {
    switch(duration) {
      case 'day': return 'День';
      case 'week': return 'Тиждень';
      case 'month': return 'Місяць';
      default: return duration;
    }
  };
  
  const getDurationFormatted = (duration) => {
    switch(duration) {
      case 'day': return 'день';
      case 'week': return 'тиждень';
      case 'month': return 'місяць';
      default: return duration;
    }
  };
  
  const reserveItem = (item) => {
    const duration = selectedDurations[item.id] || 'day';
    const quantity = quantities[item.id] || 1;
    
    // Implement your reservation logic here
    alert(`Орендовано ${quantity} ${item.name} на ${getDurationFormatted(duration)}`);
  };
  
  const showDetails = (item) => {
    // Implement your details view logic here
    alert(`Детальна інформація про ${item.name}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Оренда Обладнання</h1>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <input
              type="text"
              placeholder="Пошук обладнання..."
              className="w-full md:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-3 top-2.5 h-5 w-5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
          
          <div className="relative flex-grow md:flex-grow-0">
            <select
              className="w-full md:w-auto appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="name-asc">Назва (А-Я)</option>
              <option value="name-desc">Назва (Я-А)</option>
              <option value="price-asc">Ціна (від найнижчої)</option>
              <option value="price-desc">Ціна (від найвищої)</option>
            </select>
            <span className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8 border-b pb-4 flex overflow-x-auto">
        <div className="flex items-center px-3 mr-2">
          <span className="mr-2 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </span>
          <span className="whitespace-nowrap font-medium text-gray-600">Фільтр:</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                selectedCategory === category 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => selectCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredEquipment.length === 0 ? (
        // Empty State
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800">Нічого не знайдено</h3>
          <p className="text-gray-500 mt-2">Спробуйте змінити параметри пошуку</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={clearFilters}
          >
            Очистити фільтри
          </button>
        </div>
      ) : (
        // Equipment Grid
        <div>
          <p className="text-gray-600 mb-6">Показано {filteredEquipment.length} з {equipment.length} позицій</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map(item => (
              <div 
                key={item.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full"
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
              >
                <div className="relative">
                  <img 
                    src={item.image || '/images/placeholder-equipment.jpg'} 
                    alt={item.name} 
                    className="w-full h-48 object-cover transition-transform duration-500"
                    style={{ transform: hoveredItemId === item.id ? 'scale(1.05)' : 'scale(1)' }}
                  />
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-xs font-medium rounded-bl-lg">
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3 h-3 mr-1">
                        <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                      </svg>
                      Доступно
                    </span>
                  </div>
                </div>
                
                <div className="p-4 flex-grow">
                  <div className="mb-2">
                    <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2">{item.name}</h3>

                  <div className="mb-4 text-sm text-gray-600">
                    {item.specifications.map((spec, index) => (
                      <div key={index} className="flex items-start mb-1">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                  <div className="mb-3">
                    <div className="text-sm text-gray-500 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3.5 h-3.5 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Період оренди:
                    </div>
                    <div className="flex space-x-2">
                      {Object.keys(item.pricing).map(duration => (
                        <button
                          key={duration}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            selectedDurations[item.id] === duration 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
                          }`}
                          onClick={() => selectDuration(item.id, duration)}
                        >
                          {getDurationLabel(duration)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="text-sm text-gray-500 mr-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3.5 h-3.5 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Кількість:
                    </div>
                    <div className="flex items-center border rounded-md">
                      <button 
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-l-md"
                        onClick={() => decrementQuantity(item.id)}
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{quantities[item.id] || 1}</span>
                      <button 
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-r-md"
                        onClick={() => incrementQuantity(item.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-600">
                        {formatPrice(item.pricing[selectedDurations[item.id] || 'day'])}
                        <span className="text-gray-500">/{getDurationFormatted(selectedDurations[item.id] || 'day')}</span>
                      </div>
                      <p className="text-lg font-bold text-gray-800">
                        {formatPrice(calculateTotalPrice(item))}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-blue-600 transition-colors"
                        onClick={() => reserveItem(item)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="whitespace-nowrap">Орендувати</span>
                      </button>
                      <button
                        className="border border-blue-500 text-blue-500 px-3 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-blue-50 transition-colors"
                        onClick={() => showDetails(item)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="whitespace-nowrap">Деталі</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentRental;