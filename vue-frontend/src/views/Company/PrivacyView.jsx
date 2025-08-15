import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyView = () => {
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
          {t('privacy.title', 'Privacy Policy')}
        </h1>
        <p style={{ 
          color: '#666', 
          fontSize: '1.1rem',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          {t('privacy.subtitle', 'Last updated: August 2024')}
        </p>
      </div>

      <div style={{ lineHeight: '1.8', color: '#333' }}>
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#007bff', fontSize: '1.5rem', marginBottom: '15px' }}>
            {t('privacy.introduction.title', '1. Introduction')}
          </h2>
          <p>
            {t('privacy.introduction.content', 'ScaleVolt Store ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.')}
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#007bff', fontSize: '1.5rem', marginBottom: '15px' }}>
            {t('privacy.collection.title', '2. Information We Collect')}
          </h2>
          <h3 style={{ color: '#333', fontSize: '1.2rem', marginBottom: '10px' }}>
            {t('privacy.collection.personal.title', 'Personal Information')}
          </h3>
          <p>
            {t('privacy.collection.personal.content', 'We may collect personal information that you voluntarily provide to us when you:')}
          </p>
          <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
            <li>{t('privacy.collection.personal.item1', 'Create an account or register on our website')}</li>
            <li>{t('privacy.collection.personal.item2', 'Place orders for products or services')}</li>
            <li>{t('privacy.collection.personal.item3', 'Contact our customer support team')}</li>
            <li>{t('privacy.collection.personal.item4', 'Subscribe to our newsletter or marketing communications')}</li>
          </ul>
          
          <h3 style={{ color: '#333', fontSize: '1.2rem', marginBottom: '10px', marginTop: '20px' }}>
            {t('privacy.collection.automatic.title', 'Automatically Collected Information')}
          </h3>
          <p>
            {t('privacy.collection.automatic.content', 'We automatically collect certain information when you visit our website, including:')}
          </p>
          <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
            <li>{t('privacy.collection.automatic.item1', 'IP address and location data')}</li>
            <li>{t('privacy.collection.automatic.item2', 'Browser type and version')}</li>
            <li>{t('privacy.collection.automatic.item3', 'Pages visited and time spent on each page')}</li>
            <li>{t('privacy.collection.automatic.item4', 'Device information and operating system')}</li>
          </ul>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#007bff', fontSize: '1.5rem', marginBottom: '15px' }}>
            {t('privacy.use.title', '3. How We Use Your Information')}
          </h2>
          <p>
            {t('privacy.use.content', 'We use the information we collect to:')}
          </p>
          <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
            <li>{t('privacy.use.item1', 'Process and fulfill your orders')}</li>
            <li>{t('privacy.use.item2', 'Provide customer support and respond to inquiries')}</li>
            <li>{t('privacy.use.item3', 'Send you important updates about your orders')}</li>
            <li>{t('privacy.use.item4', 'Improve our website and services')}</li>
            <li>{t('privacy.use.item5', 'Send marketing communications (with your consent)')}</li>
            <li>{t('privacy.use.item6', 'Comply with legal obligations')}</li>
          </ul>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#007bff', fontSize: '1.5rem', marginBottom: '15px' }}>
            {t('privacy.sharing.title', '4. Information Sharing and Disclosure')}
          </h2>
          <p>
            {t('privacy.sharing.content', 'We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:')}
          </p>
          <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
            <li>{t('privacy.sharing.item1', 'With your explicit consent')}</li>
            <li>{t('privacy.sharing.item2', 'To process payments (payment processors)')}</li>
            <li>{t('privacy.sharing.item3', 'To fulfill orders (shipping partners)')}</li>
            <li>{t('privacy.sharing.item4', 'To comply with legal requirements')}</li>
            <li>{t('privacy.sharing.item5', 'To protect our rights and safety')}</li>
          </ul>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#007bff', fontSize: '1.5rem', marginBottom: '15px' }}>
            {t('privacy.security.title', '5. Data Security')}
          </h2>
          <p>
            {t('privacy.security.content', 'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.')}
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#007bff', fontSize: '1.5rem', marginBottom: '15px' }}>
            {t('privacy.cookies.title', '6. Cookies and Tracking Technologies')}
          </h2>
          <p>
            {t('privacy.cookies.content', 'We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand where our visitors are coming from. You can control cookie settings through your browser preferences.')}
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#007bff', fontSize: '1.5rem', marginBottom: '15px' }}>
            {t('privacy.rights.title', '7. Your Rights')}
          </h2>
          <p>
            {t('privacy.rights.content', 'You have the right to:')}
          </p>
          <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
            <li>{t('privacy.rights.item1', 'Access your personal information')}</li>
            <li>{t('privacy.rights.item2', 'Correct inaccurate information')}</li>
            <li>{t('privacy.rights.item3', 'Request deletion of your data')}</li>
            <li>{t('privacy.rights.item4', 'Opt-out of marketing communications')}</li>
            <li>{t('privacy.rights.item5', 'Lodge a complaint with supervisory authorities')}</li>
          </ul>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#007bff', fontSize: '1.5rem', marginBottom: '15px' }}>
            {t('privacy.children.title', '8. Children\'s Privacy')}
          </h2>
          <p>
            {t('privacy.children.content', 'Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.')}
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#007bff', fontSize: '1.5rem', marginBottom: '15px' }}>
            {t('privacy.changes.title', '9. Changes to This Policy')}
          </h2>
          <p>
            {t('privacy.changes.content', 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.')}
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#007bff', fontSize: '1.5rem', marginBottom: '15px' }}>
            {t('privacy.contact.title', '10. Contact Us')}
          </h2>
          <p>
            {t('privacy.contact.content', 'If you have any questions about this Privacy Policy, please contact us at:')}
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
          {t('privacy.footer', 'By using our website, you consent to the collection and use of information in accordance with this Privacy Policy.')}
        </p>
      </div>
    </div>
  );
};

export default PrivacyView;