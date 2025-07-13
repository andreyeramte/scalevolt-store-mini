import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const LegalTermsView = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('legal.termsAndConditions') + ' | SCALEVOLT';
  }, [t]);

  const getDocumentUrl = (filename) => {
    return `/documents/${filename}`;
  };

  return (
    <div className="legal-terms-container max-w-6xl mx-auto px-5 py-8 pt-24 font-sans">
      <h1 className="text-3xl font-bold mb-10 text-gray-800">
        {t('legal.termsAndConditions', 'Terms and Conditions')}
      </h1>
      
      {/* Rental Service Terms Section */}
      <section className="legal-section mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          {t('legal.rentalServiceTerms', 'Rental Service Terms')}
        </h2>
        <div className="blue-underline h-1 w-48 bg-blue-600 mb-5"></div>
        
        <ul className="terms-list space-y-4 pl-5">
          <li className="relative pl-5">
            <a 
              href={getDocumentUrl('rental-terms-uk.pdf')} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
            >
              {t('legal.ukraineRentalTerms', 'Ukraine Rental Terms')} ({t('common.ukrainian', 'Ukrainian')})
            </a>
          </li>
          <li className="relative pl-5">
            <a 
              href={getDocumentUrl('rental-terms-pl.pdf')} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
            >
              {t('legal.polandRentalTerms', 'Poland Rental Terms')} ({t('common.polish', 'Polish')})
            </a>
          </li>
        </ul>
      </section>
      
      {/* Purchase Terms Section */}
      <section className="legal-section mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          {t('legal.purchaseTerms', 'Purchase Terms')}
        </h2>
        <div className="blue-underline h-1 w-48 bg-blue-600 mb-5"></div>
        
        <ul className="terms-list space-y-4 pl-5">
          <li className="relative pl-5">
            <a 
              href={getDocumentUrl('purchase-terms-uk.pdf')} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
            >
              {t('legal.ukrainePurchaseTerms', 'Ukraine Purchase Terms')} ({t('common.ukrainian', 'Ukrainian')})
            </a>
          </li>
          <li className="relative pl-5">
            <a 
              href={getDocumentUrl('purchase-terms-pl.pdf')} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
            >
              {t('legal.polandPurchaseTerms', 'Poland Purchase Terms')} ({t('common.polish', 'Polish')})
            </a>
          </li>
        </ul>
      </section>
      
      {/* Payment Processing Terms */}
      <section className="legal-section mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          {t('legal.paymentTerms', 'Payment Processing Terms')}
        </h2>
        <div className="blue-underline h-1 w-48 bg-blue-600 mb-5"></div>
        
        <ul className="terms-list space-y-4 pl-5">
          <li className="relative pl-5">
            <a 
              href={getDocumentUrl('payment-terms-uk.pdf')} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
            >
              {t('legal.paymentTermsDoc', 'Payment Terms Document')} ({t('common.ukrainian', 'Ukrainian')})
            </a>
          </li>
          <li className="relative pl-5">
            <a 
              href={getDocumentUrl('payment-terms-pl.pdf')} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
            >
              {t('legal.paymentTermsDoc', 'Payment Terms Document')} ({t('common.polish', 'Polish')})
            </a>
          </li>
        </ul>
      </section>
      
      {/* Warranty Terms */}
      <section className="legal-section mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          {t('legal.warrantyTerms', 'Warranty Terms')}
        </h2>
        <div className="blue-underline h-1 w-48 bg-blue-600 mb-5"></div>
        
        <ul className="terms-list space-y-4 pl-5">
          <li className="relative pl-5">
            <a 
              href={getDocumentUrl('warranty-terms-uk.pdf')} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
            >
              {t('legal.warrantyTermsDoc', 'Warranty Terms Document')} ({t('common.ukrainian', 'Ukrainian')})
            </a>
          </li>
          <li className="relative pl-5">
            <a 
              href={getDocumentUrl('warranty-terms-pl.pdf')} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
            >
              {t('legal.warrantyTermsDoc', 'Warranty Terms Document')} ({t('common.polish', 'Polish')})
            </a>
          </li>
        </ul>
      </section>
      
      {/* Privacy Policy */}
      <section className="legal-section mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          {t('legal.privacyPolicy', 'Privacy Policy')}
        </h2>
        <div className="blue-underline h-1 w-48 bg-blue-600 mb-5"></div>
        
        <ul className="terms-list space-y-4 pl-5">
          <li className="relative pl-5">
            <Link 
              to="/privacy-policy"
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
            >
              {t('legal.viewPrivacyPolicy', 'View Privacy Policy')}
            </Link>
          </li>
        </ul>
      </section>
      
      {/* Corporate Information */}
      <section className="legal-section mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          {t('legal.corporateInfo', 'Corporate Information')}
        </h2>
        <div className="blue-underline h-1 w-48 bg-blue-600 mb-5"></div>
        
        <div className="corp-info bg-gray-100 p-5 rounded-lg">
          <p className="mb-2.5 leading-relaxed">
            <span className="font-medium">{t('legal.companyName', 'Company Name')}:</span> SCALEVOLT
          </p>
          <p className="mb-2.5 leading-relaxed">
            <span className="font-medium">{t('legal.address', 'Address')}:</span> {t('legal.companyAddress', 'Company Address')}
          </p>
          <p className="mb-2.5 leading-relaxed">
            <span className="font-medium">{t('legal.registrationNumber', 'Registration Number')}:</span> {t('legal.companyRegNumber', 'Company Registration Number')}
          </p>
          <p className="mb-2.5 leading-relaxed">
            <span className="font-medium">{t('legal.vatID', 'VAT ID')}:</span> {t('legal.companyVAT', 'Company VAT')}
          </p>
          <p className="mb-2.5 leading-relaxed">
            <span className="font-medium">{t('legal.email', 'Email')}:</span> scalevolt.info@gmail.com
          </p>
        </div>
      </section>
    </div>
  );
};

export default LegalTermsView;