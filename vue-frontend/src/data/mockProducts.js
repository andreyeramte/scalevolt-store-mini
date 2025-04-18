// src/data/mockProducts.js

const mockProducts = [
    {
      id: 1,
      title: 'Portronics 1.5M Cord Length HDMI Cable(Black)',
      price: 199,
      originalPrice: 499,
      quantity: '1 piece',
      brand: 'Portronics',
      model: 'HDMI-1.5M',
      type: 'Cables, Chargers & Powerbanks',
      images: [
        '/images/1.jpg',
        '/images/2.jpg',
        '/images/3.jpg',
        '/images/4.jpg',
        '/images/5.jpg'
      ],
      offers: [
        { 
          id: 1, 
          bank: 'CRED', 
          detail: 'Get assured rewards',
          icon: '/images/cred-icon.png'
        },
        { 
          id: 2, 
          bank: 'BHIM UPI', 
          detail: 'Get flat ₹25 discount'
        },
        { 
          id: 3, 
          bank: 'Amazon Pay', 
          detail: 'Get up to ₹25 cashback'
        }
      ], 
      installationAvailable: true
    },
    {
      id: 2,
      title: 'Сонячна Панель Longi-420-Black',
      price: 1200,
      originalPrice: 1500,
      quantity: '1 piece',
      brand: 'Longi',
      model: 'Longi-420-Black',
      type: 'Сонячні Панелі',
      images: [
        '/images/Categories/solar.panels/Longi-420-Black.png'
      ],
      offers: [],
      installationAvailable: true
    },
    {
      id: 3,
      title: 'Сонячна Панель Longi-425-Black',
      price: 1000,
      originalPrice: 1300,
      quantity: '1 piece',
      brand: 'Longi',
      model: 'Longi-425-Black',
      type: 'Сонячні Панелі',
      images: [
        '/images/Categories/solar.panels/Longi-425-Black.png'
      ],
      offers: [],
      installationAvailable: true
    },
    {
      id: 4,
      title: 'Сонячна Панель Longi-530-Black',
      price: 1200,
      originalPrice: 1500,
      quantity: '1 piece',
      brand: 'Longi',
      model: 'Longi-530-Black',
      type: 'Сонячні Панелі',
      images: [
        '/images/Categories/solar.panels/Longi-530-Black.png'
      ],
      offers: [], 
      installationAvailable: true
    },
    {
      id: 5,
      title: 'Сонячна Панель Longi-630-Bifacial',
      price: 1000,
      originalPrice: 1300,
      quantity: '1 piece',
      brand: 'Longi',
      model: 'Longi-630-Bifacial',
      type: 'Сонячні Панелі',
      images: [
        '/images/Categories/solar.panels/Longi-630-Bifacial.png'
      ],
      offers: [],
      installationAvailable: true
    },
    {
      id: 6,
      title: 'Сонячна Панель Longi-430',
      price: 1200,
      originalPrice: 1500,
      quantity: '1 piece',
      brand: 'Longi',
      model: 'Longi-430',
      type: 'Сонячні Панелі',
      images: [
        '/images/Categories/solar.panels/Longi-430.png'
      ],
      offers: [],
      installationAvailable: true
    },
    {
      id: 7,
      title: 'Сонячна Панель Longi-580',
      price: 1000,
      originalPrice: 1300,
      quantity: '1 piece',
      brand: 'Longi',
      model: 'Longi-580',
      type: 'Сонячні Панелі',
      images: [
        '/images/Categories/solar.panels/Longi-580.png'
      ],
      offers: [],
      installationAvailable: true
    },
    {
      id: 8,
      title: 'Сонячна Панель Longi-585',
      price: 1200,
      originalPrice: 1500,
      quantity: '1 piece',
      brand: 'Longi',
      model: 'Longi-585',
      type: 'Сонячні Панелі',
      images: [
        '/images/Categories/solar.panels/Longi-585.png'
      ],
      offers: [],
      installationAvailable: true
    },
    {
      id: 9,
      title: 'Сонячна Панель Longi-440',
      price: 1000,
      originalPrice: 1300,
      quantity: '1 piece',
      brand: 'Longi',
      model: 'Longi-440',
      type: 'Сонячні Панелі',
      images: [
        '/images/Categories/solar.panels/Longi-440.png'
      ],
      offers: [],
      installationAvailable: true
    },
    {
      id: 10,
      title: 'Сонячна Панель Longi-455',
      price: 1200,
      originalPrice: 1500,
      quantity: '1 piece',
      brand: 'Longi',
      model: 'Longi-455',
      type: 'Сонячні Панелі',
      images: [
        '/images/Categories/solar.panels/Longi-455.png'
      ],
      offers: [],
      installationAvailable: true
    }, 
    {
      id: 11,
      name: 'АКБ Deye RW-M6.1-B-1',
      price: 1000,
      image: '/images/Categories/batteries/АКБ.Deye.RW-M6.1-B-1.jpg',
      brand: 'Deye',
      categoryId: 2,
      type: 'Батареї'
    },
    {
      id: 12,
      name: 'RW-M5.3-Pro_1',
      price: 1200,
      image: '/images/Categories/batteries/RW-M5.3-Pro_1-2.jpg',
      brand: 'Deye',
      categoryId: 2,
      type: 'Батареї'
    },
    {
      id: 13,
      name: 'Deye-RW-F10.6-51.2V-208AH-10.64KWH-1',
      price: 1000,
      image: '/images/Categories/batteries/Deye-RW-F10.6-51.2V-208AH-10.64KWH-1.jpg',
      brand: 'Deyes',
      categoryId: 2,
      type: 'Батареї'
    },
    {
      id: 14,
      name: 'АКБ-Pylontech-US5000',
      price: 1200,
      image: '/images/Categories/batteries/АКБ-Pylontech-US5000-1.jpg',
      brand: 'Pylontech',
      categoryId: 2,
      type: 'Батареї'
    },
    {
      id: 30,
      title: 'Deye Hybrid 5kw 1ph',
      price: 1000,
      originalPrice: 1300,
      quantity: '1 piece',
      brand: 'Deye',
      model: 'Hybrid 5kw 1ph 48V',
      type: 'Інвертори',
      images: [
        '/images/deye-hybrid-5kw-1ph-48V.png'
      ],
      offers: []
    },
    {
      id: 31,
      title: 'Deye Hybrid 6kw 1ph',
      price: 1200,
      originalPrice: 1500,
      quantity: '1 piece',
      brand: 'Deye',
      model: 'Hybrid 6kw 1ph 48V',
      type: 'Інвертори',
      images: [
        '/images/deye-hybrid-6kw-1ph-48V.png'
      ],
      offers: []
    },
    {
      id: 60,
      title: 'DC Fast Charging Station 50kW',
      price: 12000,
      originalPrice: 15000,
      quantity: '1 unit',
      brand: 'ChargePoint',
      model: 'DC-50',
      type: 'Швидкі Зарядні Станції (DC)',
      images: [
        '/images/HomeView/ev-charger-city.png'
      ],
      offers: [],
      installationAvailable: true
    },
    {
      id: 61,
      title: 'Commercial DC Charger 100kW',
      price: 18000,
      originalPrice: 22000,
      quantity: '1 unit',
      brand: 'ABB',
      model: 'Terra HP',
      type: 'Швидкі Зарядні Станції (DC)',
      images: [
        '/images/HomeView/ev-charger-city.png'
      ],
      offers: [],
      installationAvailable: true
    },
    {
      id: 62,
      title: 'Level 2 AC Charging Station 7kW',
      price: 1200,
      originalPrice: 1500,
      quantity: '1 unit',
      brand: 'JuiceBox',
      model: 'Pro 40',
      type: 'Зарядні Станції Рівня 2 (AC)',
      images: [
        '/images/HomeView/otcta-стійка-02.png'
      ],
      offers: [],
      installationAvailable: true
    },
    {
      id: 63,
      title: 'Smart Home AC Charger 11kW',
      price: 1400,
      originalPrice: 1800,
      quantity: '1 unit',
      brand: 'Wallbox',
      model: 'Pulsar Plus',
      type: 'Зарядні Станції Рівня 2 (AC)',
      images: [
        '/images/HomeView/otcta-стійка-02.png'
      ],
      offers: [],
      installationAvailable: true
    },
    {
      id: 64,
      title: 'Portable EV Charger 3.6kW',
      price: 500,
      originalPrice: 700,
      quantity: '1 unit',
      brand: 'Zencar',
      model: 'Z-3.6',
      type: 'Портативні/Мобільні Зарядні Пристрої',
      images: [
        '/images/HomeView/ev-charger-city.png'
      ],
      offers: [],
      installationAvailable: false
    },
    {
      id: 65,
      title: 'Travel EV Charging Kit 7.2kW',
      price: 650,
      originalPrice: 900,
      quantity: '1 kit',
      brand: 'TravelCharge',
      model: 'TC-7200',
      type: 'Портативні/Мобільні Зарядні Пристрої',
      images: [
        '/images/HomeView/ev-charger-city.png'
      ],
      offers: [],
      installationAvailable: false
    },
    {
      id: 66,
      name: 'Генератор 10 кВт',
      type: 'Генератори',
      price: 1000,
      image: '/images/generators/generator-10kw.png',
      brand: 'PowerMax',
      rentalPrices: {
        day: 150,
        week: 300,
        month: 600
      }
    },
    {
      id: 67,
      name: 'Промисловий Генератор 50 кВт',
      type: 'Промислові генератори для важких навантажень (100 кВт+)',
      price: 2000,
      image: '/images/generators/industrial-50kw.png',
      brand: 'IndustrialPower',
      rentalPrices: {
        day: 300,
        week: 600,
        month: 1200
      }
    },
];

export default mockProducts;