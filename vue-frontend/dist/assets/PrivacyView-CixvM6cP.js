import{r as n,j as e}from"./index-Cov9520u.js";const l=r=>({"legal.termsAndConditions":"Terms and Conditions","legal.rentalServiceTerms":"Rental Service Terms","legal.ukraineRentalTerms":"Ukraine Rental Terms","legal.polandRentalTerms":"Poland Rental Terms","legal.purchaseTerms":"Purchase Terms","legal.ukrainePurchaseTerms":"Ukraine Purchase Terms","legal.polandPurchaseTerms":"Poland Purchase Terms","legal.paymentTerms":"Payment Processing Terms","legal.paymentTermsDoc":"Payment Terms Document","legal.warrantyTerms":"Warranty Terms","legal.warrantyTermsDoc":"Warranty Terms Document","legal.privacyPolicy":"Privacy Policy","legal.viewPrivacyPolicy":"View Privacy Policy","legal.corporateInfo":"Corporate Information","legal.companyName":"Company Name","legal.address":"Address","legal.companyAddress":"123 Business Street, Warsaw, Poland","legal.registrationNumber":"Registration Number","legal.companyRegNumber":"REG123456789","legal.vatID":"VAT ID","legal.companyVAT":"VAT987654321","legal.email":"Email","common.ukrainian":"Ukrainian","common.polish":"Polish"})[r]||r,t=()=>{const r=a=>`/documents/${a}`;n.useEffect(()=>{document.title=`${l("legal.termsAndConditions")} | SCALEVOLT`},[]);const s=a=>{a.preventDefault(),console.log("Navigate to privacy policy")};return e.jsxs("div",{className:"legal-terms-container",children:[e.jsx("h1",{className:"page-title",children:l("legal.termsAndConditions")}),e.jsxs("section",{className:"legal-section",children:[e.jsx("h2",{children:l("legal.rentalServiceTerms")}),e.jsx("div",{className:"blue-underline"}),e.jsxs("ul",{className:"terms-list",children:[e.jsx("li",{children:e.jsxs("a",{href:r("rental-terms-uk.pdf"),target:"_blank",rel:"noopener noreferrer",children:[l("legal.ukraineRentalTerms")," (",l("common.ukrainian"),")"]})}),e.jsx("li",{children:e.jsxs("a",{href:r("rental-terms-pl.pdf"),target:"_blank",rel:"noopener noreferrer",children:[l("legal.polandRentalTerms")," (",l("common.polish"),")"]})})]})]}),e.jsxs("section",{className:"legal-section",children:[e.jsx("h2",{children:l("legal.purchaseTerms")}),e.jsx("div",{className:"blue-underline"}),e.jsxs("ul",{className:"terms-list",children:[e.jsx("li",{children:e.jsxs("a",{href:r("purchase-terms-uk.pdf"),target:"_blank",rel:"noopener noreferrer",children:[l("legal.ukrainePurchaseTerms")," (",l("common.ukrainian"),")"]})}),e.jsx("li",{children:e.jsxs("a",{href:r("purchase-terms-pl.pdf"),target:"_blank",rel:"noopener noreferrer",children:[l("legal.polandPurchaseTerms")," (",l("common.polish"),")"]})})]})]}),e.jsxs("section",{className:"legal-section",children:[e.jsx("h2",{children:l("legal.paymentTerms")}),e.jsx("div",{className:"blue-underline"}),e.jsxs("ul",{className:"terms-list",children:[e.jsx("li",{children:e.jsxs("a",{href:r("payment-terms-uk.pdf"),target:"_blank",rel:"noopener noreferrer",children:[l("legal.paymentTermsDoc")," (",l("common.ukrainian"),")"]})}),e.jsx("li",{children:e.jsxs("a",{href:r("payment-terms-pl.pdf"),target:"_blank",rel:"noopener noreferrer",children:[l("legal.paymentTermsDoc")," (",l("common.polish"),")"]})})]})]}),e.jsxs("section",{className:"legal-section",children:[e.jsx("h2",{children:l("legal.warrantyTerms")}),e.jsx("div",{className:"blue-underline"}),e.jsxs("ul",{className:"terms-list",children:[e.jsx("li",{children:e.jsxs("a",{href:r("warranty-terms-uk.pdf"),target:"_blank",rel:"noopener noreferrer",children:[l("legal.warrantyTermsDoc")," (",l("common.ukrainian"),")"]})}),e.jsx("li",{children:e.jsxs("a",{href:r("warranty-terms-pl.pdf"),target:"_blank",rel:"noopener noreferrer",children:[l("legal.warrantyTermsDoc")," (",l("common.polish"),")"]})})]})]}),e.jsxs("section",{className:"legal-section",children:[e.jsx("h2",{children:l("legal.privacyPolicy")}),e.jsx("div",{className:"blue-underline"}),e.jsx("ul",{className:"terms-list",children:e.jsx("li",{children:e.jsx("a",{href:"#",onClick:s,children:l("legal.viewPrivacyPolicy")})})})]}),e.jsxs("section",{className:"legal-section",children:[e.jsx("h2",{children:l("legal.corporateInfo")}),e.jsx("div",{className:"blue-underline"}),e.jsxs("div",{className:"corp-info",children:[e.jsxs("p",{children:[l("legal.companyName"),": SCALEVOLT"]}),e.jsxs("p",{children:[l("legal.address"),": ",l("legal.companyAddress")]}),e.jsxs("p",{children:[l("legal.registrationNumber"),": ",l("legal.companyRegNumber")]}),e.jsxs("p",{children:[l("legal.vatID"),": ",l("legal.companyVAT")]}),e.jsxs("p",{children:[l("legal.email"),": scalevolt.info@gmail.com"]})]})]}),e.jsx("style",{jsx:!0,children:`
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
      `})]})};export{t as default};
