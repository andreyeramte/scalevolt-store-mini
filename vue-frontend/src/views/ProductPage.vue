<template>
  <div class="product-page-container flex flex-col justify-center items-center">
    <!-- Fixed Breadcrumb - Added higher z-index and better visibility -->
    <nav class="breadcrumb ml-8 w-full">
      <router-link to="/">{{ $t("common.home") }}</router-link>
      <span class="breadcrumb-separator">/</span>
      <router-link :to="getTypeRoute(myproduct?.type)">
        {{ myproduct?.type || $t("common.categories") }}
      </router-link>
      <span class="breadcrumb-separator">/</span>
      <span class="current-page">{{
        myproduct?.title || $t("product.section_title")
      }}</span>
    </nav>
    <div class="flex flex-col xl:flex-row">
      <div class="product-containew p-4">
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
        </div>
        <div class="p-4 diviwer mt-6 mb-6"></div>
        <div class="product-characteristics">
          <div v-for="(item, i) in productCharacteristics" :key="i" class="">
            <div class="product-characteristic p-[17px] flex gap-3 my-2">
              <img :src="item.src" alt="" />
              <div class="">
                <div class="characteristics-name">{{ item.name }}</div>
                <div class="characteristics-description">
                  {{ item.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Installation Button with Popup - Matches Figma design exactly -->
        <div class="button-instaletion mt-4">
          <button
            class="flex gap-2 items-center justify-center w-full h-[50px] rounded-[12px] border border-blue-500 text-blue-500"
            @click="toggleInstallationPopup"
          >
            <img src="/images/service.svg" alt="" />
            <p>{{ $t("product.orderInstallation") || "Замовити встановлення" }}</p>
          </button>
        </div>
        
        <div class="p-4 diviwer mt-6 mb-6"></div>
        <div class="social flex gap-1">
          <button><img src="/images/facebook.svg" alt="" /></button>
          <button><img src="/images/tg.svg" alt="" /></button>
          <button><img src="/images/soc.svg" alt="" /></button>
        </div>
      </div>
      <div v-if="product" class="about-product p-4">
        <div class="about-product-head flex justify-between">
          <div class="availability">В наявності</div>
          <div class="code">Код: <span>12743</span></div>
        </div>
        <!-- Fixed product name with explicit text color -->
        <h2 class="product-name mt-3">{{ product.defaultName }}</h2>
        <div class="certification flex items-center mt-6">
          <img src="/images/certification-Icon.svg" alt="" />
          <div class="ml-2">Сертифікований товар.</div>
          <a href="/">Дивитись сертифікат</a>
        </div>

        <div class="product-boxes flex flex-wrap mt-6">
          <div
            v-for="(box, index) in productBoxes"
            :key="index"
            class="product-boxe flex items-center mt-2 mr-2"
          >
            <img class="mr-2" :src="box.img" alt="" />
            <div class="">{{ box.title }}</div>
          </div>
        </div>
        <div class="p-4 diviwer mt-6 mb-6"></div>
        <div class="product-price">
          <div class="flex items-center">
            <span class="product-price-discount">64 543 ₴</span>
            <span class="discount ml-2">-5%</span>
          </div>
          <div class="real-price mt-1">57 999 ₴</div>
          <div class="credits-price flex items-center">
            <img src="/images/calender.svg" alt="" />
            <span class="credit-price ml-2 mr-2">від 580 ₴/міс</span>
            <span class="credit">в кредит</span>
          </div>
        </div>
        <div class="p-4 diviwer mt-6 mb-6"></div>
        <div class="product-sizes">
          <span>Разміри сонячної батареї, (мм)</span>
          <div class="mt-3 product-sizes-buttons">
            <button
              @click="sizeButton = size"
              v-for="(size, i) in productSizes"
              :key="size.id"
              :class="{ active: sizeButton.id === size.id }"
            >
              {{ size.size }}
            </button>
          </div>
        </div>
        <div class="garanty">
          <h4 class="h4">Гарантія та доставка:</h4>
          <div class="garanty-data mt-3">
            <div
              v-for="(garanty, i) in garantyData"
              :key="i"
              class="flex items-center mt-6"
            >
              <img class="mr-3" :src="garanty.img" alt="" />
              <span>{{ garanty.title }}</span>
            </div>
          </div>
        </div>
        <div class="payments-data mt-6">
          <h3>Оплату можна здійснити:</h3>
          <div class="flex flex-wrap">
            <div v-for="(item, i) in paymantData" :key="i" class="paymant">
              <button><img :src="item.img" alt="" /></button>
            </div>
          </div>
        </div>
        <div class="main-characters mt-[63px]">
          <h3>Основні характеристики</h3>
          <div class="main-characters-data mt-8">
            <div
              class="characters-data p-8 flex items-center justify-between xl:justify-start flex-wrap"
              v-for="(item, i) in mainCharacters"
              :key="i"
            >
              <span>{{ item.name }}</span>
              <div>{{ item.description }}</div>
            </div>
          </div>
        </div>
        
        <!-- Product Information Section (from first code) -->
        <div v-if="product" class="product-info-section mt-8">
          <h3>{{ $t("product.section_title") || "Інформація про товар" }}</h3>
          <table class="info-table">
            <tr>
              <th>{{ $t("product.quantity") || "Кількість" }}</th>
              <td>{{ product.quantity || "1" }}</td>
            </tr>
            <tr>
              <th>{{ $t("product.brand") || "Бренд" }}</th>
              <td>{{ product.brand }}</td>
            </tr>
            <tr>
              <th>{{ $t("product.model") || "Модель" }}</th>
              <td>{{ product.model || product.defaultName }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div class="relative">
      <div
        class="add-to-card mt-5 flex items-center justify-between xl:justify-start"
      >
        <div class="product-counter flex items-center justify-between">
          <button @click="changeProductCount('-')">
            <img src="/images/dash.svg" alt="" />
          </button>
          <input v-model="productCount" />
          <button @click="changeProductCount('+')">
            <img src="/images/plus.svg" alt="" />
          </button>
        </div>
        <div class="add-to-card-button xl:ml-4">
          <button
            @click="addToCart"
            class="flex items-center justify-center xl:w-[580px]"
          >
            <img
              class="mr-2"
              src="/images/cart-2.svg"
              alt=""
              width="20"
              height="17"
            />
            <p>{{ $t("product.addToCart") || "Додати в кошик" }}</p>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Installation Popup (Modal) -->
  <div v-if="showInstallationPopup" class="installation-popup-overlay" @click="closeInstallationPopup">
    <div class="installation-popup" @click.stop>
      <div class="popup-header">
        <h3>{{ $t("product.installationRequest") || "Замовлення встановлення" }}</h3>
        <button class="close-btn" @click="closeInstallationPopup">×</button>
      </div>
      <div class="popup-content">
        <div class="installation-toggle">
          <input type="checkbox" id="addInstallation" v-model="addInstallation">
          <label for="addInstallation">{{ $t("product.includeInstallation") || "Додати встановлення до замовлення" }}</label>
        </div>
        
        <div v-if="addInstallation" class="installation-form">
          <div class="form-group">
            <label>{{ $t("product.companyName") || "Назва компанії" }} <span class="required-indicator">*</span></label>
            <input type="text" v-model="installationDetails.companyName" required>
          </div>
          
          <div class="form-group">
            <label>{{ $t("product.address") || "Адреса" }} <span class="required-indicator">*</span></label>
            <input type="text" v-model="installationDetails.address" required>
          </div>
          
          <div class="form-group">
            <label>{{ $t("product.notes") || "Примітки" }}</label>
            <textarea v-model="installationDetails.notes"></textarea>
          </div>
          
          <div class="installation-provider">
            <!-- Fixed image path -->
            <img src="/images/certification-Icon.svg" alt="Installation Provider" class="provider-logo">
            <div>
              <div class="provider-name">{{ $t("product.installationProvider") || "Сертифікований монтажник" }}</div>
              <div class="provider-rating">★★★★★ (4.9)</div>
            </div>
          </div>
        </div>
      </div>
      <div class="popup-footer">
        <button class="cancel-btn" @click="closeInstallationPopup">{{ $t("common.cancel") || "Скасувати" }}</button>
        <button class="confirm-btn" @click="confirmInstallation">{{ $t("common.confirm") || "Підтвердити" }}</button>
      </div>
    </div>
  </div>

</template>



<script setup>
import { ref, onMounted, computed, onUpdated, watch } from "vue";
import { useRoute } from "vue-router";
import { useCartStore } from "@/stores/cart";
import { useProductsStore } from "@/stores/products";

const route = useRoute();
const store = useProductsStore();
const cartStore = useCartStore();
const productId = computed(() => route.params.id);
const product = ref(null);
const selectedImage = ref(null);
const productCount = ref(1);
const sizeButton = ref({ id: 1, size: "1722×1134×30" });

// Installation popup state
const showInstallationPopup = ref(false);
const addInstallation = ref(false);
const installationDetails = ref({
  companyName: "",
  address: "",
  notes: "",
});

const toggleInstallationPopup = () => {
  showInstallationPopup.value = !showInstallationPopup.value;
};

const closeInstallationPopup = () => {
  showInstallationPopup.value = false;
};

const confirmInstallation = () => {
  if (addInstallation.value) {
    // Validate form if installation is selected
    if (!installationDetails.value.companyName || !installationDetails.value.address) {
      alert($t("product.fillRequiredFields") || "Будь ласка, заповніть обов'язкові поля");
      return;
    }
  }
  
  // Close the popup and keep the installation details
  showInstallationPopup.value = false;
  // You can add additional logic here if needed
};

const changeProductCount = (action) => {
  if (action === "+") {
    productCount.value++;
  } else if (action === "-") {
    if (productCount.value > 1) {
      productCount.value--;
    }
  }
};

const productSizes = [
  { id: 1, size: "1722×1134×30" },
  { id: 2, size: "2600×1134×30" },
  { id: 3, size: "2600×1134×30" },
];

const myproduct = computed(() => {
  return store.getProducts.filter((product) => +product.id === +productId.value);
});

const productCharacteristics = [
  { 
    src: '/images/manufactury.svg',
    name: "Виробник",
    description: "Victron Energy (Китай)",
  },
  {
    src: '/images/core_1.svg',
    name: "Номінальна потужність",
    description: "435 Вт",
  },
  {
    src: '/images/core.svg',
    name: "Маса",
    description: "1.9 Кг",
  },
  {
    src: '/images/selfie.svg',
    name: "Номінальна напруга",
    description: "18.4 В",
  },
  {
    src: '/images/battery.svg',
    name: "Струм короткого замикання",
    description: "1.18 А",
  },
];

const productBoxes = [
  {
    img: "/images/np.svg",
    title: "Доставка за 1 грн.",
  },
  {
    img: "/images/krash.svg",
    title: "Кращ",
  },
  {
    img: "/images/trade-in.svg",
    title: "Trade-In",
  }
];

const garantyData = [
  {
    img: "/images/truck.svg",
    title: "Безкоштовна доставка у магазин та відділення Нової Пошти.",
  },
  {
    img: "/images/shield-tick.svg",
    title: "Офіційна гарантія від виробника",
  },
  {
    img: "/images/3d-rotate.svg",
    title: "Швидкий обмін та повернення протягом 14 днів.",
  }
];

const mainCharacters = [
  {
    name: "Номінальна потужність, (Вт)",
    description: "435",
  },
  {
    name: "Тип кристала",
    description: "Монокристал",
  },
  {
    name: "Напруга при максимальній потужності, (В)",
    description: "33,04",
  },
  {
    name: "Струм при максимальній потужності, (A)",
    description: "13,17 А",
  },
  {
    name: "Напруга холостого ходу, (В)",
    description: "39,33",
  },
  {
    name: "Струм короткого замикання Iк.з. (A) ",
    description: "1722х1134х30",
  },
  {
    name: "Рама",
    description: "Анодований алюміній",
  },
  {
    name: "Вага, (кг)",
    description: "120 Гц",
  },
  {
    name: "Напруга холостого ходу, (В)",
    description: "20,8",
  },
];

const paymantData = [
  {
    img: "/images/paymants/google.svg",
    title: "google",
  },
  {
    img: "/images/paymants/apple.svg",
    title: "apple",
  },
  {
    img: "/images/paymants/privat.svg",
    title: "privat",
  },
  {
    img: "/images/paymants/visa.svg",
    title: "УкрСиббанк",
  },
  {
    img: "/images/paymants/master.svg",
    title: "УкрСиббанк",
  },
  {
    img: "/images/paymants/green.svg",
    title: "УкрСиббанк",
  },
  {
    img: "/images/paymants/yellow.svg",
    title: "УкрСиббанк",
  },
];

const addToCart = () => {
  if (product.value) {
    console.log(product.value);
    const cartItem = {
      id: product.value.id,
      title: product.value.defaultName || product.value.name,
      price: product.value.price,
      image: productImages.value[0] || "/images/placeholder.png",
      quantity: productCount.value,
      installation: addInstallation.value ? installationDetails.value : null,
    };
    cartStore.addToCart(cartItem);
    alert(
      `Added ${productCount.value} ${
        product.value.title || product.value.defaultName
      } to cart${addInstallation.value ? " with installation" : ""}`
    );
  }
};

const getTypeRoute = (type) => {
  const typeToRoute = {
    "Сонячні Панелі": "/solar-panels",
    Батареї: "/batteries",
    "Cables, Chargers & Powerbanks": "/cables",
    Інвертори: "/inverters",
    SolarSets: "/solar-sets",
    "Система монтажу сонячних панелей": "/mounting-systems",
    "Швидкі Зарядні Станції (DC)": "/dc-charging-stations",
    "Зарядні Станції Рівня 2 (AC)": "/ac-charging-stations",
    "Портативні/Мобільні Зарядні Пристрої": "/portable-charging-devices",
    "Портативна електростанція": "/portable-power-stations",
  };
  return typeToRoute[type] || "/catalogue";
};

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
  const productId = route.params.id;
  // Simulation of API call or using mock data
  const foundProduct = store.getProducts.find(
    (product) => +product.id === +productId
  );

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
  } else {
    console.warn(`Product with ID ${productId} not found.`);
  }
};

const updatePageLayout = () => {
  // Update for better visibility of breadcrumbs
  document.documentElement.style.setProperty('--header-offset', '150px');
};

onUpdated(() => {
  getProduct();
});

// Fetch product on component mount
onMounted(async () => {
  await getProduct();
  updatePageLayout();
  
  // Force visibility of breadcrumb
  setTimeout(() => {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
      breadcrumb.style.visibility = 'visible';
      breadcrumb.style.opacity = '1';
    }
  }, 100);
});

