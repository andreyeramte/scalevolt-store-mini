<template>
  <div class="product-page-container">
    <!-- Breadcrumb Navigation -->
    <nav class="breadcrumb">
    <router-link to="/">{{ $t("common.home") }}</router-link>
    <span class="breadcrumb-separator">&gt;</span>
    <router-link :to="getTypeRoute(product?.type)">
      {{ product?.type || $t("common.categories") }}
    </router-link>
    <span class="breadcrumb-separator">&gt;</span>
    <span class="current-page">{{
      product?.title || $t("product.section_title")
    }}</span>
  </nav>

    <div v-if="product" class="product-content">
      <div class="product-gallery">
        <!-- Thumbnail Gallery -->
        <div class="thumbnail-list">
          <div
            v-for="(img, index) in productImages"
            :key="index"
            class="thumbnail"
            :class="{ active: selectedImage === img }"
            @click="selectedImage = img"
          >
            <img :src="img" :alt="`Product Thumbnail ${index + 1}`" />
          </div>
        </div>

        <!-- Main Product Image -->
        <div class="main-image-container">
          <img
            :src="
              selectedImage || productImages[0] || '/images/placeholder.png'
            "
            :alt="product.title || product.name"
            class="main-image"
          />
        </div>
      </div>

      <!-- Product Details -->
      <div class="product-details">
        <h1 class="product-title">{{ $t(product.nameKey) }}</h1>

        <!-- Rating and Reviews -->
        <div class="product-rating">
          <div class="rating-stars">
            <span class="star">★</span>
            <span class="rating-value">4.7</span>
          </div>
          <span class="review-count">(157 Reviews)</span>
        </div>

        <!-- Pricing -->
        <div class="pricing-section">
          <div class="current-price">
            <span class="price">₹{{ formatPrice(product.price) }}</span>
            <span class="discount-tag">60% Off</span>
          </div>
          <div class="original-price">
            <span>MRP ₹{{ formatPrice(product.price) }}</span>
            <span class="tax-info">(incl. of all taxes)</span>
          </div>
        </div>

        <!-- Delivery Info -->
        <div class="delivery-info">
          <span class="delivery-icon">⚡</span>
          <span>Get it in 13 minutes</span>
        </div>
      </div>
    </div>

    <div>
      <a href="#" class="view-all-offers">{{ $t("delivery.seeAll") }}</a>

      <!-- Quantity and Cart Control -->
      <div class="cart-control">
        <div class="quantity-selector">
          <button
            class="quantity-btn"
            @click="decrementQuantity"
            :disabled="quantity <= 1"
          >
            -
          </button>
          <span class="quantity-value">{{ quantity }}</span>
          <button class="quantity-btn" @click="incrementQuantity">+</button>
        </div>
        <button class="add-to-cart-btn" @click="addToCart">
          {{ $t("product.addToCart") }}
        </button>
      </div>

      <!-- Extra Product Details -->
      <div class="extra-details">
        <div class="detail-icon">
          <img
            src="/images/ProductPage/return-icon.png"
            alt="7 Days Exchange"
          />
          <span>7 Days Exchange</span>
        </div>
        <div class="detail-icon">
          <img
            src="/images/ProductPage/delivery-icon.png"
            alt="Fast Delivery"
          />
          <span>Fast Delivery</span>
        </div>
      </div>
    </div>

    <!-- Product Highlights -->
    <div v-if="product" class="product-highlights">
      <h2>{{ $t("product.section_title") }}</h2>
      <table class="highlights-table">
        <tr>
          <th>{{ $t("product.quantity") }}</th>
          <td>{{ product.quantity }}</td>
        </tr>
        <tr>
          <th>Brand</th>
          <td>{{ product.brand }}</td>
        </tr>
        <tr>
          <th>Model</th>
          <td>{{ product.model }}</td>
        </tr>
      </table>
    </div>

    <div
      v-if="
        product &&
        (product.type === 'Сонячні Панелі' ||
          product.type === 'Швидкі Зарядні Станції (DC)')
      "
    >
      <ProductQuoteForm
        :productType="product.type === 'Сонячні Панелі' ? 'solar' : 'charger'"
        :productId="product.id"
        :productName="product.title || product.name"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, onUpdated, watch } from "vue";
