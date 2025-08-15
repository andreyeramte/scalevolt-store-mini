import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const FAQView = () => {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqData = [
    {
      question: t('faq.shipping.question', 'How long does shipping take?'),
      answer: t('faq.shipping.answer', 'Shipping typically takes 3-5 business days for domestic orders and 7-14 days for international orders. Express shipping options are available for faster delivery.')
    },
    {
      question: t('faq.warranty.question', 'What is your warranty policy?'),
      answer: t('faq.warranty.answer', 'We offer a standard 2-year warranty on all products. Extended warranty options are available for an additional fee. Please contact our support team for warranty claims.')
    },
    {
      question: t('faq.returns.question', 'Can I return my purchase?'),
      answer: t('faq.returns.answer', 'Yes, we accept returns within 30 days of purchase for unused items in original packaging. Return shipping costs are the responsibility of the customer unless the item is defective.')
    },
    {
      question: t('faq.installation.question', 'Do you provide installation services?'),
      answer: t('faq.installation.answer', 'Yes, we offer professional installation services for solar panels and EV charging stations. Our certified technicians ensure proper installation and setup.')
    },
    {
      question: t('faq.payment.question', 'What payment methods do you accept?'),
      answer: t('faq.payment.answer', 'We accept all major credit cards, PayPal, bank transfers, and cash on delivery for local orders. Financing options are also available for larger purchases.')
    },
    {
      question: t('faq.support.question', 'How can I get technical support?'),
      answer: t('faq.support.answer', 'Our technical support team is available via phone, email, and live chat during business hours. We also provide comprehensive documentation and video tutorials for all products.')
    }
  ];

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
          {t('faq.title', 'Frequently Asked Questions')}
        </h1>
        <p style={{ 
          color: '#666', 
          fontSize: '1.1rem',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          {t('faq.subtitle', 'Find answers to common questions about our products and services')}
        </p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        {faqData.map((item, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              marginBottom: '15px',
              overflow: 'hidden',
              backgroundColor: 'white'
            }}
          >
            <button
              onClick={() => toggleItem(index)}
              style={{
                width: '100%',
                padding: '20px',
                backgroundColor: openItems.has(index) ? '#f8f9fa' : 'white',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '1.1rem',
                fontWeight: '500',
                color: '#333',
                transition: 'background-color 0.3s ease'
              }}
            >
              <span>{item.question}</span>
              <span style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#007bff',
                transition: 'transform 0.3s ease',
                transform: openItems.has(index) ? 'rotate(45deg)' : 'rotate(0deg)'
              }}>
                +
              </span>
            </button>
            {openItems.has(index) && (
              <div style={{
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderTop: '1px solid #e0e0e0',
                color: '#666',
                lineHeight: '1.6'
              }}>
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '30px',
        borderRadius: '10px',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <h3 style={{ color: '#333', marginBottom: '15px' }}>
          {t('faq.contact.title', 'Still have questions?')}
        </h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          {t('faq.contact.subtitle', 'Our customer support team is here to help you with any questions or concerns.')}
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
            {t('faq.contact.email', 'Email Support')}
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
            {t('faq.contact.phone', 'Call Us')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQView; 