watch(
  () => store.getProducts,
  () => {
    getProduct();
  }
);

// Watch route changes to update product when navigating between products
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      getProduct();
    }
  }
);
</script>


<style scoped>
.product-page-container {
  max-width: 1920px;
  /* Fixed: Added padding-top to ensure content is below fixed header */
  padding-top: var(--header-offset, 150px);
  margin: 0 auto;
}

/* Fixed: Made breadcrumb visible with higher z-index and clear positioning */
.breadcrumb {
  font-size: 14px;
  margin-bottom: 20px;
  color: #2f2e34; /* Darker color for better visibility */
  padding: 12px 0; /* Added padding for more visibility */
  width: 100%;
  background-color: #f8f9fa; /* Light background for contrast */
  border-radius: 4px;
  position: relative;
  z-index: 5; /* Higher z-index to ensure visibility */
  visibility: visible !important;
  opacity: 1 !important;
  border-bottom: 1px solid #e8e8e8;
}

.breadcrumb a {
  color: #4392ff; /* Blue links for better visibility */
  text-decoration: none;
  font-weight: 500;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 5px;
  color: #999;
}

.current-page {
  color: #2f2e34;
  font-weight: 500;
}

.product-content {
  display: flex;
  gap: 40px;
}

.product-gallery {
  display: flex;
  gap: 20px;
}