import { useRoute } from "vue-router";
import { useCartStore } from "@/stores/cart";
import ProductQuoteForm from "@/components/ProductQuoteForm.vue";
import { useProductsStore } from "@/stores/products";

// Define mockProducts array outside of setup
const mockProducts = [
  {
    id: 1,
    title: "Portronics 1.5M Cord Length HDMI Cable(Black)",
    price: 199,
    originalPrice: 499,
    quantity: "1 piece",
    brand: "Portronics",
    model: "HDMI-1.5M",
    type: "Cables, Chargers & Powerbanks",
    images: [
      "/images/1.jpg",
      "/images/2.jpg",
      "/images/3.jpg",
      "/images/4.jpg",
      "/images/5.jpg",
    ],
    offers: [
      {
        id: 1,
        bank: "CRED",
        detail: "Get assured rewards",
        icon: "/images/cred-icon.png",
      },
      {
        id: 2,
        bank: "BHIM UPI",
        detail: "Get flat ₹25 discount",
      },
      {
        id: 3,
        bank: "Amazon Pay",
        detail: "Get up to ₹25 cashback",
      },
    ],
    installationAvailable: true, // Add this flag
  },
  {
    id: 2,
    title: "Сонячна Панель Longi-420-Black",
    price: 1200,
    originalPrice: 1500,
    quantity: "1 piece",
    brand: "Longi",
    model: "Longi-420-Black",
    type: "Сонячні Панелі",
    images: ["/images/Categories/solar.panels/Longi-420-Black.png"],
    offers: [],
    installationAvailable: true, // Add this flag
  },
  {
    id: 3,
    title: "Сонячна Панель Longi-425-Black",
    price: 1000,
    originalPrice: 1300,
    quantity: "1 piece",
    brand: "Longi",
    model: "Longi-425-Black",
    type: "Сонячні Панелі",
    images: ["/images/Categories/solar.panels/Longi-425-Black.png"],
    offers: [],
    installationAvailable: true, // Add this flag
  },
  {
    id: 4,
    title: "Сонячна Панель Longi-530-Black",
    price: 1200,
    originalPrice: 1500,
    quantity: "1 piece",
    brand: "Longi",
    model: "Longi-530-Black",
    type: "Сонячні Панелі",
    images: ["/images/Categories/solar.panels/Longi-530-Black.png"],
    offers: [],
    installationAvailable: true, // Add this flag
  },
  {
    id: 5,
    title: "Сонячна Панель Longi-630-Bifacial",
    price: 1000,
    originalPrice: 1300,
    quantity: "1 piece",
    brand: "Longi",
    model: "Longi-630-Bifacial",
    type: "Сонячні Панелі",
    images: ["/images/Categories/solar.panels/Longi-630-Bifacial.png"],
    offers: [],
    installationAvailable: true, // Add this flag
  },
  {
    id: 6,
    title: "Сонячна Панель Longi-430",
    price: 1200,
    originalPrice: 1500,
    quantity: "1 piece",
    brand: "Longi",
    model: "Longi-430",
    type: "Сонячні Панелі",
    images: ["/images/Categories/solar.panels/Longi-430.png"],
    offers: [],
    installationAvailable: true, // Add this flag
  },
  {
    id: 7,
    title: "Сонячна Панель Longi-580",
    price: 1000,
    originalPrice: 1300,
    quantity: "1 piece",
    brand: "Longi",
    model: "Longi-580",
    type: "Сонячні Панелі",
    images: ["/images/Categories/solar.panels/Longi-580.png"],
    offers: [],
    installationAvailable: true, // Add this flag
  },
  {
    id: 8,
    title: "Сонячна Панель Longi-585",
    price: 1200,
    originalPrice: 1500,
    quantity: "1 piece",
    brand: "Longi",
    model: "Longi-585",
    type: "Сонячні Панелі",
    images: ["/images/Categories/solar.panels/Longi-585.png"],
    offers: [],
    installationAvailable: true, // Add this flag
  },
  {
    id: 9,
    title: "Сонячна Панель Longi-440",
    price: 1000,
    originalPrice: 1300,
    quantity: "1 piece",
    brand: "Longi",
    model: "Longi-440",
    type: "Сонячні Панелі",
    images: ["/images/Categories/solar.panels/Longi-440.png"],
    offers: [],
    installationAvailable: true, // Add this flag
  },
  {
    id: 10,
    title: "Сонячна Панель Longi-455",
    price: 1200,
    originalPrice: 1500,
    quantity: "1 piece",
    brand: "Longi",
    model: "Longi-455",
    type: "Сонячні Панелі",
    images: ["/images/Categories/solar.panels/Longi-455.png"],
    offers: [],
    installationAvailable: true, // Add this flag
  },
  {
    id: 11,
    name: "АКБ Deye RW-M6.1-B-1",
    price: 1000,
    image: "/images/Categories/batteries/АКБ.Deye.RW-M6.1-B-1.jpg",
    brand: "Deye",
    categoryId: 2,
  },
  {
    id: 12,
    name: "RW-M5.3-Pro_1",
    price: 1200,
    image: "/images/Categories/batteries/RW-M5.3-Pro_1-2.jpg",
    brand: "Deye",
    categoryId: 2,
  },
  {
    id: 13,
    name: "Deye-RW-F10.6-51.2V-208AH-10.64KWH-1",
    price: 1000,
    image:
      "/images/Categories/batteries/Deye-RW-F10.6-51.2V-208AH-10.64KWH-1.jpg",
    brand: "Deyes",
    categoryId: 2,
  },
  {
    id: 14,
    name: "АКБ-Pylontech-US5000",
    price: 1200,
    image: "/images/Categories/batteries/АКБ-Pylontech-US5000-1.jpg",
    brand: "Pylontech",
    categoryId: 2,
  },
  {
    id: 15,
    name: "Сонячна Панель JA Solar 560kW",
    price: 1000,
    image: "/images/5.jpg",
    brand: "JA Solar",
    categoryId: 2,
  },
  {
    id: 16,
    name: "Сонячна Панель Jinko Tiger 560kW",
    price: 1200,
    image: "/images/6.jpg",
    brand: "Jinko Tiger",
    categoryId: 2,
  },
  {
    id: 17,
    name: "Сонячна Панель JA Solar 560kW",
    price: 1000,
    image: "/images/7.jpg",
    brand: "JA Solar",
    categoryId: 2,
  },
  {
    id: 18,
    name: "Сонячна Панель Jinko Tiger 560kW",
    price: 1200,
    image: "/images/8.jpg",
    brand: "Jinko Tiger",
    categoryId: 2,
  },
  {
    id: 19,
    name: "Сонячна Панель JA Solar 560kW",
    price: 1000,
    image: "/images/9.jpg",
    brand: "JA Solar",
    categoryId: 2,
  },
  {
    id: 20,
    name: "Сонячна Панель Jinko Tiger 560kW",
    price: 1200,
    image: "/images/Categories/batteries/АКБ.Deye.RW-M6.1-B-1.jpg",
    brand: "Jinko Tiger",
    categoryId: 2,
  },
  {
    id: 21,
    title: "PowerBank 10000mAh Ultra Slim",
    price: 599,
    originalPrice: 999,
    quantity: "1 piece",
    brand: "PowerTech",
    model: "PB-10000",
    type: "Батареї",
    image: ["/images/Categories/batteries/АКБ.Deye.RW-M6.1-B-1.jpg"],
    offers: [],
  },
  {
    id: 22,
    title: "PowerBank 20000mAh Solar Charging",
    price: 899,
    originalPrice: 1299,
    quantity: "1 piece",
    brand: "SolarCharge",
    model: "SC-20000",
    type: "Батареї",
    images: ["/images/batteries/powerbank2.jpg"],
    offers: [],
  },
  {
    id: 23,
    title: "Lithium Ion Battery Pack 48V",
    price: 2499,
    originalPrice: 3999,
    quantity: "1 piece",
    brand: "EnergyCell",
    model: "EC-48V",
    type: "Батареї",
    images: ["/images/batteries/battery-pack1.jpg"],
    offers: [],
  },
  {
    id: 24,
    title: "Home Battery Storage 5kWh",
    price: 4999,
    originalPrice: 6499,
    quantity: "1 piece",
    brand: "HomeEnergy",
    model: "HE-5000",
    type: "Батареї",
    images: ["/images/batteries/home-battery1.jpg"],
    offers: [],
  },
  {
    id: 25,
    title: "Portable Generator Battery 1000W",
    price: 1799,
    originalPrice: 2499,
    quantity: "1 piece",
    brand: "PortaPower",
    model: "PP-1000",
    type: "Батареї",
    images: ["/images/batteries/generator1.jpg"],
    offers: [],
  },
  // Add these inverter products to your mockProducts array in ProductPage.vue
  {
    id: 30,
    title: "Deye Hybrid 5kw 1ph",
    price: 1000,
    originalPrice: 1300,
    quantity: "1 piece",
    brand: "Deye",
    model: "Hybrid 5kw 1ph 48V",
    type: "Інвертори",
    images: ["/images/deye-hybrid-5kw-1ph-48V.png"],
    offers: [],
  },
  {
    id: 31,
    title: "Deye Hybrid 6kw 1ph",
    price: 1200,
    originalPrice: 1500,
    quantity: "1 piece",
    brand: "Deye",
    model: "Hybrid 6kw 1ph 48V",
    type: "Інвертори",
    images: ["/images/deye-hybrid-6kw-1ph-48V.png"],
    offers: [],
  },
  {
    id: 32,
    title: "Deye Hybrid 8kw 1ph",
    price: 1000,
    originalPrice: 1300,
    quantity: "1 piece",
    brand: "Deye",
    model: "Hybrid 8kw 1ph 48V",
    type: "Інвертори",
    images: ["/images/deye-hybrid-8kw-1ph-48V.png"],
    offers: [],
  },
  {
    id: 33,
    title: "Deye Hybrid 10kw 1ph",
    price: 1200,
    originalPrice: 1500,
    quantity: "1 piece",
    brand: "Deye",
    model: "Hybrid 10kw 1ph 48V",
    type: "Інвертори",
    images: ["/images/deye-hybrid-10kw-1ph-48V.png"],
    offers: [],
  },
  {
    id: 34,
    title: "Deye Hybrid 10kw 3ph",
    price: 1000,
    originalPrice: 1300,
    quantity: "1 piece",
    brand: "Deye",
    model: "Hybrid 10kw 3ph 48V",
    type: "Інвертори",
    images: ["/images/deye-hybrid-10kw-3ph-48V.png"],
    offers: [],
  },
  {
    id: 35,
    title: "Deye Hybrid 12kw 1ph",
    price: 1200,
    originalPrice: 1500,
    quantity: "1 piece",
    brand: "Deye",
    model: "Hybrid 12kw 1ph 48V",
    type: "Інвертори",
    images: ["/images/deye-hybrid-12kw-1ph-48V.png"],
    offers: [],
  },
  {
    id: 36,
    title: "Deye Hybrid 12kw 3ph",
    price: 1000,
    originalPrice: 1300,
    quantity: "1 piece",
    brand: "Deye",
    model: "Hybrid 12kw 3ph 48V",
    type: "Інвертори",
    images: ["/images/deye-hybrid-12kw-3ph-48V.png"],
    offers: [],
  },
  {
    id: 37,
    title: "Deye Hybrid 15kw 3ph",
    price: 1200,
    originalPrice: 1500,
    quantity: "1 piece",
    brand: "Deye",
    model: "Hybrid 15kw 3ph 48V",
    type: "Інвертори",
    images: ["/images/deye-hybrid-15kw-3ph-48V.png"],
    offers: [],
  },
  {
    id: 38,
    title: "Deye Hybrid 16kw 1ph",
    price: 1000,
    originalPrice: 1300,
    quantity: "1 piece",
    brand: "Deye",
    model: "Hybrid 16kw 1ph 48V",
    type: "Інвертори",
    images: ["/images/deye-hybrid-16kw-1ph-48V.png"],
    offers: [],
  },
  {
    id: 39,
    title: "Deye Hybrid 16kw 3ph",
    price: 1200,
    originalPrice: 1500,
    quantity: "1 piece",
    brand: "Deye",
    model: "Hybrid 16kw 3ph 48V",
    type: "Інвертори",
    images: ["/images/deye-hybrid-16kw-3ph-48V.png"],
    offers: [],

    // Add these solar sets products to your mockProducts array in ProductPage.vue
  },
  {
    id: 40,
    title: "Гибридная солнечная электростанция на 30кВ з АКБ 60кВ",
    price: 1000,
    originalPrice: 1300,
    quantity: "1 комплект",
    brand: "Longi",
    model: "Hybrid 30kW Set",
    type: "SolarSets",
    images: ["/images/solar.set.hybrid.30kw.with.АКБ-60кВ.png"],
    offers: [],
  },
  {
    id: 41,
    title: "Сонячна Панель Longi-420-Black",
    price: 1200,
    originalPrice: 1500,
    quantity: "1 комплект",
    brand: "Longi",
    model: "Longi-420-Black",
    type: "SolarSets",
    images: ["/images/Longi-420-Black.png"],
    offers: [],
  },
  {
    id: 42,
    title: "Сонячна Панель Longi-425-Black",
    price: 1000,
    originalPrice: 1300,
    quantity: "1 комплект",
    brand: "Longi",
    model: "Longi-425-Black",
    type: "SolarSets",
    images: ["/images/Longi-425-Black.png"],
    offers: [],
  },
  {
    id: 43,
    title: "Сонячна Панель Longi-530-Black",
    price: 1200,
    originalPrice: 1500,
    quantity: "1 комплект",
    brand: "Longi",
    model: "Longi-530-Black",
    type: "SolarSets",
    images: ["/images/Longi-530-Black.png"],
    offers: [],
  },
  {
    id: 44,
    title: "Сонячна Панель Longi-630-Bifacial",
    price: 1000,
    originalPrice: 1300,
    quantity: "1 комплект",
    brand: "Longi",
    model: "Longi-630-Bifacial",
    type: "SolarSets",
    images: ["/images/Longi-630-Bifacial.png"],
    offers: [],
  },
  {
    id: 45,
    title: "Сонячна Панель Longi-430",
    price: 1200,
    originalPrice: 1500,
    quantity: "1 комплект",
    brand: "Longi",
    model: "Longi-430",
    type: "SolarSets",
    images: ["/images/Longi-430.png"],
    offers: [],
  },
  {
    id: 46,
    title: "Сонячна Панель Longi-580",
    price: 1000,
    originalPrice: 1300,
    quantity: "1 комплект",
    brand: "Longi",
    model: "Longi-580",
    type: "SolarSets",
    images: ["/images/Longi-580.png"],
    offers: [],
  },
  {
    id: 47,
    title: "Сонячна Панель Longi-585",
    price: 1200,
    originalPrice: 1500,
    quantity: "1 комплект",
    brand: "Longi",
    model: "Longi-585",
    type: "SolarSets",
    images: ["/images/Longi-585.png"],
    offers: [],
  },
  {
    id: 48,
    title: "Сонячна Панель Longi-440",
    price: 1000,
    originalPrice: 1300,
    quantity: "1 комплект",
    brand: "Longi-440",
    model: "Longi-440",
    type: "SolarSets",
    images: ["/images/Longi-440.png"],
    offers: [],
  },
  {
    id: 49,
    title: "Сонячна Панель Longi-455",
    price: 1200,
    originalPrice: 1500,
    quantity: "1 комплект",
    brand: "Longi",
    model: "Longi-455",
    type: "SolarSets",
    images: ["/images/Longi-455.png"],
    offers: [],
  },
  // Add these solar mount system products to your mockProducts array in ProductPage.vue
  {
    id: 50,
    title: "Система монтажу на скатну покрівлю 10кВт",
    price: 1000,
    originalPrice: 1300,
    quantity: "1 комплект",
    brand: "MountingSystems",
    model: "Roof-Mount-10kW",
    type: "Система монтажу сонячних панелей",
    images: ["/images/roof-mount-system-10kw.png"],
    offers: [],
  },
  {
    id: 51,
    title: "Система монтажу на пласку покрівлю 15кВт",
    price: 1200,
    originalPrice: 1500,
    quantity: "1 комплект",
    brand: "MountingSystems",
    model: "Flat-Roof-15kW",
    type: "Система монтажу сонячних панелей",
    images: ["/images/flat-roof-mount-15kw.png"],
    offers: [],
  },
  {
    id: 52,
    title: "Система монтажу на землю 30кВт",
    price: 1000,
    originalPrice: 1300,
    quantity: "1 комплект",
    brand: "MountingSystems",
    model: "Ground-Mount-30kW",
    type: "Система монтажу сонячних панелей",
    images: ["/images/ground-mount-system-30kw.png"],
    offers: [],
  },
  {
    id: 53,
    title: "Кріплення на металочерепицю",
    price: 1200,
    originalPrice: 1500,
    quantity: "100 шт",
    brand: "MountingSystems",
    model: "Metal-Tile-Hook",
    type: "Система монтажу сонячних панелей",
    images: ["/images/metal-tile-hooks.png"],
    offers: [],
  },
  {
    id: 54,
    title: "Кріплення на бітумну черепицю",
    price: 1000,
    originalPrice: 1300,
    quantity: "100 шт",
    brand: "MountingSystems",
    model: "Bitumen-Tile-Hook",
    type: "Система монтажу сонячних панелей",
    images: ["/images/bitumen-tile-hooks.png"],
    offers: [],
  },
  {
    id: 55,
    title: "Алюмінієвий профіль 4м",
    price: 1200,
    originalPrice: 1500,
    quantity: "10 шт",
    brand: "MountingSystems",
    model: "Aluminum-Rail-4m",
    type: "Система монтажу сонячних панелей",
    images: ["/images/aluminum-rail-4m.png"],
    offers: [],
  },
  {
    id: 60,
    title: "Швидкі Зарядні Станції (DC)",
    price: 1200,
    originalPrice: 1500,
    quantity: "100 шт",
    brand: "MountingSystems",
    model: "Metal-Tile-Hook",
    type: "Швидкі Зарядні Станції (DC)",
    images: ["/images/metal-tile-hooks.png"],
    offers: [],
    installationAvailable: true, // Add this flag
  },
  {
    id: 61,
    title: "Швидкі Зарядні Станції (DC)",
    price: 1000,
    originalPrice: 1300,
    quantity: "100 шт",
    brand: "MountingSystems",
    model: "Bitumen-Tile-Hook",
    type: "Швидкі Зарядні Станції (DC)",
    images: ["/images/bitumen-tile-hooks.png"],
    offers: [],
    installationAvailable: true, // Add this flag
  },
  {
    id: 63,
    title: "Швидкі Зарядні Станції (DC)",
    price: 1000,
    originalPrice: 1300,
    quantity: "100 шт",
    brand: "MountingSystems",
    model: "Bitumen-Tile-Hook",
    type: "Швидкі Зарядні Станції (DC)",
    images: ["/images/bitumen-tile-hooks.png"],
    offers: [],
    installationAvailable: true, // Add this flag
  },
];

