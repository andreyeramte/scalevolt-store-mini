import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { Scrollbar, Navigation } from 'swiper/modules';
import SliderProductCard from '@/components/SliderProductCard/SliderProductCard';
import './SwiperComponent.css';

export default function SwiperComponent() {
  const swiperRef = useRef(null);
  const modules = [Scrollbar, Navigation];

  return (
    <div className="relative mb-10">
      <Swiper
        onSwiper={swiper => { swiperRef.current = swiper; }}
        slidesPerView={3}
        scrollbar={{ draggable: true }}
        navigation={{
          el: '.swiper-scrollbar',
          draggable: true,
          dragSize: 910,
        }}
        breakpoints={{
          '@0.00':  { slidesPerView: 1, spaceBetween: 10 },
          '@0.5':   { slidesPerView: 2, spaceBetween: 10 },
          '@1.00':  { slidesPerView: 3, spaceBetween: 20 },
          '@1.50':  { slidesPerView: 3.5, spaceBetween: 20 },
          '@2.00':  { slidesPerView: 5.5, spaceBetween: 20 },
        }}
        modules={modules}
        className="mySwiper"
      >
        <div className="mt-9 swiper-scrollbar-wrapper">
          <div className="swiper-scrollbar"></div>
        </div>

        {Array.from({ length: 10 }).map((_, i) => (
          <SwiperSlide key={i}>
            <SliderProductCard />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