.thumbnail-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.thumbnail {
  width: 96px;
  height: 96px;
  border: 2px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail.active {
  border-color: #4392ff;
  border-radius: 10px;
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
}

.main-image {
  max-width: 100%;
  max-height: 590px;
  object-fit: contain;
}

.diviwer {
  width: 100%;
  padding: 1px;
  max-height: 1px;
  background-color: #e0e0e0;
}

.product-characteristic {
  background-color: #e8e8e8;
  border-radius: 8px;
}

.characteristics-name {
  font-weight: 400;
  font-size: 16px;
  line-height: 115.99999999999999%;
  letter-spacing: 0%;
  color: #8c8f9d;
}

.characteristics-description {
  font-weight: 500;
  font-size: 16px;
  line-height: 115.99999999999999%;
  letter-spacing: 0%;
  color: #2f2e34;
}

.button-instaletion button {
  background-color: #ffffff;
  color: #4392ff;
  border: 1px solid #4392ff;
  font-weight: 500;
  font-size: 18px;
  line-height: 135%;
  letter-spacing: 0%;
}

.button-instaletion button:hover {
  background-color: #f0f7ff;
}

.social button {
  background-color: #f8f9fa;
  border-radius: 50%;
  padding: 16px;
}

.social img {
  width: 20px;
  height: auto;
}

.availability {
  font-weight: 500;
  font-size: 14px;
  line-height: 115.99999999999999%;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
  background-color: #2cdb000d;
  color: #42b029;
  padding: 6px 12px;
  border-radius: 1000px;
}

.code {
  font-weight: 500;
  font-size: 16px;
  line-height: 145%;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
  color: #b2bac0;
}

.code span {
  color: #001e34;
}

/* Fixed: Made product name explicitly black */
.product-name {
  font-weight: 500;
  font-size: 48px;
  line-height: 124%;
  letter-spacing: 0%;
  color: #2f2e34; /* Explicitly black text */
}

.certification a {
  color: #4392ff;
}

.product-boxe {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 10px 14px;
  width: max-content;
}

.product-price-discount {
  font-weight: 500;
  font-size: 14px;
  line-height: 115.99999999999999%;
  letter-spacing: 0%;
  vertical-align: middle;
  text-decoration: line-through;
  color: #808080;
}

.discount {
  background-color: #ff003a;
  border-radius: 14px;
  color: #ffffff;
  padding: 2px 4px;
}

.real-price {
  font-weight: 600;
  font-size: 48px;
  line-height: 124%;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #2f2e34; /* Explicitly dark text */
}

.credit-price {
  color: #42b029;
  font-weight: 500;
  font-size: 16px;
  line-height: 115.99999999999999%;
  letter-spacing: 0%;
  vertical-align: middle;
}

.credit {
  font-weight: 500;
  font-size: 14px;
  line-height: 145%;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #b2bac0;
}

.product-sizes {
  font-weight: 500;
  font-size: 16px;
  line-height: 115.99999999999999%;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #5d6368;
}

.product-sizes-buttons {
  font-weight: 500;
  font-size: 18px;
  line-height: 132%;
  letter-spacing: 0%;
  vertical-align: middle;
  padding: 12px 8.5px;
}

.product-sizes-buttons button {
  background: #ffffff;
  border: 1px solid #e8e8e8;
  margin-right: 16px;
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  color: #2f2e34; /* Explicitly dark text */
}

.product-sizes-buttons button:hover {
  border-color: #4392ff;
}

.product-sizes-buttons .active {
  border-color: #4392ff;
  color: #000000;
}

.garanty h4 {
  font-weight: 500;
  font-size: 24px;
  line-height: 124%;
  letter-spacing: 0%;
  color: #2f2e34;
}

.garanty-data {
  font-weight: 500;
  font-size: 18px;
  line-height: 132%;
  letter-spacing: 0%;
  color: #5d6368;
  background: #f8f9fa;
  padding: 32px 26px;
  border-radius: 24px;
}

.payments-data h3 {
  font-weight: 500;
  font-size: 24px;
  line-height: 124%;
  letter-spacing: 0%;
  color: #2f2e34;
}

.payments-data button {
  padding: 0px;
  background: transparent;
  margin-right: 16px;
  margin-top: 16px;
}

.main-characters h3 {
  font-weight: 500;
  font-size: 32px;
  line-height: 124%;
  letter-spacing: 0%;
  color: #2f2e34; /* Explicitly dark text */
}

.main-characters-data {
  background: #f8f9fa;
  border-radius: 24px;
}

.characters-data span {
  font-weight: 500;
  font-size: 18px;
  line-height: 145%;
  letter-spacing: 0%;
  color: #5d6368;
  width: 60%;
}

.characters-data div {
  font-weight: 500;
  font-size: 18px;
  line-height: 145%;
  letter-spacing: 0%;
  color: #001e34;
}

.product-counter {
  border: 1px solid #4392ff;
  width: max-content;
  border-radius: 12px;
}

.product-counter input {
  width: 50px;
  height: 100%;
  padding: 10px 15px;
  text-align: center;
  color: #2f2e34;
  font-weight: 500;
}

.product-counter button {
  font-size: 20px;
  color: #001e34;
  border-radius: 12px;
  background: transparent;
  padding: 0 12px;
  height: 54px;
}

.product-counter button:hover {
  border: 1px solid transparent;
  background-color: #f0f7ff;
}

.add-to-card-button button {
  background: #4392ff;
  color: #ffffff;
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 0%;
  height: 52px;
  border-radius: 12px;
}

.add-to-card-button button:hover {
  background-color: #3a83e8;
}

.about-product {
  overflow: hidden;
  overflow-y: auto;
}

/* Product Info Section Styles */
.product-info-section {
  margin-top: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  background-color: #f8f9fa;
}

.product-info-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 500;
  color: #2f2e34;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-table th,
.info-table td {
  border: 1px solid #e0e0e0;
  padding: 8px;
  text-align: left;
}

.info-table th {
  background-color: #f9f9f9;
  width: 120px;
  font-weight: 500;
  color: #5d6368;
}

.info-table td {
  color: #001e34;
}

/* Installation Popup Styles */
.installation-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.installation-popup {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.popup-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  color: #2f2e34;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #5d6368;
  cursor: pointer;
}

.popup-content {
  padding: 20px;
}

.installation-toggle {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.installation-toggle input[type="checkbox"] {
  margin-right: 10px;
  width: 18px;
  height: 18px;
}

.installation-toggle label {
  font-weight: 500;
  font-size: 16px;
  color: #2f2e34;
  cursor: pointer;
}

.installation-form {
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-weight: 500;
  font-size: 14px;
  color: #5d6368;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.required-indicator {
  color: #ff003a;
  font-size: 14px;
}

.installation-provider {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.provider-logo {
  width: 40px;
  height: 40px;
  margin-right: 12px;
}

.provider-name {
  font-weight: 500;
  font-size: 16px;
  color: #2f2e34;
}

.provider-rating {
  color: #ffc107;
  font-size: 14px;
}

.popup-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #e0e0e0;
}

.cancel-btn {
  background-color: #f8f9fa;
  color: #5d6368;
  border: 1px solid #e0e0e0;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
}

.confirm-btn {
  background-color: #4392ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
}

@media (min-width: 1280px) {
  .add-to-card {
    position: absolute;
    bottom: 117px;
    left: -30px;
    z-index: 100;
  }
  .about-product {
    width: 838px;
    height: 900px;
    left: -100px;
  }
  
  /* Responsive adjustments for installation popup */
  .installation-popup {
    max-width: 600px;
  }
}

@media (min-width: 1440px) {
  .product-page-container {
    padding-left: 80px;
  }

  .product-containew {
    width: 734px;
  }

  .product-characteristics {
    display: flex;
    flex-wrap: wrap;
  }
  .product-characteristic {
    width: max-content;
    display: flex;
    margin-right: 16px;
  }
  .product-counter {
    background-color: #ffffff;
  }
  .product-counter button {
    width: 100%;
  }
}

/* Additional Responsive Styles for Mobile */
@media (max-width: 768px) {
  .product-page-container {
    padding-top: 80px; /* Less padding on mobile */
  }
  
  .breadcrumb {
    padding: 8px;
    margin-bottom: 10px;
    font-size: 12px;
    position: sticky;
    top: 60px; /* Keep breadcrumb visible on scroll */
    z-index: 10;
  }
  
  .product-content {
    flex-direction: column;
  }
  
  .product-gallery {
    flex-direction: column-reverse;
  }
  
  .thumbnail-list {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 10px;
  }
  
  .product-name {
    font-size: 24px;
  }
  
  .real-price {
    font-size: 32px;
  }
  
  .installation-popup {
    width: 95%;
    max-height: 80vh;
  }
  
  .add-to-card {
    flex-direction: column;
    gap: 10px;
  }
  
  .product-counter {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  
  .add-to-card-button {
    width: 100%;
  }
  
  .add-to-card-button button {
    width: 100%;
  }
}

/* Improved hover effects for all interactive elements */
.button-instaletion button:hover,
.social button:hover,
.product-sizes-buttons button:hover,
.payments-data button:hover,
.cancel-btn:hover {
  opacity: 0.9;
  transition: all 0.2s ease;
}

.add-to-card-button button:hover,
.confirm-btn:hover {
  background-color: #3a83e8;
  transition: all 0.2s ease;
}

/* Focus styles for accessibility */
button:focus,
a:focus,
input:focus,
textarea:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(67, 146, 255, 0.4);
}

/* Custom scrollbar for better UX */
.about-product::-webkit-scrollbar,
.installation-popup::-webkit-scrollbar {
  width: 8px;
}

.about-product::-webkit-scrollbar-track,
.installation-popup::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.about-product::-webkit-scrollbar-thumb,
.installation-popup::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.about-product::-webkit-scrollbar-thumb:hover,
.installation-popup::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Catalogue Page Consistency */
.catalogue-view {
  padding-top: var(--header-offset, 150px);
  margin-top: 0 !important;
}

.breadcrumb-spacing {
  margin-bottom: 1rem;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  border-bottom: 1px solid #e8e8e8;
}

.products-container {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 15px;
  padding: 20px;
  background-color: #f9fafb;
}

/* Consistent heading styles */
h1, h2, h3, h4, h5, h6 {
  color: #2f2e34;
}

/* Fix for product cards */
.product-card-wrapper {
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card-wrapper:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>