<template>
    <div class="delivery-page-container">
      <h1 class="page-title">{{ $t('delivery.pageTitle') }}</h1>
      
      <div class="section-container">
        <!-- Delivery Section -->
        <section class="policy-section">
          <h2>{{ $t('delivery.deliveryTitle') }}</h2>
          <div class="content-box">
            <h3>{{ $t('delivery.standardDelivery') }}</h3>
            <p v-html="$t('delivery.standardDeliveryDesc')"></p>
            
            <h3>{{ $t('delivery.expressDelivery') }}</h3>
            <p v-html="$t('delivery.expressDeliveryDesc')"></p>
            
            <h3>{{ $t('delivery.bulkOrders') }}</h3>
            <p v-html="$t('delivery.bulkOrdersDesc')"></p>
            
            <div class="delivery-table">
              <h4>{{ $t('delivery.deliveryTimeTable') }}</h4>
              <table>
                <thead>
                  <tr>
                    <th>{{ $t('delivery.region') }}</th>
                    <th>{{ $t('delivery.standardTime') }}</th>
                    <th>{{ $t('delivery.expressTime') }}</th>
                    <th>{{ $t('delivery.cost') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ $t('delivery.majorCities') }}</td>
                    <td>1-3 {{ $t('delivery.days') }}</td>
                    <td>1 {{ $t('delivery.day') }}</td>
                    <td v-html="$t('delivery.majorCitiesCost')"></td>
                  </tr>
                  <tr>
                    <td>{{ $t('delivery.otherRegions') }}</td>
                    <td>3-7 {{ $t('delivery.days') }}</td>
                    <td>2-3 {{ $t('delivery.days') }}</td>
                    <td v-html="$t('delivery.otherRegionsCost')"></td>
                  </tr>
                  <tr>
                    <td>{{ $t('delivery.remoteAreas') }}</td>
                    <td>7-14 {{ $t('delivery.days') }}</td>
                    <td>3-5 {{ $t('delivery.days') }}</td>
                    <td v-html="$t('delivery.remoteAreasCost')"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h3>{{ $t('delivery.trackingTitle') }}</h3>
            <p v-html="$t('delivery.trackingDesc')"></p>
          </div>
        </section>
        
        <!-- Warranty Section -->
        <section class="policy-section">
          <h2>{{ $t('warranty.warrantyTitle') }}</h2>
          <div class="content-box">
            <h3>{{ $t('warranty.standardWarranty') }}</h3>
            <p v-html="$t('warranty.standardWarrantyDesc')"></p>
            
            <div class="warranty-table">
              <h4>{{ $t('warranty.warrantyPeriodTable') }}</h4>
              <table>
                <thead>
                  <tr>
                    <th>{{ $t('warranty.productCategory') }}</th>
                    <th>{{ $t('warranty.warrantyPeriod') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ $t('warranty.solarPanels') }}</td>
                    <td>{{ $t('warranty.solarPanelsWarranty') }}</td>
                  </tr>
                  <tr>
                    <td>{{ $t('warranty.batteries') }}</td>
                    <td>{{ $t('warranty.batteriesWarranty') }}</td>
                  </tr>
                  <tr>
                    <td>{{ $t('warranty.inverters') }}</td>
                    <td>{{ $t('warranty.invertersWarranty') }}</td>
                  </tr>
                  <tr>
                    <td>{{ $t('warranty.accessories') }}</td>
                    <td>{{ $t('warranty.accessoriesWarranty') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h3>{{ $t('warranty.warrantyExclusions') }}</h3>
            <ul class="policy-list">
              <li v-html="$t('warranty.exclusion1')"></li>
              <li v-html="$t('warranty.exclusion2')"></li>
              <li v-html="$t('warranty.exclusion3')"></li>
              <li v-html="$t('warranty.exclusion4')"></li>
            </ul>
            
            <h3>{{ $t('warranty.warrantyProcess') }}</h3>
            <p v-html="$t('warranty.warrantyProcessDesc')"></p>
          </div>
        </section>
        
        <!-- Returns Section -->
        <section class="policy-section">
          <h2>{{ $t('returns.returnsTitle') }}</h2>
          <div class="content-box">
            <h3>{{ $t('returns.returnPolicy') }}</h3>
            <p v-html="$t('returns.returnPolicyDesc')"></p>
            
            <h3>{{ $t('returns.returnProcess') }}</h3>
            <ol class="process-steps">
              <li v-html="$t('returns.step1')"></li>
              <li v-html="$t('returns.step2')"></li>
              <li v-html="$t('returns.step3')"></li>
              <li v-html="$t('returns.step4')"></li>
              <li v-html="$t('returns.step5')"></li>
            </ol>
            
            <h3>{{ $t('returns.nonReturnable') }}</h3>
            <ul class="policy-list">
              <li v-html="$t('returns.nonReturnable1')"></li>
              <li v-html="$t('returns.nonReturnable2')"></li>
              <li v-html="$t('returns.nonReturnable3')"></li>
            </ul>
            
            <div class="note-box">
              <h4>{{ $t('returns.note') }}</h4>
              <p v-html="$t('returns.noteDesc')"></p>
            </div>
          </div>
        </section>
        
        <!-- Legal Information Section -->
        <section class="policy-section">
          <h2>{{ $t('legal.legalInformation') }}</h2>
          <div class="content-box">
            <p v-html="$t('legal.legalDesc')"></p>
            <p v-html="$t('legal.contactInfo')"></p>
          </div>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DeliveryWarrantyReturnsPage',
    mounted() {
      // Set the page title
      document.title = this.$t('delivery.pageTitle') + ' | SCALEVOLT';
    }
  };
  </script>
  
  <style scoped>
  .delivery-page-container {
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
  
  .content-box h4 {
    color: #555;
    margin-top: 15px;
    margin-bottom: 10px;
    font-size: 18px;
  }
  
  .content-box p {
    line-height: 1.6;
    margin-bottom: 15px;
    color: #555;
  }
  
  .delivery-table, .warranty-table {
    margin: 20px 0;
    overflow-x: auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  table th, table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }
  
  table th {
    background-color: #f5f5f5;
    font-weight: bold;
  }
  
  .policy-list, .process-steps {
    padding-left: 20px;
    margin-bottom: 20px;
  }
  
  .policy-list li, .process-steps li {
    margin-bottom: 10px;
    line-height: 1.5;
  }
  
  .note-box {
    background-color: #f9f9f9;
    border-left: 4px solid #f26e9a;
    padding: 15px;
    margin: 20px 0;
  }
  
  .note-box h4 {
    margin-top: 0;
    color: #444;
  }
  
  @media (max-width: 768px) {
    .delivery-page-container {
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
    
    .content-box h4 {
      font-size: 16px;
    }
    
    table th, table td {
      padding: 8px;
      font-size: 14px;
    }
  }
  
  @media (max-width: 480px) {
    .delivery-page-container {
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