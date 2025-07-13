import{c as Q,u as Z,g as ee,r as c,B as j,j as e}from"./index-9GWEwC6O.js";var U="basil",te=function(t){return t===3?"v3":t},_="https://js.stripe.com",re="".concat(_,"/").concat(U,"/stripe.js"),se=/^https:\/\/js\.stripe\.com\/v3\/?(\?.*)?$/,ne=/^https:\/\/js\.stripe\.com\/(v3|[a-z]+)\/stripe\.js(\?.*)?$/;var oe=function(t){return se.test(t)||ne.test(t)},ie=function(){for(var t=document.querySelectorAll('script[src^="'.concat(_,'"]')),n=0;n<t.length;n++){var a=t[n];if(oe(a.src))return a}return null},R=function(t){var n="",a=document.createElement("script");a.src="".concat(re).concat(n);var s=document.head||document.body;if(!s)throw new Error("Expected document.body not to be null. Stripe.js requires a <body> element.");return s.appendChild(a),a},ae=function(t,n){!t||!t._registerWrapper||t._registerWrapper({name:"stripe-js",version:"7.4.0",startTime:n})},b=null,C=null,P=null,de=function(t){return function(n){t(new Error("Failed to load Stripe.js",{cause:n}))}},ce=function(t,n){return function(){window.Stripe?t(window.Stripe):n(new Error("Stripe.js not available"))}},le=function(t){return b!==null?b:(b=new Promise(function(n,a){if(typeof window>"u"||typeof document>"u"){n(null);return}if(window.Stripe){n(window.Stripe);return}try{var s=ie();if(!(s&&t)){if(!s)s=R(t);else if(s&&P!==null&&C!==null){var p;s.removeEventListener("load",P),s.removeEventListener("error",C),(p=s.parentNode)===null||p===void 0||p.removeChild(s),s=R(t)}}P=ce(n,a),C=de(a),s.addEventListener("load",P),s.addEventListener("error",C)}catch(l){a(l);return}}),b.catch(function(n){return b=null,Promise.reject(n)}))},pe=function(t,n,a){if(t===null)return null;var s=n[0],p=s.match(/^pk_test/),l=te(t.version),k=U;p&&l!==k&&console.warn("Stripe.js@".concat(l," was loaded on the page, but @stripe/stripe-js@").concat("7.4.0"," expected Stripe.js@").concat(k,". This may result in unexpected behavior. For more information, see https://docs.stripe.com/sdks/stripejs-versioning"));var v=t.apply(void 0,n);return ae(v,a),v},N,$=!1,B=function(){return N||(N=le(null).catch(function(t){return N=null,Promise.reject(t)}),N)};Promise.resolve().then(function(){return B()}).catch(function(d){$||console.warn(d)});var ue=function(){for(var t=arguments.length,n=new Array(t),a=0;a<t;a++)n[a]=arguments[a];$=!0;var s=Date.now();return B().then(function(p){return pe(p,n,s)})};const he=()=>{const d=Q(),{t,i18n:n}=Z(),a=ee(),[s,p]=c.useState(1),[l,k]=c.useState([]),[v,V]=c.useState([]),[D,G]=c.useState(-1),[i,E]=c.useState({firstName:"",lastName:"",email:"",phone:"",address:"",city:"",postalCode:"",country:n.language==="pl"?"Poland":"Ukraine",method:"standard"}),[f,A]=c.useState("card");c.useEffect(()=>{const r=JSON.parse(localStorage.getItem("cartItems")||"[]");if(k(r),r.length===0){j.error(t("cart.emptyCartError","Your cart is empty")),d("/cart");return}const o=a.currentUser;if(o){const g=o.displayName?o.displayName.split(" "):["",""];E(T=>({...T,firstName:g[0]||"",lastName:g.slice(1).join(" ")||"",email:o.email||""}));const h=[{id:"addr1",label:"Home",type:"shipping",fullName:"Ivan Petrenko",street:"Khreshchatyk Street 12",apartment:"Apt 45",city:"Kyiv",postalCode:"01001",country:n.language==="pl"?"Poland":"Ukraine",phone:"+380991234567",isDefault:!0},{id:"addr2",label:"Office",type:"shipping",fullName:"Ivan Petrenko",street:"Business Center",apartment:"Floor 3, Office 302",city:"Kyiv",postalCode:"01004",country:n.language==="pl"?"Poland":"Ukraine",phone:"+380991234567",isDefault:!1}];V(h);const x=h.findIndex(T=>T.isDefault);x>=0&&q(x)}},[a,d,t,n.language]);const u=c.useMemo(()=>l.reduce((r,o)=>r+o.price*o.quantity,0),[l]),J=c.useMemo(()=>l.reduce((r,o)=>r+o.quantity,0),[l]),I=c.useMemo(()=>u>5e3?0:200,[u]),M=c.useMemo(()=>u>1e4?0:350,[u]),S=c.useMemo(()=>i.method==="express"?M:I,[i.method,M,I]),w=c.useMemo(()=>u*.2,[u]),F=c.useMemo(()=>{let r=u+w+S;return f==="pod"&&(r+=50),r},[u,w,S,f]),y=r=>r.toLocaleString("en-US"),q=r=>{G(r);const o=v[r],g=o.fullName.split(" ");E(h=>({...h,firstName:g[0]||"",lastName:g.slice(1).join(" ")||"",phone:o.phone||"",address:`${o.street}, ${o.apartment}`,city:o.city||"",postalCode:o.postalCode||"",country:o.country||"Ukraine"}))},L=()=>{s<3&&(p(s+1),window.scrollTo(0,0))},O=()=>{s>1&&(p(s-1),window.scrollTo(0,0))},z=r=>{p(r),window.scrollTo(0,0)},K=()=>{d("/cart")},W=()=>i.method==="express"?`${t("delivery.expressDelivery","Express Delivery")} (1-2 ${t("delivery.days","days")})`:`${t("delivery.standardDelivery","Standard Delivery")} (3-5 ${t("delivery.days","days")})`,X=()=>{switch(f){case"card":return"Credit/Debit Card";case"transfer":return"Bank Transfer";case"pod":return"Pay on Delivery";default:return"Credit/Debit Card"}},Y=async()=>{if(l.length===0){j.error(t("cart.emptyCartError","Cart is empty"));return}try{j.info("Processing your order...");const r=await ue("YOUR_PUBLISHABLE_KEY"),o={items:l.map(x=>({id:x.id,name:x.name,price:x.price,quantity:x.quantity})),shippingInfo:{...i},paymentMethod:f,totals:{subtotal:u,tax:w,shipping:S,total:F}},h=await(await fetch("http://localhost:4242/create-checkout-session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)})).json();if(h.id)if(f==="card"){const x=await r.redirectToCheckout({sessionId:h.id});x.error&&j.error(x.error.message)}else localStorage.setItem("orderData",JSON.stringify(o)),d(`/checkout/success?orderId=${h.orderId}`);else h.url?window.location.href=h.url:j.error("Unable to process your order. Please try again.")}catch(r){console.error("Checkout error:",r),j.error("An error occurred during checkout. Please try again.")}},H=r=>{r.preventDefault(),L()},m=(r,o)=>{E(g=>({...g,[r]:o}))};return e.jsxs("div",{className:"checkout-view",children:[e.jsx("h1",{children:t("checkout.shippingAddress","Shipping Address")}),e.jsxs("div",{className:"checkout-container",children:[e.jsxs("div",{className:"checkout-steps",children:[e.jsxs("div",{className:`step ${s===1?"active":""}`,children:["1. ",t("checkout.shippingAddress","Shipping Address")]}),e.jsxs("div",{className:`step ${s===2?"active":""}`,children:["2. ",t("checkout.paymentMethod","Payment Method")]}),e.jsxs("div",{className:`step ${s===3?"active":""}`,children:["3. ",t("checkout.orderSummary","Order Summary")]})]}),s===1&&e.jsxs("div",{className:"checkout-section shipping-info",children:[e.jsx("h2",{children:t("checkout.shippingAddress","Shipping Address")}),v.length>0&&e.jsxs("div",{className:"saved-addresses",children:[e.jsx("h3",{children:t("profile.personal.addresses","Saved Addresses")}),e.jsx("div",{className:"address-selection",children:v.map((r,o)=>e.jsxs("div",{className:`address-option ${D===o?"selected":""}`,onClick:()=>q(o),children:[e.jsxs("div",{className:"address-info",children:[e.jsxs("div",{className:"address-name",children:[r.label,r.isDefault&&e.jsx("span",{className:"default-badge",children:t("profile.personal.default","Default")})]}),e.jsx("p",{children:r.fullName}),e.jsxs("p",{children:[r.street,", ",r.apartment]}),e.jsxs("p",{children:[r.city,", ",r.postalCode]}),e.jsx("p",{children:r.country}),e.jsx("p",{children:r.phone})]}),e.jsx("div",{className:"address-select",children:e.jsx("input",{type:"radio",id:`address-${o}`,name:"saved-address",checked:D===o,onChange:()=>{}})})]},o))}),e.jsx("div",{className:"or-separator",children:e.jsxs("span",{children:[t("common.or","or")," ",t("profile.personal.add_new_address","Add New Address")]})})]}),e.jsxs("form",{onSubmit:H,className:"shipping-form",children:[e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"firstName",children:t("auth.firstName","First Name")}),e.jsx("input",{type:"text",id:"firstName",value:i.firstName,onChange:r=>m("firstName",r.target.value),required:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"lastName",children:t("auth.lastName","Last Name")}),e.jsx("input",{type:"text",id:"lastName",value:i.lastName,onChange:r=>m("lastName",r.target.value),required:!0})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"email",children:t("auth.email","Email")}),e.jsx("input",{type:"email",id:"email",value:i.email,onChange:r=>m("email",r.target.value),required:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"phone",children:t("auth.phone","Phone")}),e.jsx("input",{type:"tel",id:"phone",value:i.phone,onChange:r=>m("phone",r.target.value),required:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"address",children:t("profile.personal.street_address","Street Address")}),e.jsx("input",{type:"text",id:"address",value:i.address,onChange:r=>m("address",r.target.value),required:!0})]}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"city",children:t("profile.personal.city","City")}),e.jsx("input",{type:"text",id:"city",value:i.city,onChange:r=>m("city",r.target.value),required:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"postalCode",children:t("profile.personal.postal_code","Postal Code")}),e.jsx("input",{type:"text",id:"postalCode",value:i.postalCode,onChange:r=>m("postalCode",r.target.value),required:!0})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"country",children:t("profile.personal.country","Country")}),e.jsxs("select",{id:"country",value:i.country,onChange:r=>m("country",r.target.value),required:!0,children:[e.jsx("option",{value:"Ukraine",children:t("common.ukrainian","Ukraine")}),e.jsx("option",{value:"Poland",children:t("common.polish","Poland")}),e.jsx("option",{value:"Germany",children:"Germany"}),e.jsx("option",{value:"France",children:"France"}),e.jsx("option",{value:"Other",children:"Other"})]})]}),e.jsxs("div",{className:"form-group shipping-options",children:[e.jsx("h3",{children:t("checkout.shippingMethod","Shipping Method")}),e.jsxs("div",{className:"shipping-option",children:[e.jsx("input",{type:"radio",id:"standard",value:"standard",checked:i.method==="standard",onChange:r=>m("method",r.target.value)}),e.jsxs("label",{htmlFor:"standard",children:[e.jsxs("div",{className:"shipping-option-details",children:[e.jsx("span",{className:"option-name",children:t("delivery.standardDelivery","Standard Delivery")}),e.jsxs("span",{className:"option-time",children:["3-5 ",t("delivery.days","days")]})]}),e.jsxs("span",{className:"option-price",children:[y(I)," грн"]})]})]}),e.jsxs("div",{className:"shipping-option",children:[e.jsx("input",{type:"radio",id:"express",value:"express",checked:i.method==="express",onChange:r=>m("method",r.target.value)}),e.jsxs("label",{htmlFor:"express",children:[e.jsxs("div",{className:"shipping-option-details",children:[e.jsx("span",{className:"option-name",children:t("delivery.expressDelivery","Express Delivery")}),e.jsxs("span",{className:"option-time",children:["1-2 ",t("delivery.days","days")]})]}),e.jsxs("span",{className:"option-price",children:[y(M)," грн"]})]})]})]}),e.jsxs("div",{className:"form-buttons",children:[e.jsx("button",{type:"button",onClick:K,className:"back-button",children:t("cart.continueShopping","Continue Shopping")}),e.jsx("button",{type:"submit",className:"next-button",children:t("checkout.paymentMethod","Payment Method")})]})]})]}),s===2&&e.jsxs("div",{className:"checkout-section payment-info",children:[e.jsx("h2",{children:t("checkout.paymentMethod","Payment Method")}),e.jsxs("div",{className:"payment-options",children:[e.jsxs("div",{className:"payment-option",children:[e.jsx("input",{type:"radio",id:"card-payment",value:"card",checked:f==="card",onChange:r=>A(r.target.value)}),e.jsxs("label",{htmlFor:"card-payment",children:[e.jsx("span",{className:"option-name",children:"Credit/Debit Card"}),e.jsxs("div",{className:"card-icons",children:[e.jsx("span",{className:"card-icon",children:"Visa"}),e.jsx("span",{className:"card-icon",children:"Mastercard"})]})]})]}),e.jsxs("div",{className:"payment-option",children:[e.jsx("input",{type:"radio",id:"bank-transfer",value:"transfer",checked:f==="transfer",onChange:r=>A(r.target.value)}),e.jsx("label",{htmlFor:"bank-transfer",children:e.jsx("span",{className:"option-name",children:"Bank Transfer"})})]}),e.jsxs("div",{className:"payment-option",children:[e.jsx("input",{type:"radio",id:"pay-on-delivery",value:"pod",checked:f==="pod",onChange:r=>A(r.target.value)}),e.jsxs("label",{htmlFor:"pay-on-delivery",children:[e.jsx("span",{className:"option-name",children:"Pay on Delivery"}),e.jsx("span",{className:"option-price",children:"+50 грн"})]})]})]}),e.jsxs("div",{className:"form-buttons",children:[e.jsx("button",{type:"button",onClick:O,className:"back-button",children:t("checkout.shippingAddress","Shipping Address")}),e.jsx("button",{type:"button",onClick:L,className:"next-button",children:t("checkout.orderSummary","Order Summary")})]})]}),s===3&&e.jsxs("div",{className:"checkout-section order-review",children:[e.jsx("h2",{children:t("checkout.orderSummary","Order Summary")}),e.jsxs("div",{className:"review-section",children:[e.jsx("h3",{children:t("checkout.shippingAddress","Shipping Address")}),e.jsxs("div",{className:"review-info",children:[e.jsxs("p",{children:[i.firstName," ",i.lastName]}),e.jsx("p",{children:i.email}),e.jsx("p",{children:i.phone}),e.jsx("p",{children:i.address}),e.jsxs("p",{children:[i.city,", ",i.postalCode]}),e.jsx("p",{children:i.country}),e.jsxs("p",{children:[e.jsxs("strong",{children:[t("checkout.shippingMethod","Shipping Method"),":"]})," ",W()]})]}),e.jsx("button",{type:"button",onClick:()=>z(1),className:"edit-button",children:t("profile.personal.edit_address","Edit")})]}),e.jsxs("div",{className:"review-section",children:[e.jsx("h3",{children:t("checkout.paymentMethod","Payment Method")}),e.jsx("div",{className:"review-info",children:e.jsx("p",{children:e.jsx("strong",{children:X()})})}),e.jsx("button",{type:"button",onClick:()=>z(2),className:"edit-button",children:t("profile.personal.edit_address","Edit")})]}),e.jsxs("div",{className:"review-section",children:[e.jsx("h3",{children:t("cart.items","Items")}),e.jsx("div",{className:"order-items",children:l.map(r=>e.jsxs("div",{className:"review-item",children:[e.jsx("div",{className:"item-image",children:e.jsx("img",{src:r.image,alt:r.name})}),e.jsxs("div",{className:"item-details",children:[e.jsx("p",{className:"item-name",children:r.name}),e.jsxs("p",{className:"item-quantity",children:[t("product.quantity","Quantity"),": ",r.quantity]})]}),e.jsxs("p",{className:"item-price",children:[y(r.price*r.quantity)," грн"]})]},r.id))})]}),e.jsxs("div",{className:"form-buttons",children:[e.jsx("button",{type:"button",onClick:O,className:"back-button",children:t("checkout.paymentMethod","Payment Method")}),e.jsx("button",{type:"button",onClick:Y,className:"checkout-button",children:t("checkout.placeOrder","Place Order")})]})]}),e.jsxs("div",{className:"order-summary",children:[e.jsx("h2",{children:t("cart.orderSummary","Order Summary")}),e.jsxs("div",{className:"summary-item",children:[e.jsxs("span",{children:[t("cart.items","Items")," (",J,"):"]}),e.jsxs("span",{children:[y(u)," грн"]})]}),e.jsxs("div",{className:"summary-item",children:[e.jsxs("span",{children:[t("cart.tax","Tax")," (20%):"]}),e.jsxs("span",{children:[y(w)," грн"]})]}),e.jsxs("div",{className:"summary-item",children:[e.jsxs("span",{children:[t("cart.shipping","Shipping"),":"]}),e.jsxs("span",{children:[y(S)," грн"]})]}),f==="pod"&&e.jsxs("div",{className:"summary-item",children:[e.jsx("span",{children:"Pay on Delivery Fee:"}),e.jsx("span",{children:"50 грн"})]}),e.jsx("hr",{}),e.jsxs("div",{className:"summary-total",children:[e.jsxs("span",{children:[t("cart.total","Total"),":"]}),e.jsxs("span",{children:[y(F)," грн"]})]})]})]}),e.jsx("style",{jsx:!0,children:`
        /* Root Styles */
        .checkout-view {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Inter', sans-serif;
          color: #333;
        }

        h1 {
          text-align: center;
          margin-bottom: 40px;
          font-size: 2rem;
          font-weight: 600;
        }

        h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 20px;
        }

        h3 {
          font-size: 1.2rem;
          font-weight: 500;
          margin-bottom: 15px;
        }

        /* Checkout Steps */
        .checkout-steps {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
          position: relative;
        }

        .checkout-steps::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #eee;
          z-index: 1;
        }

        .step {
          position: relative;
          z-index: 2;
          background-color: #fff;
          padding: 10px 20px;
          border-radius: 20px;
          font-weight: 500;
          color: #999;
          border: 2px solid #eee;
        }

        .step.active {
          color: #333;
          border-color: #52c41a;
          background-color: #f6ffed;
        }

        /* Checkout Container */
        .checkout-container {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
        }

        .checkout-section {
          flex: 2;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 30px;
        }

        /* Form Styles */
        .form-row {
          display: flex;
          gap: 20px;
        }

        .form-group {
          margin-bottom: 20px;
          flex: 1;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }

        input, select {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
        }

        input:focus, select:focus {
          outline: none;
          border-color: #52c41a;
          box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.2);
        }

        /* Shipping Options */
        .shipping-options {
          margin-top: 30px;
        }

        .shipping-option {
          margin-bottom: 15px;
        }

        .shipping-option input[type="radio"] {
          position: absolute;
          opacity: 0;
        }

        .shipping-option label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .shipping-option input[type="radio"]:checked + label {
          border-color: #52c41a;
          background-color: #f6ffed;
        }

        .shipping-option-details {
          display: flex;
          flex-direction: column;
        }

        .option-name {
          font-weight: 600;
        }

        .option-time {
          font-size: 0.9rem;
          color: #666;
        }

        .option-price {
          font-weight: 600;
        }

        /* Payment Options */
        .payment-options {
          margin-bottom: 30px;
        }

        .payment-option {
          margin-bottom: 15px;
        }

        .payment-option input[type="radio"] {
          position: absolute;
          opacity: 0;
        }

        .payment-option label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .payment-option input[type="radio"]:checked + label {
          border-color: #52c41a;
          background-color: #f6ffed;
        }

        .card-icons {
          display: flex;
          gap: 10px;
        }

        .card-icon {
          font-size: 0.9rem;
          color: #666;
        }

        /* Review Section */
        .review-section {
          margin-bottom: 30px;
          position: relative;
          padding: 20px;
          border: 1px solid #eee;
          border-radius: 8px;
        }

        .review-info p {
          margin: 5px 0;
        }

        .edit-button {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: #1890ff;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .order-items {
          max-height: 300px;
          overflow-y: auto;
          margin-top: 15px;
        }

        .review-item {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }

        .item-image img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 4px;
        }

        .item-details {
          flex: 1;
          margin-left: 15px;
        }

        .item-name {
          font-weight: 500;
        }

        .item-quantity {
          font-size: 0.9rem;
          color: #666;
        }

        .item-price {
          font-weight: 600;
        }

        /* Order Summary */
        .order-summary {
          flex: 1;
          padding: 30px;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          align-self: flex-start;
          position: sticky;
          top: 20px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          font-size: 1rem;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 20px 0;
        }

        hr {
          border: none;
          border-top: 1px solid #eee;
          margin: 20px 0;
        }

        /* Button Styles */
        .form-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
        }

        .back-button {
          padding: 12px 24px;
          background-color: #f5f5f5;
          color: #333;
          border: 1px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .back-button:hover {
          background-color: #e0e0e0;
        }

        .next-button, .checkout-button {
          padding: 12px 24px;
          background-color: #52c41a;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }

        .next-button:hover, .checkout-button:hover {
          background-color: #41a516;
        }

        /* Saved Addresses Styles */
        .saved-addresses {
          margin-bottom: 30px;
        }

        .address-selection {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .address-option {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .address-option:hover {
          border-color: #52c41a;
        }

        .address-option.selected {
          border-color: #52c41a;
          background-color: #f6ffed;
        }

        .address-info {
          flex: 1;
        }

        .address-info p {
          margin: 5px 0;
          font-size: 0.9rem;
        }

        .address-name {
          font-weight: 600;
          margin-bottom: 8px;
        }

        .default-badge {
          background-color: #e7f5ff;
          color: #0066cc;
          font-size: 0.75rem;
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 5px;
        }

        .address-select {
          padding-top: 5px;
        }

        .or-separator {
          position: relative;
          text-align: center;
          margin: 30px 0;
        }

        .or-separator::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background-color: #eee;
        }

        .or-separator span {
          position: relative;
          background-color: #fff;
          padding: 0 15px;
          color: #666;
          font-size: 0.9rem;
        }

        /* Responsive Styles */
        @media (max-width: 992px) {
          .checkout-container {
            flex-direction: column;
          }
          
          .form-row {
            flex-direction: column;
            gap: 0;
          }
          
          .order-summary {
            position: static;
            width: 100%;
          }
          
          .address-selection {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 576px) {
          h1 {
            font-size: 1.75rem;
          }
          
          .checkout-section, .order-summary {
            padding: 20px;
          }
          
          .checkout-steps {
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }
          
          .checkout-steps::before {
            display: none;
          }
          
          .form-buttons {
            flex-direction: column;
            gap: 10px;
          }
          
          .back-button, .next-button, .checkout-button {
            width: 100%;
          }
        }
      `})]})};export{he as default};
