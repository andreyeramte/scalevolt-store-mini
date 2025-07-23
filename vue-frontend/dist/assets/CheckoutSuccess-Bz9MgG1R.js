import{e as j,c as b,r as n,d as v,j as e,L as k}from"./index-Cov9520u.js";const N=()=>{const[i]=j(),{t}=b(),[s,m]=n.useState(null),[c,h]=n.useState(""),[u,x]=n.useState(""),l=v(r=>r.clearCart);n.useEffect(()=>{var d;const r=i.get("orderId")||"ORDER-"+Date.now();h(r);const o=localStorage.getItem("orderData");if(o){const p=JSON.parse(o);m(p),x(((d=p.shippingInfo)==null?void 0:d.email)||"your-email@example.com"),localStorage.removeItem("orderData")}l()},[i,l]);const a=r=>r.toLocaleString("en-US"),g=r=>r==="express"?`${t("delivery.expressDelivery","Express Delivery")} (1-2 ${t("delivery.days","days")})`:`${t("delivery.standardDelivery","Standard Delivery")} (3-5 ${t("delivery.days","days")})`,f=r=>{switch(r){case"card":return"Credit/Debit Card";case"transfer":return"Bank Transfer";case"pod":return"Pay on Delivery";default:return"Credit/Debit Card"}},y=()=>{console.log("Tracking order:",c),alert("Order tracking feature will be available soon!")};return e.jsxs("div",{className:"success-view",children:[e.jsxs("div",{className:"success-container",children:[e.jsx("div",{className:"success-icon",children:e.jsxs("svg",{viewBox:"0 0 52 52",xmlns:"http://www.w3.org/2000/svg",children:[e.jsx("circle",{cx:"26",cy:"26",r:"25",fill:"#52c41a"}),e.jsx("path",{d:"M14,27.5 L21,34.5 L38,17.5",stroke:"white",strokeWidth:"4",fill:"none"})]})}),e.jsx("h1",{children:t("checkout.thankYou","Thank You for Your Order!")}),e.jsxs("p",{className:"order-number",children:["Order #",c]}),e.jsxs("p",{className:"success-message",children:[t("checkout.orderProcessed","Your order has been successfully processed. We've sent a confirmation email with all the details to")," ",u,"."]}),e.jsxs("div",{className:"order-details",children:[e.jsx("h2",{children:t("checkout.orderSummary","Order Summary")}),s?e.jsxs("div",{className:"summary-container",children:[e.jsxs("div",{className:"items-summary",children:[e.jsx("h3",{children:t("checkout.itemsOrdered","Items Ordered")}),s.items.map((r,o)=>e.jsxs("div",{className:"order-item",children:[e.jsxs("div",{className:"item-info",children:[e.jsx("p",{className:"item-name",children:r.name}),e.jsxs("p",{className:"item-quantity",children:["Qty: ",r.quantity]})]}),e.jsxs("p",{className:"item-price",children:[a(r.price*r.quantity)," грн"]})]},o))]}),e.jsxs("div",{className:"shipping-summary",children:[e.jsx("h3",{children:t("checkout.shippingInformation","Shipping Information")}),e.jsxs("p",{children:[s.shippingInfo.firstName," ",s.shippingInfo.lastName]}),e.jsx("p",{children:s.shippingInfo.address}),e.jsxs("p",{children:[s.shippingInfo.city,", ",s.shippingInfo.postalCode]}),e.jsx("p",{children:s.shippingInfo.country}),e.jsxs("p",{children:[e.jsxs("strong",{children:[t("checkout.shippingMethod","Shipping Method"),":"]})," ",g(s.shippingInfo.method)]})]}),e.jsxs("div",{className:"payment-summary",children:[e.jsx("h3",{children:t("checkout.paymentDetails","Payment Details")}),e.jsxs("p",{children:[e.jsxs("strong",{children:[t("checkout.paymentMethod","Payment Method"),":"]})," ",f(s.paymentMethod)]}),e.jsxs("div",{className:"total-details",children:[e.jsxs("div",{className:"total-row",children:[e.jsxs("span",{children:[t("cart.subtotal","Subtotal"),":"]}),e.jsxs("span",{children:[a(s.totals.subtotal)," грн"]})]}),e.jsxs("div",{className:"total-row",children:[e.jsxs("span",{children:[t("cart.tax","Tax"),":"]}),e.jsxs("span",{children:[a(s.totals.tax)," грн"]})]}),e.jsxs("div",{className:"total-row",children:[e.jsxs("span",{children:[t("cart.shipping","Shipping"),":"]}),e.jsxs("span",{children:[a(s.totals.shipping)," грн"]})]}),e.jsxs("div",{className:"total-row total",children:[e.jsxs("span",{children:[t("cart.total","Total"),":"]}),e.jsxs("span",{children:[a(s.totals.total)," грн"]})]})]})]})]}):e.jsx("div",{className:"loading-summary",children:e.jsx("p",{children:t("common.loading","Loading order details...")})})]}),e.jsxs("div",{className:"action-buttons",children:[e.jsx(k,{to:"/",className:"continue-button",children:t("checkout.continueShopping","Continue Shopping")}),e.jsx("button",{onClick:y,className:"track-button",children:t("checkout.trackOrder","Track Your Order")})]}),e.jsxs("div",{className:"support-section",children:[e.jsx("h3",{children:t("checkout.needHelp","Need Help?")}),e.jsx("p",{children:t("checkout.supportMessage","If you have any questions about your order, please contact our customer support:")}),e.jsx("a",{href:"mailto:support@scalevolt.ua",className:"support-link",children:"support@scalevolt.ua"}),e.jsxs("p",{children:[t("checkout.callUs","or call us at:")," ",e.jsx("a",{href:"tel:+380123456789",className:"support-link",children:"+38 (012) 345-67-89"})]})]})]}),e.jsx("style",{jsx:!0,children:`
        .success-view {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: 'Inter', sans-serif;
          color: #333;
        }

        .success-container {
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 40px;
          text-align: center;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 30px;
        }

        h1 {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 20px;
          color: #52c41a;
        }

        .order-number {
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 15px;
        }

        .success-message {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .order-details {
          margin: 40px 0;
          text-align: left;
        }

        h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 30px;
          text-align: center;
          color: #333;
        }

        h3 {
          font-size: 1.2rem;
          font-weight: 500;
          margin-bottom: 15px;
          color: #333;
        }

        .summary-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
        }

        .items-summary,
        .shipping-summary,
        .payment-summary {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #eee;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .item-info {
          flex: 1;
        }

        .item-name {
          font-weight: 500;
          margin-bottom: 5px;
          font-size: 1rem;
        }

        .item-quantity {
          color: #666;
          font-size: 0.9rem;
          margin: 0;
        }

        .item-price {
          font-weight: 600;
          font-size: 1rem;
          margin: 0;
        }

        .shipping-summary p,
        .payment-summary p {
          margin: 8px 0;
          line-height: 1.5;
        }

        .total-details {
          margin-top: 20px;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 5px 0;
        }

        .total-row.total {
          border-top: 1px solid #ddd;
          padding-top: 15px;
          margin-top: 15px;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .loading-summary {
          text-align: center;
          padding: 40px 0;
          color: #666;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin: 40px 0;
        }

        .continue-button,
        .track-button {
          padding: 12px 24px;
          font-size: 1rem;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
          text-decoration: none;
          border: none;
          cursor: pointer;
        }

        .continue-button {
          background-color: #52c41a;
          color: #ffffff;
        }

        .continue-button:hover {
          background-color: #46b314;
          transform: translateY(-1px);
        }

        .track-button {
          background-color: #fff;
          color: #333;
          border: 1px solid #d9d9d9;
        }

        .track-button:hover {
          background-color: #f5f5f5;
          border-color: #40a9ff;
        }

        .support-section {
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid #eee;
          text-align: center;
        }

        .support-section h3 {
          font-size: 1.3rem;
          margin-bottom: 15px;
          text-align: center;
        }

        .support-section p {
          margin: 10px 0;
          color: #666;
        }

        .support-link {
          color: #1890ff;
          text-decoration: none;
          font-weight: 500;
        }

        .support-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .success-container {
            padding: 30px 20px;
          }

          .summary-container {
            gap: 20px;
          }

          .action-buttons {
            flex-direction: column;
            gap: 15px;
          }

          .continue-button,
          .track-button {
            width: 100%;
          }

          .order-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .item-price {
            align-self: flex-end;
          }
        }

        @media (max-width: 576px) {
          h1 {
            font-size: 1.75rem;
          }

          .success-message {
            font-size: 1rem;
          }

          .items-summary,
          .shipping-summary,
          .payment-summary {
            padding: 15px;
          }
        }
      `})]})};export{N as default};
