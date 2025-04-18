<template>
    <div class="customer-cases">
      <h2 class="title">USER STORIES</h2>
      <div class="cases-container">
        <div v-for="(caseItem, index) in customerCases" :key="index" class="case-card">
          <!-- Embed YouTube Video -->
          <iframe
            class="video"
            :src="`https://www.youtube.com/embed/${caseItem.videoId}`"
            frameborder="0"
            allowfullscreen
          ></iframe>
  
          <!-- Case Title & Description -->
          <h3 class="case-title">{{ caseItem.title }}</h3>
          <p class="case-description">{{ caseItem.description }}</p>
        </div>
  
        <!-- Instagram Posts Section -->
        <div class="instagram-section">
          <h3>Instagram Stories</h3>
          <div class="instagram-posts">
            <div v-for="(post, index) in instagramPosts" :key="index" class="insta-card">
              <img :src="post.imageUrl" alt="Instagram Post">
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "CustomerCases",
    data() {
      return {
        customerCases: [
          {
            title: "Crux & Beta",
            videoId: "your_youtube_video_id_1",
            description: "Now we're able to live the way we should by the laws of nature.",
          },
          {
            title: "Riley Leboe",
            videoId: "your_youtube_video_id_2",
            description: "If you care about the resource, you will want to protect it.",
          },
          {
            title: "Candice & Max",
            videoId: "your_youtube_video_id_3",
            description: "Solar allows us to continue our life in a safe and healthy way.",
          },
        ],
        instagramPosts: [], // This will be filled with API data
      };
    },
    async mounted() {
      await this.fetchInstagramPosts();
    },
    methods: {
      async fetchInstagramPosts() {
        try {
          const response = await fetch("https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink&access_token=YOUR_ACCESS_TOKEN");
          const data = await response.json();
          this.instagramPosts = data.data
            .filter(post => post.media_type === "IMAGE")
            .map(post => ({ imageUrl: post.media_url, link: post.permalink }));
        } catch (error) {
          console.error("Error fetching Instagram posts:", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
.customer-cases {
  padding: 40px;
  text-align: center;
  margin-top: 100px; /* Adjust according to your header height */
}
  
  .title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  .cases-container {
    display: flex;
    overflow-x: auto;
    gap: 20px;
    padding-bottom: 10px;
  }
  
  .case-card {
    flex: 0 0 300px;
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    background: white;
    padding: 15px;
  }
  
  .video {
    width: 100%;
    height: 180px;
  }
  
  .case-title {
    font-size: 18px;
    margin-top: 10px;
  }
  
  .case-description {
    font-size: 14px;
    color: #666;
  }
  
  /* Instagram Posts Section */
  .instagram-section {
    margin-top: 30px;
  }
  
  .instagram-posts {
    display: flex;
    overflow-x: auto;
    gap: 10px;
  }
  
  .insta-card img {
    width: 100px;
    height: 100px;
    border-radius: 5px;
  }
  </style>
  