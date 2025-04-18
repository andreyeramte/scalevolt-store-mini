<template>
  <div class="installation absolute top-0 flex justify-center">
    <div class="installation-popup absolute top-[20%] p-8">
      <div class="installation-popup-header flex justify-between items-center">
        <h3>Залишити заявку</h3>
        <button><img src="/images/close.svg" alt="" width="20" /></button>
      </div>
      <div class="popup-form">
        <div class="flex items-center justify-center mt-8">
          <input
            type="text"
            placeholder="Ваше ім'я"
            class="w-full h-[50px] border-2 mr-6 p-2"
          />
          <input
            type="text"
            placeholder="Телефон"
            class="w-full h-[50px] border-2 p-2"
          />
        </div>
        <div class="mt-6">
          <input
            type="text"
            placeholder="Email"
            class="w-full h-[50px] border-2 p-2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js"></script>
<style scoped>
.installation {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #16151544;
}
.installation-popup {
  background: #ffffff;
  border-radius: 16px;
}
.installation-popup-header h3 {
  font-weight: 500;
  font-size: 32px;
  line-height: 124%;
  letter-spacing: 0%;
}
.installation button {
  background: transparent;
}
.installation input {
  font-weight: 500;
  font-size: 18px;
  line-height: 132%;
  letter-spacing: 0%;
  color: #b2bac0;
  padding: 14px 20px;
  border: 1px solid #262626;
  border-radius: 12px;
  background: url(/images/close.svg) no-repeat scroll 5px 5px;
}
.installation input::placeholder {
  font-weight: 500;
  font-size: 18px;
  line-height: 132%;
  letter-spacing: 0%;
  color: #b2bac0;
}
</style>
