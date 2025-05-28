<template>
  <div class="catalogue-view">
    <!-- Breadcrumb Component with same design classes -->
    <Breadcrumb :breadcrumbs="breadcrumbs" class="breadcrumb-spacing" />

    <h1>{{ pageTitle }}</h1>

    <!-- Product Listing -->
    <div class="products-container">
      <div
        v-for="product in products"
        :key="product.uniqueKey"
        class="product-card-wrapper"
      >
        <!-- Wrap ProductCard in <router-link> to /product/:id -->
        <router-link
          :to="`/product/${product.id}`"
          style="text-decoration: none; color: inherit"
        >
          <!-- Corrected ProductCard component tag -->
          <ProductCard
            :productId="product.id"
            :title="getTranslatedProductName(product)"
            :price="product.price"
            :image-src="product.image"
            :brand="product.brand"
          />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import ProductCard from "@/components/ProductCard.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { useCartStore } from "@/stores/cart";
import { useProductsStore } from "@/stores/products";

export default {
  name: "SolarPanels",
  components: {
    ProductCard,import React, { useMemo } from 'react';

// Mock components - replace with your actual components
const ProductCard = ({ productId, title, price, imageSrc, brand, onClick }) => (
  <div 
    onClick={onClick}
    style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: 'white',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }
    }}
  >
    <img 
      src={imageSrc || '/placeholder-product.jpg'} 
      alt={title}
      style={{
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '4px',
        marginBottom: '12px'
      }}
    />
    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
      {title}
    </h3>
    <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
      {brand}
    </p>
    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0066cc' }}>
      ${price}
    </p>
  </div>
);