export default {
  name: "ProductPage",
  components: {
    ProductQuoteForm,
  },
  setup() {
    const route = useRoute();
    const cartStore = useCartStore();

    // Product State
    const product = ref(null);
    const selectedImage = ref(null);
    const quantity = ref(1);
    const productId = computed(() => route.params.id);
    const store = useProductsStore();

    const myproduct = computed(() => {
      return store.getProducts.filter((product) => +product.id === +productId);
    });

    // Add these new reactive properties
    const addInstallation = ref(false);
    const installationDetails = ref({
      companyName: "",
      address: "",
      notes: "",
    });

    // Compute product images safely
    const productImages = computed(() => {
      if (!product.value) return [];
      if (product.value.images) return product.value.images;
      if (product.value.image) {
        return Array.isArray(product.value.image)
          ? product.value.image
          : [product.value.image];
      }
      return ["/images/placeholder.png"];
    });
    const getProduct = () => {
      try {
        const productId = route.params.id;
        // Simulate API call or use mock data
        const foundProduct = store.getProducts.filter(
          (product) => +product.id === +productId
        )[0];

        if (foundProduct) {
          product.value = foundProduct;

          // Set selected image safely
          if (foundProduct.images && foundProduct.images.length > 0) {
            selectedImage.value = foundProduct.images[0];
          } else if (foundProduct.image) {
            selectedImage.value = Array.isArray(foundProduct.image)
              ? foundProduct.image[0]
              : foundProduct.image;
          } else {
            selectedImage.value = "/images/placeholder.png";
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    onUpdated(() => {
      getProduct();
    });
    // Fetch product on component mount
    onMounted(async () => {
      await getProduct(), { deep: true };
    });
    watch(
      () => store.getProducts,
      () => {
        getProduct();
      }
    );
    // Methods
    const formatPrice = (price) => {
      return price ? price.toLocaleString("en-IN") : "N/A";
    };


    const updatePageLayout = () => {
  // Update padding based on actual header height
  const headerHeight = document.querySelector('.header-container')?.offsetHeight || 135;
  document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
  
  // Ensure breadcrumbs are visible by scrolling to start
  const breadcrumb = document.querySelector('.breadcrumb');
  if (breadcrumb) {
    breadcrumb.scrollLeft = 0;
  }
};
    const getOfferIcon = (bank) => {
      // Map bank names to icons (you'd replace with actual icon paths)
      const iconMap = {
        CRED: "/images/cred-icon.png",
        "BHIM UPI": "/images/bhim-icon.png",
        "Amazon Pay": "/images/amazon-pay-icon.png",
      };
      return iconMap[bank] || "/images/default-bank-icon.png";
    };

    const incrementQuantity = () => {
      quantity.value++;
    };

    const decrementQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--;
      }
    };

    const addToCart = () => {
      if (product.value) {
        const cartItem = {
          id: product.value.id,
          title: product.value.defaultName || product.value.name,
          price: product.value.price,
          image: productImages.value[0] || "/images/placeholder.png",
          quantity: quantity.value,
          installation: addInstallation.value
            ? installationDetails.value
            : null,
        };
        console.log(cartItem);
        console.log(product.value);
        cartStore.addToCart(cartItem);

        alert(
          `Added ${quantity.value} ${
            product.value.title || product.value.defaultName
          } to cart${addInstallation.value ? " with installation" : ""}`
        );
      }
      const updatePagePadding = () => {
    const headerHeight = document.querySelector('.header-container').offsetHeight;
    document.querySelector('.product-page-container').style.paddingTop = `${headerHeight + 20}px`;
  };
  window.addEventListener('resize', updatePagePadding);
  updatePagePadding();
    };

    // Add the getTypeRoute function here
    const getTypeRoute = (type) => {
      const typeToRoute = {
        "Сонячні Панелі": "/solar-panels",
        Батареї: "/batteries",
        "Cables, Chargers & Powerbanks": "/cables",
        Інвертори: "/inverters",
        SolarSets: "/solar-sets",
        "Система монтажу сонячних панелей": "/mounting-systems", // Changed to match your URL
        "Швидкі Зарядні Станції (DC)": "/dc-charging-stations",
        "Зарядні Станції Рівня 2 (AC)": "/ac-charging-stations",
        "Портативні/Мобільні Зарядні Пристрої": "/portable-charging-devices",
      };
      return typeToRoute[type] || "/catalogue";
    };

    return {
      product,
      myproduct,
      productId,
      selectedImage,
      quantity,
      formatPrice,
      getOfferIcon,
      incrementQuantity,
      decrementQuantity,
      addToCart,
      getTypeRoute,
      addInstallation,
      installationDetails,
      productImages,
    };
  },
};
</script>

<style>
.product-page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 130px; /* Add padding to account for the fixed header height */
}

/* If you have a breadcrumb that needs to be visible */
.breadcrumb {
  display: block;
  font-size: 14px;
  margin-bottom: 20px;
  color: #666;
  margin-top: 10px;
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  padding: 5px 0;
}

.breadcrumb::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.breadcrumb a {
  color: #666;
  text-decoration: none;
}

.breadcrumb-separator {
  margin: 0 5px;
  color: #999;
}

.current-page {
  color: #333;
  font-weight: 500;
}

/* Adjust product page container for proper mobile display */
.product-page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 15px 20px;
  padding-top: calc(var(--header-height) + 10px); /* Add padding for header */
}

