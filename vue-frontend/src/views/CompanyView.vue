<template>
  <div class="company-page">
    <!-- Hero Section with Parallax Effect -->
    <div class="hero-section">
      <div class="parallax-container">
        <h1 class="company-title">{{ $t("about.companyTitle") }}</h1>
        <p class="company-subtitle">{{ $t("about.companySubtitle") }}</p>
      </div>
    </div>

    <!-- Our Mission Section with Fade-in Effect -->
    <section class="mission-section fade-in-section">
      <div class="container">
        <h2>{{ $t("about.missionTitle") }}</h2>
        <div class="mission-content">
          <div class="mission-image">
            <div class="placeholder-image"></div>
          </div>
          <div class="mission-text">
            <p>{{ $t("about.missionText") }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Values Section with Animated Cards -->
    <section class="values-section">
      <div class="container">
        <h2>{{ $t("about.valuesTitle") }}</h2>
        <div class="values-grid">
          <div class="value-card" v-for="(value, index) in translatedValues" :key="index">
            <div class="value-icon">
              <div :class="['icon-placeholder', `icon-${index + 1}`]"></div>
            </div>
            <h3>{{ value.title }}</h3>
            <p>{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Our History Timeline with Scroll Animation -->
    <section class="history-section fade-in-section">
      <div class="container">
        <h2>{{ $t("about.historyTitle") }}</h2>
        <div class="timeline">
          <div class="timeline-item" v-for="(item, index) in translatedHistory" :key="index">
            <div class="timeline-year">{{ item.year }}</div>
            <div class="timeline-content">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </div>
          <!-- Only show fallback if no translation data is available -->
          <div v-if="translatedHistory.length === 0" class="timeline-fallback">
            <p>{{ $t("about.historyComingSoon", "Historia firmy będzie dostępna wkrótce.") }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Team Section with Hover Effects -->
    <section class="team-section fade-in-section">
      <div class="container">
        <h2>{{ $t("about.teamTitle") }}</h2>
        <div class="team-grid">
          <div class="team-member" v-for="(member, index) in translatedTeam" :key="index">
            <div class="member-photo">
              <div class="member-placeholder"></div>
              <div class="member-overlay">
                <p>{{ member.bio }}</p>
              </div>
            </div>
            <h3>{{ member.name }}</h3>
            <p class="member-position">{{ member.position }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Us Section with Animated Form -->
    <section class="contact-section fade-in-section">
      <div class="container">
        <h2>{{ $t("contact.question") }}</h2>
        <div class="contact-container">
          <div class="contact-info">
            <p>{{ $t("contact.question") }}</p>
            <div class="contact-detail">
              <span class="icon-email">✉️</span>
              <a href="mailto:scalevolt.info@gmail.com">{{ $t("contact.email") }}</a>
            </div>
            <div class="contact-detail">
              <span class="icon-location">📍</span>
              <p>{{ $t("contact.address") }}</p>
            </div>
          </div>
          <form class="contact-form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="name">{{ $t("form.name") }}</label>
              <input type="text" id="name" v-model="formData.name" :placeholder="$t('form.namePlaceholder')" />
            </div>
            <div class="form-group">
              <label for="email">{{ $t("form.email") }}</label>
              <input type="email" id="email" v-model="formData.email" :placeholder="$t('form.emailPlaceholder')" />
            </div>
            <div class="form-group">
              <label for="message">{{ $t("form.message") }}</label>
              <textarea id="message" v-model="formData.message" :placeholder="$t('form.messagePlaceholder')"></textarea>
            </div>
            <button type="submit" class="submit-btn">{{ $t("form.submit") }}</button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'CompanyView',
  setup() {
    const { t, locale } = useI18n();
    
    // Form data
    const formData = ref({
      name: '',
      email: '',
      message: ''
    });

    // Computed properties to get translated content with proper i18n handling
    const translatedValues = computed(() => {
      try {
        const values = t("about.values");
        // Check if values is an array
        if (Array.isArray(values)) {
          return values;
        } else {
          console.warn("Values data is not an array:", values);
          return [];
        }
      } catch (error) {
        console.error("Error accessing values data:", error);
        return [];
      }
    });

    const translatedHistory = computed(() => {
      try {
        const historyData = t("about.historyTimeline");
        
        // Check if historyData is an array
        if (Array.isArray(historyData)) {
          return historyData;
        } else {
          console.warn("History timeline data is not an array:", historyData);
          return [];
        }
      } catch (error) {
        console.error("Error accessing history timeline data:", error);
        return [];
      }
    });

    const translatedTeam = computed(() => {
      try {
        const teamData = t("about.teamMembers");
        // Check if teamData is an array
        if (Array.isArray(teamData)) {
          return teamData;
        } else {
          console.warn("Team data is not an array:", teamData);
          return [];
        }
      } catch (error) {
        console.error("Error accessing team data:", error);
        return [];
      }
    });

    // Form submission handler
    const handleSubmit = () => {
      console.log('Form submitted:', formData.value);
      alert(t("form.submitSuccess"));
      formData.value = {
        name: '',
        email: '',
        message: ''
      };
    };

    // Fade-in animation for sections
    onMounted(() => {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      // Observe all sections with fade-in-section class
      document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
      });
      
      // Log debug info about i18n
      console.log("Current locale:", locale.value);
      console.log("About section translations:", {
        companyTitle: t("about.companyTitle"),
        missionTitle: t("about.missionTitle"),
        valuesTitle: t("about.valuesTitle"),
        historyTitle: t("about.historyTitle"),
        teamTitle: t("about.teamTitle")
      });
    });

    return {
      formData,
      translatedValues,
      translatedHistory,
      translatedTeam,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.company-page {
  width: 100%;
  overflow-x: hidden;
  color: #333; /* Default text color for the entire component */
}

/* Hero Section with Parallax */
.hero-section {
  height: 60vh;
  background-color: #333; /* Fallback if image doesn't load */
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white; /* White text only for hero section */
  position: relative;
  /* Using linear gradient as a background instead of an image */
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), 
                   linear-gradient(to right, #0f2027, #203a43, #2c5364);
}

.parallax-container {
  z-index: 1;
  padding: 0 20px;
}

.company-title {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  animation: fadeInUp 1.2s ease-out;
  color: white; /* Explicit white color for hero title */
}

.company-subtitle {
  font-size: 1.5rem;
  max-width: 700px;
  margin: 0 auto;
  animation: fadeInUp 1.5s ease-out;
  color: white; /* Explicit white color for hero subtitle */
}

/* Sections General Styling */
section {
  padding: 5rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  position: relative;
  color: #333; /* Black color for all section titles */
}

h2::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background-color: #4285F4; /* Blue accent color */
}

/* Fade-in Animation for Sections */
.fade-in-section {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 1s ease, transform 1s ease;
}

.fade-in-section.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Mission Section */
.mission-section {
  background-color: #f8f8f8;
}

.mission-content {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  align-items: center;
}

.mission-image {
  flex: 1;
  min-width: 300px;
}

.placeholder-image {
  width: 100%;
  height: 300px;
  background: linear-gradient(to right, #4285F4, #4285F4);
  border-radius: 10px;
}

.placeholder-image:hover {
  transform: scale(1.02);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.mission-text {
  flex: 1;
  min-width: 300px;
}

.mission-text p {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #333; /* Ensuring text is black */
}

/* Values Section */
.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.value-card {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.value-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background-color: #4CAF50;
  transform: translateY(-5px);
  transition: transform 0.3s ease;
}

.value-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.value-card:hover::before {
  transform: translateY(0);
}

.value-icon {
  margin-bottom: 20px;
}

.icon-placeholder {
  width: 60px;
  height: 60px;
  margin: 0 auto;
  background-color: #4CAF50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  position: relative;
}

.icon-1::after {
  content: '★';
  position: absolute;
}

.icon-2::after {
  content: '🔍';
  position: absolute;
}

.icon-3::after {
  content: '👥';
  position: absolute;
}

.icon-4::after {
  content: '🌱';
  position: absolute;
}

.value-card h3 {
  margin-bottom: 15px;
  font-size: 1.5rem;
  color: #333; /* Explicit black color for card titles */
}

.value-card p {
  color: #333; /* Explicit black color for card content */
}

/* History Timeline */
.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 3px;
  background-color: #4285F4; /* Blue color */
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  margin-bottom: 50px;
  display: flex;
  justify-content: flex-start;
  width: 50%;
  padding-right: 40px;
  left: 0;
}

.timeline-item:nth-child(even) {
  left: 50%;
  padding-right: 0;
  padding-left: 40px;
}

.timeline-year {
  position: absolute;
  top: 0;
  right: -70px;
  background-color: #001201; /* Dark green */
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  font-weight: bold;
  z-index: 2; /* Ensure year labels appear above the line */
}

.timeline-item:nth-child(even) .timeline-year {
  right: auto;
  left: -70px;
}

.timeline-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
  width: 100%;
}

.timeline-content:hover {
  transform: scale(1.05);
}

.timeline-content h3 {
  color: #000 !important;   /* force black */
  margin-top: 0;
  margin-bottom: 10px;
}

.timeline-content p {
  color: #333 !important;   /* ensure description is visible */
  margin-bottom: 0;
}

/* Fallback for empty timeline */
.timeline-fallback {
  text-align: center;
  padding: 30px;
  background-color: #f8f8f8;
  border-radius: 10px;
  margin-top: 20px;
  color: #666;
}

/* Team Section */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.team-member {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.team-member:hover {
  transform: translateY(-10px);
}

.member-photo {
  position: relative;
  overflow: hidden;
  height: 250px;
}

.member-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #4CAF50, #2E7D32);
  transition: transform 0.5s ease;
}

.member-overlay {
  position: absolute;
  bottom: -100%;
  left: 0;
  right: 0;
  background-color: rgba(76, 175, 80, 0.9); /* Green with opacity */
  color: white;
  padding: 20px;
  transition: bottom 0.3s ease;
}

.member-overlay p {
  color: white; /* Ensuring overlay text is white */
}

.team-member:hover .member-placeholder {
  transform: scale(1.1);
}

.team-member:hover .member-overlay {
  bottom: 0;
}

.team-member h3 {
  padding: 15px 15px 5px;
  margin: 0;
  color: #333; /* Explicit black color for team member names */
}

.member-position {
  padding: 0 15px 15px;
  margin: 0;
  color: #666; /* Slightly lighter for position text */
  font-style: italic;
}

/* Contact Section */
.contact-section {
  background-color: #f8f8f8;
}

.contact-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.contact-info {
  flex: 1;
  min-width: 300px;
}

.contact-info p {
  color: #333; /* Explicit black color for contact info text */
}

.contact-detail {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.contact-detail p, .contact-detail a {
  color: #333; /* Explicit black color for contact details */
}

.icon-email, .icon-location {
  margin-right: 10px;
  font-size: 1.5rem;
}

.contact-form {
  flex: 2;
  min-width: 300px;
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333; /* Explicit black color for form labels */
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  color: #333; /* Black text for input fields */
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #4CAF50; /* Green accent on focus */
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
  outline: none;
}

.form-group textarea {
  min-height: 150px;
  resize: vertical;
}

.submit-btn {
  background-color: #4CAF50; /* Green */
  color: white; /* White text for submit button */
  border: none;
  padding: 12px 30px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.submit-btn:hover {
  background-color: #388E3C; /* Darker green on hover */
  transform: translateY(-2px);
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Added pulse animation for icons */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.icon-placeholder {
  animation: pulse 3s infinite;
}

/* Responsive Design */
@media (max-width: 768px) {
  .company-title {
    font-size: 2.5rem;
  }
  
  .company-subtitle {
    font-size: 1.2rem;
  }
  
  .timeline::before {
    left: 30px;
  }
  
  .timeline-item {
    width: 100%;
    padding-right: 0;
    padding-left: 70px;
  }
  
  .timeline-item:nth-child(even) {
    left: 0;
    padding-left: 70px;
  }
  
  .timeline-year {
    right: auto;
    left: -5px;
  }
  
  .timeline-item:nth-child(even) .timeline-year {
    left: -5px;
  }
}
</style>