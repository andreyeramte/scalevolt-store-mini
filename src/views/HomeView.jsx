import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProductGrid from '../components/ProductGrid'
import Swiper from '../components/Swiper'
import AdBox from '../components/AdBox'
import CategoryPromotionBox from '../components/CategoryPromotionBox'
import supabaseService from '../services/supabaseService'

function HomeView() {
  const { t } = useTranslation()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Category data from your previous Vue design
  const solarSystemItems = [
    { id: 1, name: "Сонячні Панелі", slug: "solar-panels", image: "/images/HomeView/solar-farm.png" },
    { id: 2, name: "Батареї", slug: "batteries", image: "/images/HomeView/solar-battery.png" },
    { id: 3, name: "Інвертори", slug: "inverters", image: "/images/HomeView/інвертер.png" },
    { id: 4, name: "Комплекти сонячних електростанцій", slug: "Sets-of-solar-power-plants", image: "/images/HomeView/комплект-сонячних.png" },
    { id: 6, name: "Система монтажу сонячних панелей", slug: "mounting-systems", image: "/images/HomeView/solar-mount-system.png" }
  ]

  const evChargerItems = [
    { id: 1, name: "Зарядні пристрої для електромобілів", slug: "ev-chargers", image: "/images/HomeView/otcta-стійка-02.png" },
    { id: 2, name: "Кабелі та адаптери", slug: "cables-adapters", image: "/images/HomeView/electric-charging-adapters.png" },
    { id: 3, name: "Зарядні станції", slug: "charging-stations", image: "/images/HomeView/ev-charger-city.png" }
  ]

  const portableItems = [
    { id: 1, name: "Портативна електростанція", slug: "portable-power-stations", image: "/images/HomeView/solar-panel.png" },
    { id: 2, name: "Cонячні генератори", slug: "charging", image: "/images/HomeView/Charging-station-ND-EVC-UR40.jpg" },
    { id: 3, name: "Портативні сонячні панелі", slug: "portable-solar-panels", image: "/images/Categories/portable.solar.panels/Портативні-Сонячні-панелі-Jackery-SolarSaga-100W.png" },
    { id: 4, name: "Кабелі електричні та дроти", slug: "cables-wires", image: "/images/HomeView/Electrical-cables-and-wires.jpg" }
  ]

  const categories = [
    { id: 1, name: "Генератори", slug: "automatics", image: "/images/HomeView/генератори.png" },
    { id: 2, name: "Промислові генератори для важких навантажень (100 кВт+)", slug: "cable", image: "/images/HomeView/Промислові-генератори-для-важких-навантажень.png" },
    { id: 3, name: "Освітлювальні-вежі-на-сонячних-батареях", slug: "cable", image: "/images/HomeView/Освітлювальні-вежі-на-сонячних-батареях.png" }
  ]

  const carouselSlides = [
    {
      type: "gif",
      src: "/videos/carousel/Self-Sustaining-Smart-Home.gif",
      title: "Сонячні Панелі",
      description: "Живіть своє життя вільно з нашими сонячними панелями"
    },
    {
      type: "gif", 
      src: "/videos/carousel/ev.chargers.gif",
      title: "Зарядні Станції",
      description: "Швидка зарядка для вашого електромобіля"
    },
    {
      type: "gif",
      src: "/videos/carousel/portable.panels.gif", 
      title: "Портативні Панелі",
      description: "Сонячна енергія скрізь, де ви її потребуєте"
    }
  ]

  const mockAd = {
    attributes: {
      title: "Сонячна ферма",
      description: "Створіть свою власну сонячну ферму",
      contentUrl: { data: { attributes: { url: "/HomeView/adBox/сонячна-ферма.JPG" } } },
      link: "https://example.com"
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Fetch only the 3 mini products from Supabase
      const data = await supabaseService.getMiniProducts()
      setProducts(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryRoute = (slug) => {
    return `/${slug.toLowerCase().replace(/ /g, "-")}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600">Loading ScaleVolt Store...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <div className="text-2xl font-semibold mb-2">Error loading products</div>
          <div className="text-lg">{error}</div>
          <button 
            onClick={fetchProducts}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Carousel */}
      <section className="relative">
        <Swiper slides={carouselSlides} />
      </section>

      {/* Ad Box Section */}
      <section className="py-6 md:py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <AdBox ad={mockAd} />
        </div>
      </section>

      {/* Solar System Categories */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.solarSystems')}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              {t('home.solarSystemsDesc')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {solarSystemItems.map((item) => (
              <CategoryPromotionBox 
                key={item.id}
                category={item}
                onCategoryClick={() => window.location.href = getCategoryRoute(item.slug)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* EV Charger Categories */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.evChargers')}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              {t('home.evChargersDesc')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {evChargerItems.map((item) => (
              <CategoryPromotionBox 
                key={item.id}
                category={item}
                onCategoryClick={() => window.location.href = getCategoryRoute(item.slug)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Portable Solutions */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.portableSolutions')}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              {t('home.portableSolutionsDesc')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {portableItems.map((item) => (
              <CategoryPromotionBox 
                key={item.id}
                category={item}
                onCategoryClick={() => window.location.href = getCategoryRoute(item.slug)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Other Categories */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.additionalCategories')}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              {t('home.additionalCategoriesDesc')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {categories.map((item) => (
              <CategoryPromotionBox 
                key={item.id}
                category={item}
                onCategoryClick={() => window.location.href = getCategoryRoute(item.slug)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {t('home.featuredProducts')}
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              {t('home.featuredProductsDesc')}
            </p>
          </div>
          
          <ProductGrid products={products.slice(0, 4)} />
          
          <div className="text-center mt-8">
            <Link 
              to="/products" 
              className="inline-block px-6 md:px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              {t('home.viewAllProducts')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomeView
