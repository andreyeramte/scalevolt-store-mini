<template>
  <div class="ad-box" @click="goToAdLink">
    <div v-if="mockAd.attributes.type === 'image'">
      <img :src="getAdContentUrl(mockAd)" :alt="mockAd.attributes.title" />
    </div>
    <div v-else-if="mockAd.attributes.type === 'video'">
      <video controls>
        <source :src="getAdContentUrl(mockAd)" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mockAd: {
        attributes: {
          title: 'Sample Ad',
          type: 'image', // Use 'video' if you want to test with videos
          contentUrl: {
            data: {
              attributes: {
                // Since the image is in public/HomeView, use an absolute path starting with '/'
                url: '/HomeView/adBox/сонячна-ферма.JPG',
              },
            },
          },
          link: 'https://example.com',
        },
      },
    }
  },
  methods: {
    getAdContentUrl(ad) {
      return ad.attributes.contentUrl.data.attributes.url
    },
    goToAdLink() {
      window.open(this.mockAd.attributes.link, '_blank')
    },
  },
}
</script>

<style scoped>
.ad-box {
  cursor: pointer;
  overflow: hidden;
  background-color: #e0f7fa;
  border: 1px solid #b2ebf2;
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
  z-index: 1;
}

.ad-box img,
.ad-box video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ad-box:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 10px rgba(255, 0, 0, 0.2);
}

.ad-box::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  transition: background-color 0.3s;
}

.ad-box:hover::after {
  background-color: rgba(255, 0, 0, 0.1);
}
</style>
