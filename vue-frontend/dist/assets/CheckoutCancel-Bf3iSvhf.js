import{c as d,u as m,r as s,j as e,L as h}from"./index-9GWEwC6O.js";const u=()=>{const i=d(),{t}=m(),[a,r]=s.useState([]);s.useEffect(()=>{const n=JSON.parse(localStorage.getItem("cartItems")||"[]");r(n)},[]);const l=s.useMemo(()=>a.reduce((n,o)=>n+o.price*o.quantity,0),[a]),c=n=>n.toLocaleString("en-US"),p=()=>{i("/checkout")};return e.jsxs("div",{className:"cancel-view",children:[e.jsxs("div",{className:"cancel-container",children:[e.jsx("div",{className:"cancel-icon",children:e.jsxs("svg",{viewBox:"0 0 52 52",xmlns:"http://www.w3.org/2000/svg",children:[e.jsx("circle",{cx:"26",cy:"26",r:"25",fill:"#ff4d4f"}),e.jsx("path",{d:"M16,16 L36,36 M36,16 L16,36",stroke:"white",strokeWidth:"4"})]})}),e.jsx("h1",{children:t("checkout.paymentCancelled","Payment Cancelled")}),e.jsx("p",{className:"cancel-message",children:t("checkout.cancelMessage","Your payment was cancelled. Don't worry, no charges were made to your account. Your items are still in your cart.")}),e.jsxs("div",{className:"cart-summary",children:[e.jsx("h2",{children:t("cart.yourCart","Your Cart")}),a.length>0?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"cart-items",children:a.map(n=>e.jsxs("div",{className:"cart-item",children:[e.jsx("p",{className:"item-name",children:n.name}),e.jsxs("div",{className:"item-details",children:[e.jsxs("span",{className:"item-quantity",children:["Qty: ",n.quantity]}),e.jsxs("span",{className:"item-subtotal",children:[c(n.price*n.quantity)," грн"]})]})]},n.id))}),e.jsxs("div",{className:"cart-total",children:[e.jsxs("span",{children:[t("cart.total","Total"),":"]}),e.jsxs("span",{children:[c(l)," грн"]})]})]}):e.jsx("div",{className:"empty-cart-message",children:e.jsx("p",{children:t("cart.empty","Your cart is empty")})})]}),e.jsxs("div",{className:"help-section",children:[e.jsx("h3",{children:t("checkout.needHelp","Need Help?")}),e.jsxs("div",{className:"help-content",children:[e.jsxs("div",{className:"help-item",children:[e.jsx("div",{className:"help-icon",children:e.jsx("svg",{width:"36",height:"36",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z",fill:"#52c41a"})})}),e.jsxs("div",{children:[e.jsx("h4",{children:t("checkout.paymentIssues","Payment Issues")}),e.jsx("p",{children:t("checkout.paymentIssuesDesc","Having trouble with payment? Try a different payment method or contact your bank.")}),e.jsx("a",{href:"mailto:support@scalevolt.ua",className:"contact-link",children:t("checkout.contactSupport","Contact Support")})]})]}),e.jsxs("div",{className:"help-item",children:[e.jsx("div",{className:"help-icon",children:e.jsx("svg",{width:"36",height:"36",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",fill:"#1890ff"})})}),e.jsxs("div",{children:[e.jsx("h4",{children:t("checkout.emailSupport","Email Support")}),e.jsx("p",{children:t("checkout.emailSupportDesc","Send us an email and we'll respond within 24 hours.")}),e.jsx("a",{href:"mailto:support@scalevolt.ua",className:"contact-link",children:"support@scalevolt.ua"})]})]}),e.jsxs("div",{className:"help-item",children:[e.jsx("div",{className:"help-icon",children:e.jsx("svg",{width:"36",height:"36",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",fill:"#ff4d4f"})})}),e.jsxs("div",{children:[e.jsx("h4",{children:t("checkout.phoneSupport","Phone Support")}),e.jsx("p",{children:t("checkout.phoneSupportDesc","Call us directly for immediate assistance.")}),e.jsx("a",{href:"tel:+380123456789",className:"contact-link",children:"+38 (012) 345-67-89"})]})]})]})]}),e.jsxs("div",{className:"action-buttons",children:[e.jsx("button",{onClick:p,className:"retry-button",children:t("checkout.retryPayment","Retry Payment")}),e.jsx(h,{to:"/",className:"continue-button",children:t("checkout.continueShopping","Continue Shopping")})]}),e.jsxs("div",{className:"payment-methods",children:[e.jsx("p",{children:t("checkout.acceptedPayments","We accept the following payment methods:")}),e.jsxs("div",{className:"payment-icons",children:[e.jsx("span",{className:"payment-icon",children:"Visa"}),e.jsx("span",{className:"payment-icon",children:"Mastercard"}),e.jsx("span",{className:"payment-icon",children:"PayPal"}),e.jsx("span",{className:"payment-icon",children:"Bank Transfer"})]})]})]}),e.jsx("style",{jsx:!0,children:`
        .cancel-view {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: 'Inter', sans-serif;
          color: #333;
        }

        .cancel-container {
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 40px;
          text-align: center;
        }

        .cancel-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 30px;
        }

        h1 {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 20px;
          color: #ff4d4f;
        }

        .cancel-message {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .cart-summary {
          margin: 0 auto 40px;
          max-width: 600px;
          text-align: left;
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 20px;
        }

        h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 20px;
          text-align: center;
        }

        .cart-items {
          margin-top: 20px;
        }

        .cart-item {
          padding: 15px 0;
          border-bottom: 1px solid #eee;
        }

        .cart-item:last-child {
          border-bottom: none;
        }

        .item-name {
          font-weight: 500;
          margin-bottom: 5px;
        }

        .item-details {
          display: flex;
          justify-content: space-between;
          color: #666;
          font-size: 0.95rem;
        }

        .item-subtotal {
          font-weight: 500;
          color: #333;
        }

        .cart-total {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px dashed #ddd;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .empty-cart-message {
          text-align: center;
          padding: 20px 0;
          color: #999;
        }

        .help-section {
          margin: 40px 0;
          text-align: left;
        }

        h3 {
          font-size: 1.3rem;
          font-weight: 500;
          margin-bottom: 20px;
          text-align: center;
        }

        .help-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .help-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 8px;
        }

        .help-icon {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
        }

        h4 {
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 10px;
        }

        .help-item p {
          margin-bottom: 10px;
          color: #666;
          line-height: 1.5;
        }

        .contact-link {
          display: inline-block;
          margin-top: 5px;
          color: #1890ff;
          text-decoration: none;
          font-weight: 500;
        }

        .contact-link:hover {
          text-decoration: underline;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin: 40px 0;
        }

        .retry-button, .continue-button {
          padding: 12px 24px;
          font-size: 1rem;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
          text-decoration: none;
          border: none;
          cursor: pointer;
        }

        .retry-button {
          background-color: #ff4d4f;
          color: #ffffff;
        }

        .retry-button:hover {
          background-color: #d9363e;
          transform: translateY(-1px);
        }

        .continue-button {
          background-color: #fff;
          color: #333;
          border: 1px solid #d9d9d9;
        }

        .continue-button:hover {
          background-color: #f5f5f5;
          border-color: #40a9ff;
        }

        .payment-methods {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .payment-methods p {
          margin-bottom: 15px;
          color: #999;
        }

        .payment-icons {
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .payment-icon {
          display: inline-block;
          padding: 8px 16px;
          background-color: #f5f5f5;
          border-radius: 6px;
          font-size: 0.9rem;
          color: #666;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .cancel-container {
            padding: 30px 20px;
          }
          
          .help-content {
            grid-template-columns: 1fr;
          }
          
          .action-buttons {
            flex-direction: column;
            gap: 15px;
          }
          
          .retry-button, .continue-button {
            width: 100%;
          }

          .payment-icons {
            justify-content: center;
          }
        }

        @media (max-width: 576px) {
          h1 {
            font-size: 1.75rem;
          }

          .cancel-message {
            font-size: 1rem;
          }

          .help-item {
            flex-direction: column;
            text-align: center;
          }

          .help-icon {
            align-self: center;
          }
        }
      `})]})};export{u as default};
