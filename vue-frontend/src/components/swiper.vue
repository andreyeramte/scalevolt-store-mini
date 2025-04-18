<template>
  <swiper
    ref="{swiperRef}"
    :slidesPerView="3"
    :scrollbar="{ draggable: true }"
    :navigation="{
      el: '.swiper-scrollbar',
      draggable: true,
      dragSize: 910,
    }"
    :breakpoints="{
      '@0.00': {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      '@0.5': {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      '@1.00': {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      '@1.50': {
        slidesPerView: 3.5,
        spaceBetween: 20,
      },
      '@2.00': {
        slidesPerView: 5.5,
        spaceBetween: 20,
      },
    }"
    :modules="modules"
    class="mySwiper mb-10 relative"
  >
    <div slot="container-end">
      <div class="mt-9">
        <div class="swiper-scrollbar"></div>
      </div>
    </div>
    <swiper-slide v-for="(slide, i) in 10" :key="i">
      <SliderProductCard />
    </swiper-slide>
  </swiper>
</template>
<script>
import SliderProductCard from "@/components/sliderProductCard.vue";

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";

import "swiper/css/scrollbar";

// import required modules
import { Scrollbar, Navigation } from "swiper/modules";

export default {
  components: {
    Swiper,
    SwiperSlide,
    SliderProductCard,
  },
  setup() {
    return {
      modules: [Scrollbar, Navigation],
    };
  },
};
</script>
<style scoped>
.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.swiper .swiper-scrollbar-drag {
  background: #000000 !important;
}
.swiper-button-next {
  margin: 100px 0 0 0;
}
</style>
