<template>
    <div class="privacy-policy-container">
      <h1 class="page-title">{{ $t('privacy.pageTitle') }}</h1>
      
      <div class="section-container">
        <section class="policy-section">
          <h2>{{ $t('privacy.introduction') }}</h2>
          <div class="content-box">
            <p v-html="$t('privacy.introductionText')"></p>
            <p v-html="$t('privacy.lastUpdated')"></p>
          </div>
        </section>
        
        <section class="policy-section">
          <h2>{{ $t('privacy.informationCollection') }}</h2>
          <div class="content-box">
            <h3>{{ $t('privacy.personalData') }}</h3>
            <p v-html="$t('privacy.personalDataDesc')"></p>
            
            <h3>{{ $t('privacy.automaticData') }}</h3>
            <p v-html="$t('privacy.automaticDataDesc')"></p>
            
            <h3>{{ $t('privacy.cookiesUsage') }}</h3>
            <p v-html="$t('privacy.cookiesDesc')"></p>
            
            <h3>{{ $t('privacy.legalBasisUkraine') }}</h3>
            <p v-html="$t('privacy.legalBasisDesc')"></p>
          </div>
        </section>
        
        <section class="policy-section">
          <h2>{{ $t('privacy.dataUsage') }}</h2>
          <div class="content-box">
            <p v-html="$t('privacy.dataUsageIntro')"></p>
            <ul class="policy-list">
              <li v-html="$t('privacy.usage1')"></li>
              <li v-html="$t('privacy.usage2')"></li>
              <li v-html="$t('privacy.usage3')"></li>
              <li v-html="$t('privacy.usage4')"></li>
              <li v-html="$t('privacy.usage5')"></li>
            </ul>
          </div>
        </section>
        
        <section class="policy-section">
          <h2>{{ $t('privacy.dataSharing') }}</h2>
          <div class="content-box">
            <p v-html="$t('privacy.dataSharingIntro')"></p>
            <ul class="policy-list">
              <li v-html="$t('privacy.sharing1')"></li>
              <li v-html="$t('privacy.sharing2')"></li>
              <li v-html="$t('privacy.sharing3')"></li>
              <li v-html="$t('privacy.sharing4')"></li>
            </ul>
            
            <h3>{{ $t('privacy.crossBorder') }}</h3>
            <p v-html="$t('privacy.crossBorderDesc')"></p>
          </div>
        </section>
        
        <section class="policy-section">
          <h2>{{ $t('privacy.dataSecurity') }}</h2>
          <div class="content-box">
            <p v-html="$t('privacy.securityDesc')"></p>
            <p v-html="$t('privacy.securityLimits')"></p>
          </div>
        </section>
        
        <section class="policy-section">
          <h2>{{ $t('privacy.dataRetention') }}</h2>
          <div class="content-box">
            <p v-html="$t('privacy.retentionDesc')"></p>
          </div>
        </section>
        
        <section class="policy-section">
          <h2>{{ $t('privacy.yourRights') }}</h2>
          <div class="content-box">
            <p v-html="$t('privacy.rightsIntro')"></p>
            <ul class="policy-list">
              <li v-html="$t('privacy.right1')"></li>
              <li v-html="$t('privacy.right2')"></li>
              <li v-html="$t('privacy.right3')"></li>
              <li v-html="$t('privacy.right4')"></li>
              <li v-html="$t('privacy.right5')"></li>
              <li v-html="$t('privacy.right6')"></li>
            </ul>
            
            <h3>{{ $t('privacy.requestProcedure') }}</h3>
            <p v-html="$t('privacy.requestDesc')"></p>
          </div>
        </section>
        
        <section class="policy-section">
          <h2>{{ $t('privacy.childrenPrivacy') }}</h2>
          <div class="content-box">
            <p v-html="$t('privacy.childrenDesc')"></p>
          </div>
        </section>
        
        <section class="policy-section">
          <h2>{{ $t('privacy.changes') }}</h2>
          <div class="content-box">
            <p v-html="$t('privacy.changesDesc')"></p>
          </div>
        </section>
        
        <section class="policy-section">
          <h2>{{ $t('privacy.contact') }}</h2>
          <div class="content-box">
            <p v-html="$t('privacy.contactDesc')"></p>
            <div class="contact-info">
              <p><strong>Email:</strong> <a href="mailto:scalevolt.info@gmail.com">scalevolt.info@gmail.com</a></p>
              <p><strong>{{ $t('privacy.addressTitle') }}:</strong> {{ $t('privacy.addressValue') }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PrivacyPolicyPage',
    mounted() {
      // Set the page title
      document.title = this.$t('privacy.pageTitle') + ' | SCALEVOLT';
    }
  };
  </script>
  
  <style scoped>
  .privacy-policy-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    padding-top: 100px;
    font-family: Arial, sans-serif;
  }
  
  .page-title {
    font-size: 28px;
    margin-bottom: 30px;
    text-align: center;
    color: #333;
  }
  
  .section-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  
  .policy-section {
    margin-bottom: 30px;
  }
  
  .policy-section h2 {
    border-bottom: 2px solid #f26e9a;
    padding-bottom: 10px;
    margin-bottom: 20px;
    color: #333;
    font-size: 24px;
  }
  
  .content-box {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  
  .content-box h3 {
    color: #444;
    margin-top: 20px;
    margin-bottom: 15px;
    font-size: 20px;
  }
  
  .content-box p {
    line-height: 1.6;
    margin-bottom: 15px;
    color: #555;
  }
  
  .policy-list {
    padding-left: 20px;
    margin-bottom: 20px;
  }
  
  .policy-list li {
    margin-bottom: 10px;
    line-height: 1.5;
  }
  
  .contact-info {
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 6px;
    margin-top: 20px;
  }
  
  .contact-info p {
    margin-bottom: 10px;
  }
  
  .contact-info a {
    color: #f26e9a;
    text-decoration: none;
  }
  
  .contact-info a:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    .privacy-policy-container {
      padding: 15px;
      padding-top: 80px;
    }
    
    .page-title {
      font-size: 24px;
    }
    
    .policy-section h2 {
      font-size: 20px;
    }
    
    .content-box h3 {
      font-size: 18px;
    }
  }
  
  @media (max-width: 480px) {
    .privacy-policy-container {
      padding: 10px;
      padding-top: 70px;
    }
    
    .page-title {
      font-size: 22px;
    }
    
    .content-box {
      padding: 15px;
    }
  }
  </style>