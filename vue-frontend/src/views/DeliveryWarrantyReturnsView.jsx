import React from 'react';
import { useTranslation } from 'react-i18next';

const DeliveryWarrantyReturnsView = () => {
  const { t } = useTranslation();

  return (
    <div style={{ 
      paddingTop: '80px', 
      backgroundColor: 'white', 
      minHeight: '100vh',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ 
          color: '#333', 
          fontSize: '2.5rem', 
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          {t('delivery.pageTitle', 'Delivery, Warranty & Returns')}
        </h1>
        <p style={{ 
          color: '#666', 
          fontSize: '1.1rem',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          {t('delivery.pageSubtitle', 'Comprehensive information about our delivery, warranty, and return policies')}
        </p>
      </div>

      {/* Delivery Section */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ color: '#007bff', fontSize: '2rem', marginBottom: '20px' }}>
          {t('delivery.deliveryTitle', 'Delivery')}
        </h2>
        
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#333', fontSize: '1.3rem', marginBottom: '15px' }}>
            {t('delivery.standardDelivery', 'Standard Delivery')}
          </h3>
          <p style={{ lineHeight: '1.6', color: '#666' }}>
            {t('delivery.standardDeliveryDesc', 'We deliver throughout the entire territory through our reliable partners: Nova Poshta, Ukrposhta, and Meest Express. All orders are processed within 24 hours on business days.')}
          </p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#333', fontSize: '1.3rem', marginBottom: '15px' }}>
            {t('delivery.expressDelivery', 'Express Delivery')}
          </h3>
          <p style={{ lineHeight: '1.6', color: '#666' }}>
            {t('delivery.expressDeliveryDesc', 'For urgent orders, express delivery with accelerated delivery time is available. This service is not available in all regions - check availability when placing your order.')}
          </p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#333', fontSize: '1.3rem', marginBottom: '15px' }}>
            {t('delivery.bulkOrders', 'Bulk Orders')}
          </h3>
          <p style={{ lineHeight: '1.6', color: '#666' }}>
            {t('delivery.bulkOrdersDesc', 'For large or commercial orders (over 10 kW of solar panels or more than 5 batteries), we offer special delivery conditions. Please contact our sales department for detailed information.')}
          </p>
        </div>
      </section>

      {/* Warranty Section */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ color: '#007bff', fontSize: '2rem', marginBottom: '20px' }}>
          {t('warranty.warrantyTitle', 'Warranty')}
        </h2>
        
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#333', fontSize: '1.3rem', marginBottom: '15px' }}>
            {t('warranty.standardWarranty', 'Standard Warranty')}
          </h3>
          <p style={{ lineHeight: '1.6', color: '#666' }}>
            {t('warranty.standardWarrantyDesc', 'SCALEVOLT provides warranty on all products in accordance with Ukrainian legislation. Additional extended warranty is available for registered customers.')}
          </p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#333', fontSize: '1.3rem', marginBottom: '15px' }}>
            {t('warranty.warrantyProcess', 'Warranty Service Process')}
          </h3>
          <p style={{ lineHeight: '1.6', color: '#666' }}>
            {t('warranty.warrantyProcessDesc', 'To submit a warranty claim, please contact our support service or fill out a warranty application form in your personal account. After reviewing your application, we will organize repair or replacement according to our warranty terms.')}
          </p>
        </div>
      </section>

      {/* Returns Section */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ color: '#007bff', fontSize: '2rem', marginBottom: '20px' }}>
          {t('returns.returnsTitle', 'Returns')}
        </h2>
        
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#333', fontSize: '1.3rem', marginBottom: '15px' }}>
            {t('returns.returnPolicy', 'Return Policy')}
          </h3>
          <p style={{ lineHeight: '1.6', color: '#666' }}>
            {t('returns.returnPolicyDesc', 'According to the Law of Ukraine "On Consumer Rights Protection", you have the right to return goods of proper quality within 14 days from the date of receipt, if it was not used and retained all consumer properties, factory packaging and completeness.')}
          </p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#333', fontSize: '1.3rem', marginBottom: '15px' }}>
            {t('returns.returnProcess', 'Return Process')}
          </h3>
          <ol style={{ lineHeight: '1.6', color: '#666', marginLeft: '20px' }}>
            <li>{t('returns.step1', 'Fill out a return application in your personal account or contact our support service.')}</li>
            <li>{t('returns.step2', 'Receive confirmation of the application and instructions for returning the product.')}</li>
            <li>{t('returns.step3', 'Securely pack the product in original packaging with all accessories and documentation.')}</li>
            <li>{t('returns.step4', 'Send the product to the specified address or order courier pickup (depending on the order value).')}</li>
            <li>{t('returns.step5', 'After receiving and checking the product, we will process the refund to your account within 5-7 business days.')}</li>
          </ol>
        </div>
      </section>

      {/* Contact Information */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '30px',
        borderRadius: '10px',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <h3 style={{ color: '#333', marginBottom: '15px' }}>
          {t('delivery.needHelp', 'Need Help?')}
        </h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          {t('delivery.contactSupport', 'Our customer support team is here to help you with any questions about delivery, warranty, or returns.')}
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            {t('delivery.contactEmail', 'Email Support')}
          </button>
          <button style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            {t('delivery.contactPhone', 'Call Us')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryWarrantyReturnsView; 