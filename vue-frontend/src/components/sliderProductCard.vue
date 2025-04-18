<template>
  <div class="slider-product-card p-4 relative mb-10">
    <div class="flex justify-center">
      <div class="sale absolute">-60%</div>
      <img
        src="/images/Categories/solar.panels/Longi-410-Black.png"
        alt=""
        width="150"
      />
      <div class="like flex justify-center absolute">
        <img src="/images/like-2.svg" alt="" width="22" />
      </div>
    </div>
    <div class="flex sertificated">
      <img class="mr-1" src="/images/sertificated.svg" alt="" width="20" />
      <p>Сертифікований товар</p>
    </div>
    <div class="product-name mt-4">
      Victron Energy 175W-12V SERIES 4A 175WP MONO
    </div>
    <div class="flex justify-between mt-4">
      <div class="poduct-price px-4">9 200 ₴</div>
      <div class="addtocard flex justify-center">
        <img src="/images/cart-2.svg" alt="" width="20" />
      </div>
    </div>
  </div>
</template>
<script setup lang="js"></script>
<style scoped>
.slider-product-card {
  border: 1px solid #e8e8e8;
  border-radius: 24px;
  width: 317px;
  height: 413px;
}
.sale {
  background: #ffffff;
  border: 1px solid #eeeeee;
  padding: 12px;
  border-radius: 1000px;
  width: 71px;
  height: 48px;
  font-weight: 500;
  font-size: 18px;
  line-height: 132%;
  letter-spacing: 0%;
  left: 16px;

  color: #001e34;
}
.like,
.addtocard {
  right: 16px;
  background: #ffffff;
  border: 1px solid #eeeeee;
  padding: 12px;
  border-radius: 12px;
  width: 52px;
  height: 52px;
}
.sertificated p {
  font-weight: 500;
  font-size: 16px;
  line-height: 115.99999999999999%;
  letter-spacing: 0%;
  color: #42b029;
}
.product-name {
  font-weight: 500;
  font-size: 18px;
  line-height: 132%;
  letter-spacing: 0%;
  color: #001e34;
}
.poduct-price {
  font-weight: 600;
  font-size: 24px;
  line-height: 124%;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #000000;
}
.addtocard {
  background: #4392ff;
}
</style>
