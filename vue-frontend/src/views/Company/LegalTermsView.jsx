import React from 'react';
import { useTranslation } from 'react-i18next';

const LegalTermsView = () => {
  const { t } = useTranslation();

  return (
    <div style={{ 
      paddingTop: '80px', 
      backgroundColor: 'white', 
      minHeight: '100vh',
      maxWidth: '800px',
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
          {t('legal.terms.title', 'Terms of Service')}
        </h1>
        <p style={{ 
          color: '#666', 
          fontSize: '1.1rem',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          {t('legal.terms.subtitle', 'Last updated: August 2024')}
        </p>
      </div>

      <div style={{ lineHeight: '1.8', color: '#333' }}>
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#007bff', fontSize: '1.5rem', marginBottom: '15px' }}>
            {t('legal.terms.acceptance.title', '1. Acceptance of Terms')}
          </h2>
          <p>
            {t('legal.terms.acceptance.content', 'By accessing and using the ScaleVolt Store website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.')}
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#007bff', fontSize: '1.5rem', marginBottom: '15px' }}>
            {t('legal.terms.use.title', '2. Use License')}
          </h2>
          <p>
            {t('legal.terms.use.content', 'Permission is granted to temporarily download one copy of the materials (information or software) on ScaleVolt Store\'s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:')}
          </p>
          <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
            <li>{t('legal.terms.use.restriction1', 'modify or copy the materials')}</li>
            <li>{t('legal.terms.use.restriction2', 'use the materials for any commercial purpose or for any public display')}</li>
            <li>{t('legal.terms.use.restriction3', 'attempt to reverse engineer any software contained on the website')}</li>
            <li>{t('legal.terms.use.restriction4', 'remove any copyright or other proprietary notations from the materials')}</li>
          </ul>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#007bff', fontSize: '1.5rem', marginBottom: '15px' }}>
            {t('legal.terms.products.title', '3. Products and Services')}
          </h2>
          <p>
            {t('legal.terms.products.content', 'ScaleVolt Store provides solar energy products, EV charging stations, and related services. All products are subject to availability and may be discontinued without notice. Product specifications and pricing are subject to change.')}
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#007bff', fontSize: '1.5rem', marginBottom: '15px' }}>
            {t('legal.terms.orders.title', '4. Orders and Payment')}
          </h2>
          <p>
            {t('legal.terms.orders.content', 'By placing an order, you confirm that all information provided is accurate and complete. We reserve the right to refuse or cancel orders at our discretion. Payment is due at the time of order placement.')}
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#007bff', fontSize: '1.5rem', marginBottom: '15px' }}>
            {t('legal.terms.warranty.title', '5. Warranty and Returns')}
          </h2>
          <p>
            {t('legal.terms.warranty.content', 'Products come with manufacturer warranties as specified. Returns are accepted within 30 days for unused items in original packaging. Defective items will be replaced or refunded according to warranty terms.')}
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#007bff', fontSize: '1.5rem', marginBottom: '15px' }}>
            {t('legal.terms.privacy.title', '6. Privacy and Data Protection')}
          </h2>
          <p>
            {t('legal.terms.privacy.content', 'Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the website, to understand our practices regarding the collection and use of your personal information.')}
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#007bff', fontSize: '1.5rem', marginBottom: '15px' }}>
            {t('legal.terms.liability.title', '7. Limitation of Liability')}
          </h2>
          <p>
            {t('legal.terms.liability.content', 'In no event shall ScaleVolt Store or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.')}
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#007bff', fontSize: '1.5rem', marginBottom: '15px' }}>
            {t('legal.terms.changes.title', '8. Changes to Terms')}
          </h2>
          <p>
            {t('legal.terms.changes.content', 'ScaleVolt Store may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these Terms of Service.')}
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#007bff', fontSize: '1.5rem', marginBottom: '15px' }}>
            {t('legal.terms.contact.title', '9. Contact Information')}
          </h2>
          <p>
            {t('legal.terms.contact.content', 'If you have any questions about these Terms of Service, please contact us at:')}
          </p>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px',
            marginTop: '15px'
          }}>
            <p style={{ margin: '5px 0' }}>
              <strong>Email:</strong> scalevolt.info@gmail.com
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Phone:</strong> +380 96 747 79 13
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Address:</strong> просп. Валерія Лобановского 56 офіс, Київ, 01001, Україна
            </p>
          </div>
        </section>
      </div>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '40px',
        textAlign: 'center'
      }}>
        <p style={{ color: '#666', margin: '0' }}>
          {t('legal.terms.footer', 'By using our website, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.')}
        </p>
      </div>
    </div>
  );
};

export default LegalTermsView;