const Breadcrumb = ({ breadcrumbs, className }) => (
  <nav className={className}>
    <ol style={{ 
      display: 'flex', 
      listStyle: 'none', 
      padding: 0, 
      margin: 0,
      fontSize: '14px',
      color: '#666'
    }}>
      {breadcrumbs.map((crumb, index) => (
        <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
          {crumb.link ? (
            <a 
              href={crumb.link}
              style={{ 
                color: '#0066cc', 
                textDecoration: 'none',
                ':hover': { textDecoration: 'underline' }
              }}
              onClick={(e) => {
                e.preventDefault();
                // Replace with your actual navigation logic
                console.log('Navigate to:', crumb.link);
              }}
            >
              {crumb.name}
            </a>
          ) : (
            <span style={{ color: '#333' }}>{crumb.name}</span>
          )}
          {index < breadcrumbs.length - 1 && (
            <span style={{ margin: '0 8px', color: '#999' }}>/</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

// Mock translation function - replace with your actual i18n solution
const t = (key) => {
  const translations = {
    'product.inverter.solar': 'Solar Inverter',
    'product.inverter.grid': 'Grid Tie Inverter',
    'product.inverter.hybrid': 'Hybrid Inverter'
  };
  return translations[key] || key;
};

// Mock stores - replace with your actual state management
const useProductsStore = () => ({
  getProducts: [
    {
      id: 1,
      categoryId: 3,
      nameKey: 'product.inverter.solar',
      defaultName: '5kW MPPT',
      price: 1299.99,
      image: '/api/placeholder/300/200',
      brand: 'SolarMax'
    },
    {
      id: 2,
      categoryId: 3,
      nameKey: 'product.inverter.grid',
      defaultName: '10kW Grid Tie',
      price: 2199.99,
      image: '/api/placeholder/300/200',
      brand: 'PowerTech'
    },
    {
      id: 3,
      categoryId: 3,
      nameKey: 'product.inverter.hybrid',
      defaultName: '8kW Hybrid',
      price: 1899.99,
      image: '/api/placeholder/300/200',
      brand: 'EcoSolar'
    }
  ]
});

const useCartStore = () => ({
  // Mock cart store methods
  addToCart: (product) => console.log('Added to cart:', product)
});

const SolarPanels = () => {
  const categoryId = 3;
  const store = useProductsStore();
  const cartStore = useCartStore();

  // Filter products by category and add uniqueKey
  const products = useMemo(() => {
    return store.getProducts
      .filter(product => +product.categoryId === categoryId)
      .map(product => ({
        ...product,
        uniqueKey: product.id
      }));
  }, [store.getProducts, categoryId]);

  // Get translated product name based on current locale
  const getTranslatedProductName = (product) => {
    return t(product.nameKey) + " " + product.defaultName;
  };

  // Define breadcrumbs
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Каталог", link: "/catalogue" },
    { name: "Інвертори" },
  ];

  const pageTitle = "Інвертори";

  const handleProductClick = (productId) => {
    // Replace with your actual navigation logic
    console.log('Navigate to product:', productId);
    // For React Router: navigate(`/product/${productId}`);
  };

  return (
    <div className="catalogue-view">
      {/* Breadcrumb Component with same design classes */}
      <Breadcrumb breadcrumbs={breadcrumbs} className="breadcrumb-spacing" />

      <h1>{pageTitle}</h1>

      {/* Product Listing */}
      <div className="products-container">
        {products.map((product) => (
          <div
            key={product.uniqueKey}
            className="product-card-wrapper"
          >
            {/* Wrap ProductCard to navigate to /product/:id */}
            <ProductCard
              productId={product.id}
              title={getTranslatedProductName(product)}
              price={product.price}
              imageSrc={product.image}
              brand={product.brand}
              onClick={() => handleProductClick(product.id)}
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        .catalogue-view {
          padding-top: 120px; /* Header height + 10px buffer */
          margin-top: 0 !important;
        }

        .products-container {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 15px;
          padding: 20px;
          background-color: #f9fafb;
        }

        /* Same class used in Breadcrumb.vue for consistent spacing */
        .breadcrumb-spacing {
          margin-bottom: 1rem;
          padding: 0 20px;
          /* margin-top: 1rem; /* If you want additional top spacing above the breadcrumb */
        }

        .product-card-wrapper {
          transition: transform 0.2s ease;
        }

        .product-card-wrapper:hover {
          transform: translateY(-2px);
        }

        h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #333;
          margin: 0 0 20px 0;
          padding: 0 20px;
        }

        /* Responsive styles */
        @media (max-width: 1600px) {
          .products-container {
            grid-template-columns: repeat(5, 1fr); /* Five columns */
          }
        }

        @media (max-width: 1200px) {
          .products-container {
            grid-template-columns: repeat(3, 1fr); /* Three columns */
          }
        }

        @media (max-width: 992px) {
          .products-container {
            grid-template-columns: repeat(2, 1fr); /* Two columns */
          }
        }

        @media (max-width: 600px) {
          .products-container {
            grid-template-columns: 1fr; /* One column */
          }
        }
      `}</style>
    </div>
  );
};

export default SolarPanels;
    Breadcrumb,
  },
  setup() {
    const { t, locale } = useI18n();

    const cartStore = useCartStore();
    const route = useRoute();
    const categoryId = 3;
    const store = useProductsStore();

    const products = computed(() => {
      return store.getProducts.filter(
        (product) => +product.categoryId === categoryId
      );
    });

    // Add uniqueKey to each product
    products.value.forEach((product) => {
      product.uniqueKey = product.id;
    });
    // Get translated product name based on current locale
    const getTranslatedProductName = (product) => {
      return t(product.nameKey) + " " + product.defaultName;
    };
    // Define breadcrumbs
    const breadcrumbs = ref([
      { name: "Home", link: "/" },
      { name: "Каталог", link: "/catalogue" },
      { name: "Інвертори" },
    ]);

    const pageTitle = "Інвертори";

    return {
      products,
      pageTitle,
      getTranslatedProductName,
      breadcrumbs,
    };
  },
};
</script>

<style scoped>
.catalogue-view {
  padding-top: 120px; /* Header height + 10px buffer */
  margin-top: 0 !important;
}

.products-container {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 15px;
  padding: 20px;
  background-color: #f9fafb;
}

/* Same class used in Breadcrumb.vue for consistent spacing */
.breadcrumb-spacing {
  margin-bottom: 1rem;
  /* margin-top: 1rem; /* If you want additional top spacing above the breadcrumb */
}

/* Your existing styles */
.products-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* Five columns */
  gap: 15px;
  padding: 20px;
  background-color: #f9fafb;
}

/* Responsive styles */
@media (max-width: 1600px) {
  .products-container {
    grid-template-columns: repeat(5, 1fr); /* Four columns */
  }
}

@media (max-width: 1200px) {
  .products-container {
    grid-template-columns: repeat(3, 1fr); /* Three columns */
  }
}

@media (max-width: 992px) {
  .products-container {
    grid-template-columns: repeat(2, 1fr); /* Two columns */
  }
}

@media (max-width: 600px) {
  .products-container {
    grid-template-columns: 1fr; /* One column */
  }
}
</style>