/* Responsive layout for mobile */
@media (max-width: 768px) {
  .product-content {
    flex-direction: column;
  }
  
  .product-gallery,
  .product-details {
    width: 100%;
  }
  
  /* Ensure breadcrumbs are clearly visible on mobile */
  .breadcrumb {
    background-color: #f9f9f9;
    padding: 8px 10px;
    border-radius: 4px;
    margin-top: 5px;
    margin-bottom: 15px;
    font-size: 12px;
  }
  
  /* Update header height variable for mobile */
  :root {
    --header-height: 135px; /* Adjusted for mobile with all icons */
  }
}

/* Special handling for very small screens */
@media (max-width: 320px) {
  .breadcrumb {
    font-size: 11px;
  }
  
  .product-page-container {
    padding: 10px 10px 20px;
    padding-top: calc(var(--header-height) + 5px);
  }
}

.product-content {
  display: flex;
  gap: 40px;
}

.product-gallery {
  display: flex;
  gap: 20px;
  width: 50%;
}

.thumbnail-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.thumbnail {
  width: 60px;
  height: 60px;
  border: 2px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail.active {
  border-color: #f26e9a;
}

.thumbnail img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.main-image-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #e0e0e0;
  padding: 20px;
}

.main-image {
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
}

.product-details {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.rating-stars {
  display: flex;
  align-items: center;
  color: #ffc107;
}

.review-count {
  color: #666;
}

.pricing-section {
  margin-bottom: 15px;
}

.current-price {
  display: flex;
  align-items: center;
  gap: 10px;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.discount-tag {
  background-color: #4285f4;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.original-price {
  color: #666;
  text-decoration: line-through;
}

.tax-info {
  margin-left: 10px;
  font-size: 12px;
}

.delivery-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4caf50;
  margin-bottom: 15px;
}

.coupons-section {
  border: 1px solid #e0e0e0;
  padding: 15px;
  border-radius: 8px;
}

.offers-list {
  margin-bottom: 10px;
}

.offer-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.offer-icon {
  width: 30px;
  height: 30px;
}

.view-all-offers {
  color: #f26e9a;
  text-decoration: none;
  font-weight: 600;
}

.cart-control {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.quantity-value {
  padding: 0 15px;
  font-size: 16px;
}

.add-to-cart-btn {
  background-color: #4285f4;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.extra-details {
  display: flex;
  gap: 20px;
}

.detail-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.detail-icon img {
  width: 40px;
  height: 40px;
}

.product-highlights {
  margin-top: 40px;
}

.highlights-table {
  width: 100%;
  border-collapse: collapse;
}

.highlights-table th,
.highlights-table td {
  border: 1px solid #e0e0e0;
  padding: 10px;
  text-align: left;
}

.highlights-table th {
  background-color: #f9f9f9;
  width: 200px;
}

:root {
  --header-height: 150px; /* Default */
}
@media (max-width: 768px) {
  :root {
    --header-height: 100px; /* Mobile value */
  }
}
.product-page-container {
  padding-top: var(--header-height);
}

  .product-gallery,
  .product-details {
    width: 100%;
  }

  .installation-section {
    margin-top: 30px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
  }

  .installation-toggle {
    margin-bottom: 20px;
  }

  .installation-options {
    padding-top: 15px;
    border-top: 1px solid #eee;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }

  .form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .required-indicator {
    color: #f26e9a;
    font-size: 12px;
    margin-left: 5px;
  }

  .installation-provider {
    display: flex;
    align-items: center;
    margin-top: 20px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 4px;
  }

  .provider-logo {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    }
  </style>
