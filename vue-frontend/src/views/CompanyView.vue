<template>
    <div class="company-page">
      <!-- Hero Section with Parallax Effect -->
      <div class="hero-section">
        <div class="parallax-container">
          <h1 class="company-title">Компанія SCALEVOL STORET</h1>
          <p class="company-subtitle">Постачальник інноваційних рішень для відновлюваної енергетики</p>
        </div>
      </div>
  
      <!-- Our Mission Section with Fade-in Effect -->
      <section class="mission-section fade-in-section">
        <div class="container">
          <h2>Наша місія</h2>
          <div class="mission-content">
            <div class="mission-image">
              <!-- Using a placeholder image instead of mission.jpg -->
              <div class="placeholder-image"></div>
            </div>
            <div class="mission-text">
              <p>
                Наша місія в SCALEVOLT STORE — зробити сонячну енергію доступною для кожного українця. 
                Ми прагнемо розширити використання відновлюваних джерел енергії, 
                забезпечуючи надійними та ефективними рішеннями, які допомагають 
                нашим клієнтам досягти енергетичної незалежності.
              </p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Our Values Section with Animated Cards -->
      <section class="values-section">
        <div class="container">
          <h2>Наші цінності</h2>
          <div class="values-grid">
            <div class="value-card" v-for="(value, index) in values" :key="index">
              <div class="value-icon">
                <!-- Using div with icon class instead of images -->
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
          <h2>Історія компанії</h2>
          <div class="timeline">
            <div class="timeline-item" v-for="(item, index) in historyTimeline" :key="index">
              <div class="timeline-year">{{ item.year }}</div>
              <div class="timeline-content">
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Our Team Section with Hover Effects -->
      <section class="team-section fade-in-section">
        <div class="container">
          <h2>Наша команда</h2>
          <div class="team-grid">
            <div class="team-member" v-for="(member, index) in teamMembers" :key="index">
              <div class="member-photo">
                <!-- Using div placeholder instead of missing images -->
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
          <h2>Зв'яжіться з нами</h2>
          <div class="contact-container">
            <div class="contact-info">
              <p>Маєте запитання чи пропозиції? Напишіть нам!</p>
              <div class="contact-detail">
                <!-- Using span instead of font awesome icon -->
                <span class="icon-email">✉️</span>
                <a href="mailto:scalevolt.info@gmail.com">scalevolt.info@gmail.com</a>
              </div>
              <div class="contact-detail">
                <!-- Using span instead of font awesome icon -->
                <span class="icon-location">📍</span>
                <p>м. Київ, Україна</p>
              </div>
            </div>
            <form class="contact-form" @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="name">Ім'я</label>
                <input type="text" id="name" v-model="formData.name" placeholder="Ваше ім'я" />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="formData.email" placeholder="Ваш email" />
              </div>
              <div class="form-group">
                <label for="message">Повідомлення</label>
                <textarea id="message" v-model="formData.message" placeholder="Ваше повідомлення"></textarea>
              </div>
              <button type="submit" class="submit-btn">Надіслати</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CompanyView',
    data() {
      return {
        formData: {
          name: '',
          email: '',
          message: ''
        },
        values: [
          {
            title: 'Якість',
            description: 'Ми пропонуємо лише найякісніші продукти від перевірених виробників, щоб забезпечити довговічність та ефективність кожної установки.'
          },
          {
            title: 'Інновації',
            description: 'Ми постійно слідкуємо за новітніми технологіями у галузі та впроваджуємо передові рішення у наші продукти та послуги.'
          },
          {
            title: 'Клієнтоорієнтованість',
            description: 'Ми ставимо потреби наших клієнтів на перше місце, забезпечуючи індивідуальний підхід та підтримку на кожному етапі співпраці.'
          },
          {
            title: 'Сталий розвиток',
            description: 'Ми віримо в сталий розвиток і прагнемо зменшити негативний вплив на довкілля через поширення відновлюваних джерел енергії.'
          }
        ],
        historyTimeline: [
          {
            year: '2022',
            title: 'Заснування компанії',
            description: 'SCALEVOLT STORE була заснована з метою зробити відновлювану енергію доступною для кожного сімї'
          },
          {
            year: '2023',
            title: 'Розширення асортименту',
            description: 'Ми розширили наш асортимент, додавши новітні рішення для сонячної енергетики та системи накопичення енергії.'
          },
          {
            year: '2024',
            title: 'Відкриття нового офісу',
            description: 'Ми відкрили новий головний офіс та розширили нашу команду професіоналів.'
          },
          {
            year: '2025',
            title: 'Міжнародна співпраця',
            description: 'Налагодження співпраці з провідними міжнародними виробниками обладнання для відновлюваної енергетики.'
        }
      ]
    };
  },
    methods: {
      handleSubmit() {
        // Handle form submission
        console.log('Form submitted:', this.formData);
        // You would usually send this data to your backend here
        alert('Дякуємо за ваше повідомлення! Ми зв\'яжемося з вами найближчим часом.');
        // Reset form
        this.formData = {
          name: '',
          email: '',
          message: ''
        };
      }
    },
    mounted() {
      // Initialize intersection observer for fade-in animations
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
    }
  };
  </script>
  
  <style scoped>
  .company-page {
    width: 100%;
    overflow-x: hidden;
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
    color: white;
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
  }
  
  .company-subtitle {
    font-size: 1.5rem;
    max-width: 700px;
    margin: 0 auto;
    animation: fadeInUp 1.5s ease-out;
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
  }
  
  h2::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background-color: #4285F4; /* Using green color from logo */
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
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
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
    background-color: #4285F4; /* Green from logo */
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
    background-color: #001201; /* Green from logo */
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    font-weight: bold;
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
  }
  
  .timeline-content:hover {
    transform: scale(1.05);
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
  
  .team-member:hover .member-placeholder {
    transform: scale(1.1);
  }
  
  .team-member:hover .member-overlay {
    bottom: 0;
  }
  
  .team-member h3 {
    padding: 15px 15px 5px;
    margin: 0;
  }
  
  .member-position {
    padding: 0 15px 15px;
    margin: 0;
    color: #666;
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
  
  .contact-detail {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
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
  }
  
  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  
  .form-group input:focus,
  .form-group textarea:focus {
    border-color: #4CAF50; /* Green from logo */
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
    outline: none;
  }
  
  .form-group textarea {
    min-height: 150px;
    resize: vertical;
  }
  
  .submit-btn {
    background-color: #4CAF50; /* Green from logo */
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }
  
  .submit-btn:hover {
    background-color: #388E3C; /* Darker green */
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
  
  /* Added bounce animation for buttons */
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
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