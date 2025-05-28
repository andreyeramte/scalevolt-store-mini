import React, { useEffect } from 'react';

// Mock translation function - replace with your actual i18n solution
const t = (key) => {
  const translations = {
    'legal.termsAndConditions': 'Terms and Conditions',
    'legal.rentalServiceTerms': 'Rental Service Terms',
    'legal.ukraineRentalTerms': 'Ukraine Rental Terms',
    'legal.polandRentalTerms': 'Poland Rental Terms',
    'legal.purchaseTerms': 'Purchase Terms',
    'legal.ukrainePurchaseTerms': 'Ukraine Purchase Terms',
    'legal.polandPurchaseTerms': 'Poland Purchase Terms',
    'legal.paymentTerms': 'Payment Processing Terms',
    'legal.paymentTermsDoc': 'Payment Terms Document',
    'legal.warrantyTerms': 'Warranty Terms',
    'legal.warrantyTermsDoc': 'Warranty Terms Document',
    'legal.privacyPolicy': 'Privacy Policy',
    'legal.viewPrivacyPolicy': 'View Privacy Policy',
    'legal.corporateInfo': 'Corporate Information',
    'legal.companyName': 'Company Name',
    'legal.address': 'Address',
    'legal.companyAddress': '123 Business Street, Warsaw, Poland',
    'legal.registrationNumber': 'Registration Number',
    'legal.companyRegNumber': 'REG123456789',
    'legal.vatID': 'VAT ID',
    'legal.companyVAT': 'VAT987654321',
    'legal.email': 'Email',
    'common.ukrainian': 'Ukrainian',
    'common.polish': 'Polish'
  };
  return translations[key] || key;
};

const LegalTermsView = () => {
  const getDocumentUrl = (filename) => {
    return `/documents/${filename}`;
  };

  useEffect(() => {
    document.title = `${t('legal.termsAndConditions')} | SCALEVOLT`;
  }, []);

  const handlePrivacyPolicyClick = (e) => {
    e.preventDefault();
    // Replace with your actual routing logic
    console.log('Navigate to privacy policy');
  };

  return (
    <div className="legal-terms-container">
      <h1 className="page-title">{t('legal.termsAndConditions')}</h1>
      
      {/* Rental Service Terms Section */}
      <section className="legal-section">
        <h2>{t('legal.rentalServiceTerms')}</h2>
        <div className="blue-underline"></div>
        
        <ul className="terms-list">
          <li>
            <a href={getDocumentUrl('rental-terms-uk.pdf')} target="_blank" rel="noopener noreferrer">
              {t('legal.ukraineRentalTerms')} ({t('common.ukrainian')})
            </a>
          </li>
          <li>
            <a href={getDocumentUrl('rental-terms-pl.pdf')} target="_blank" rel="noopener noreferrer">
              {t('legal.polandRentalTerms')} ({t('common.polish')})
            </a>
          </li>
        </ul>
      </section>
      
      {/* Purchase Terms Section */}
      <section className="legal-section">
        <h2>{t('legal.purchaseTerms')}</h2>
        <div className="blue-underline"></div>
        
        <ul className="terms-list">
          <li>
            <a href={getDocumentUrl('purchase-terms-uk.pdf')} target="_blank" rel="noopener noreferrer">
              {t('legal.ukrainePurchaseTerms')} ({t('common.ukrainian')})
            </a>
          </li>
          <li>
            <a href={getDocumentUrl('purchase-terms-pl.pdf')} target="_blank" rel="noopener noreferrer">
              {t('legal.polandPurchaseTerms')} ({t('common.polish')})
            </a>
          </li>
        </ul>
      </section>
      
      {/* Payment Processing Terms */}
      <section className="legal-section">
        <h2>{t('legal.paymentTerms')}</h2>
        <div className="blue-underline"></div>
        
        <ul className="terms-list">
          <li>
            <a href={getDocumentUrl('payment-terms-uk.pdf')} target="_blank" rel="noopener noreferrer">
              {t('legal.paymentTermsDoc')} ({t('common.ukrainian')})
            </a>
          </li>
          <li>
            <a href={getDocumentUrl('payment-terms-pl.pdf')} target="_blank" rel="noopener noreferrer">
              {t('legal.paymentTermsDoc')} ({t('common.polish')})
            </a>
          </li>
        </ul>
      </section>
      
      {/* Warranty Terms */}
      <section className="legal-section">
        <h2>{t('legal.warrantyTerms')}</h2>
        <div className="blue-underline"></div>
        
        <ul className="terms-list">
          <li>
            <a href={getDocumentUrl('warranty-terms-uk.pdf')} target="_blank" rel="noopener noreferrer">
              {t('legal.warrantyTermsDoc')} ({t('common.ukrainian')})
            </a>
          </li>
          <li>
            <a href={getDocumentUrl('warranty-terms-pl.pdf')} target="_blank" rel="noopener noreferrer">
              {t('legal.warrantyTermsDoc')} ({t('common.polish')})
            </a>
          </li>
        </ul>
      </section>
      
      {/* Privacy Policy */}
      <section className="legal-section">
        <h2>{t('legal.privacyPolicy')}</h2>
        <div className="blue-underline"></div>
        
        <ul className="terms-list">
          <li>
            <a href="#" onClick={handlePrivacyPolicyClick}>
              {t('legal.viewPrivacyPolicy')}
            </a>
          </li>
        </ul>
      </section>
      
      {/* Corporate Information */}
      <section className="legal-section">
        <h2>{t('legal.corporateInfo')}</h2>
        <div className="blue-underline"></div>
        
        <div className="corp-info">
          <p>{t('legal.companyName')}: SCALEVOLT</p>
          <p>{t('legal.address')}: {t('legal.companyAddress')}</p>
          <p>{t('legal.registrationNumber')}: {t('legal.companyRegNumber')}</p>
          <p>{t('legal.vatID')}: {t('legal.companyVAT')}</p>
          <p>{t('legal.email')}: scalevolt.info@gmail.com</p>
        </div>
      </section>

      <style jsx>{`
        .legal-terms-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px 20px;
          padding-top: 100px;
          font-family: Arial, sans-serif;
        }
        
        .page-title {
          font-size: 32px;
          margin-bottom: 40px;
          color: #333;
        }
        
        .legal-section {
          margin-bottom: 40px;
        }
        
        .legal-section h2 {
          font-size: 24px;
          color: #333;
          margin-bottom: 10px;
        }
        
        .blue-underline {
          height: 4px;
          width: 200px;
          background-color: #0066cc;
          margin-bottom: 20px;
        }
        
        .terms-list {
          list-style-type: none;
          padding-left: 20px;
        }
        
        .terms-list li {
          margin-bottom: 15px;
          position: relative;
          padding-left: 20px;
        }
        
        .terms-list li::before {
          content: "•";
          color: #0066cc;
          font-size: 20px;
          position: absolute;
          left: 0;
          top: -2px;
        }
        
        .terms-list a {
          color: #0066cc;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        
        .terms-list a:hover {
          color: #004799;
          text-decoration: underline;
        }
        
        .corp-info {
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
        }
        
        .corp-info p {
          margin: 10px 0;
          line-height: 1.5;
        }
        
        @media (max-width: 768px) {
          .page-title {
            font-size: 28px;
          }
          
          .legal-section h2 {
            font-size: 22px;
          }
        }
        
        @media (max-width: 480px) {
          .page-title {
            font-size: 24px;
          }
          
          .legal-section h2 {
            font-size: 20px;
          }
          
          .terms-list li {
            padding-left: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default LegalTermsView;