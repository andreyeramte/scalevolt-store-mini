import{b as I,e as q,c as z,g as M,d as E,r as s,j as e,L as D,B as c}from"./index-Cov9520u.js";import{u as V}from"./auth-DJKOFJE4.js";const W=()=>{const p=I(),[w]=q(),{t:r}=z();M();const{user:B,loading:l,error:d,login:j,register:v,clearError:f}=V(),{cartItems:m}=E(),[y,O]=s.useState(!0),[k,$]=s.useState(!1),[u,b]=s.useState("login"),[n,N]=s.useState({email:"",password:"",remember:!1}),[a,C]=s.useState({firstName:"",lastName:"",email:"",phone:"",password:"",confirmPassword:"",acceptTerms:!1}),S=s.useMemo(()=>m.reduce((t,o)=>t+o.quantity,0),[m]),F=s.useMemo(()=>m.reduce((t,o)=>t+o.price*o.quantity,0),[m]),P=s.useMemo(()=>a.password===a.confirmPassword&&a.password.length>=6&&a.acceptTerms,[a]),L=t=>t.toLocaleString("en-US"),g=()=>{const t=w.get("redirect")||localStorage.getItem("checkoutRedirect")||"/checkout";return localStorage.removeItem("checkoutRedirect"),t},T=()=>{p(g())},x=(t,o)=>{N(h=>({...h,[t]:o})),f()},i=(t,o)=>{C(h=>({...h,[t]:o})),f()},A=async t=>{t.preventDefault(),await j(n.email,n.password)?(c.success(r("auth.loginSuccess","Login successful")),p(g())):c.error(d||r("auth.loginFailed","Login failed"))},R=async t=>{if(t.preventDefault(),a.password!==a.confirmPassword){c.error(r("auth.passwordsMustMatch","Passwords must match"));return}const o={firstName:a.firstName,lastName:a.lastName,email:a.email,phone:a.phone,password:a.password};await v(o)?(c.success(r("auth.registerSuccess","Registration successful")),p(g())):c.error(d||r("auth.registerFailed","Registration failed"))};return e.jsxs("div",{className:"checkout-auth-view",children:[e.jsxs("div",{className:"auth-container",children:[e.jsxs("div",{className:"auth-header",children:[e.jsx("h1",{children:r("checkout.authenticateToCheckout","Sign in to Complete Your Order")}),e.jsx("p",{className:"auth-subtitle",children:r("checkout.authenticateDescription","Please sign in or create an account to proceed with checkout")})]}),y?e.jsxs("div",{className:"auth-checking",children:[e.jsx("div",{className:"loading-spinner"}),e.jsx("p",{children:r("auth.checking","Checking authentication...")})]}):k?e.jsxs("div",{className:"already-authenticated",children:[e.jsx("div",{className:"success-icon",children:e.jsxs("svg",{viewBox:"0 0 52 52",xmlns:"http://www.w3.org/2000/svg",children:[e.jsx("circle",{cx:"26",cy:"26",r:"25",fill:"#52c41a"}),e.jsx("path",{d:"M14,27.5 L21,34.5 L38,17.5",stroke:"white",strokeWidth:"4",fill:"none"})]})}),e.jsx("h2",{children:r("auth.alreadyLoggedIn","Already Logged In")}),e.jsx("p",{children:r("auth.redirectingToCheckout","Redirecting to checkout...")}),e.jsx("button",{onClick:T,className:"continue-button",children:r("auth.continueToCheckout","Continue to Checkout")})]}):e.jsxs("div",{children:[e.jsxs("div",{className:"auth-tabs",children:[e.jsx("button",{onClick:()=>b("login"),className:`tab-button ${u==="login"?"active":""}`,children:r("common.login","Sign In")}),e.jsx("button",{onClick:()=>b("register"),className:`tab-button ${u==="register"?"active":""}`,children:r("common.register","Create Account")})]}),u==="login"&&e.jsx("div",{className:"auth-form-container",children:e.jsxs("form",{onSubmit:A,className:"auth-form",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"login-email",children:r("auth.email","Email")}),e.jsx("input",{type:"email",id:"login-email",value:n.email,onChange:t=>x("email",t.target.value),required:!0,autoComplete:"email"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"login-password",children:r("auth.password","Password")}),e.jsx("input",{type:"password",id:"login-password",value:n.password,onChange:t=>x("password",t.target.value),required:!0,autoComplete:"current-password"})]}),e.jsxs("div",{className:"form-footer",children:[e.jsxs("div",{className:"remember-me",children:[e.jsx("input",{type:"checkbox",id:"remember",checked:n.remember,onChange:t=>x("remember",t.target.checked)}),e.jsx("label",{htmlFor:"remember",children:r("auth.rememberMe","Remember me")})]}),e.jsx("a",{href:"#",className:"forgot-password",children:r("auth.forgotPassword","Forgot password?")})]}),e.jsx("button",{type:"submit",className:"submit-button",disabled:l,children:l?r("common.loading","Loading..."):r("common.login","Sign In")})]})}),u==="register"&&e.jsx("div",{className:"auth-form-container",children:e.jsxs("form",{onSubmit:R,className:"auth-form",children:[e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"register-firstname",children:r("auth.firstName","First Name")}),e.jsx("input",{type:"text",id:"register-firstname",value:a.firstName,onChange:t=>i("firstName",t.target.value),required:!0,autoComplete:"given-name"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"register-lastname",children:r("auth.lastName","Last Name")}),e.jsx("input",{type:"text",id:"register-lastname",value:a.lastName,onChange:t=>i("lastName",t.target.value),required:!0,autoComplete:"family-name"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"register-email",children:r("auth.email","Email")}),e.jsx("input",{type:"email",id:"register-email",value:a.email,onChange:t=>i("email",t.target.value),required:!0,autoComplete:"email"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"register-phone",children:r("auth.phone","Phone Number")}),e.jsx("input",{type:"tel",id:"register-phone",value:a.phone,onChange:t=>i("phone",t.target.value),autoComplete:"tel"})]}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"register-password",children:r("auth.password","Password")}),e.jsx("input",{type:"password",id:"register-password",value:a.password,onChange:t=>i("password",t.target.value),required:!0,autoComplete:"new-password"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"register-confirm-password",children:r("auth.confirmPassword","Confirm Password")}),e.jsx("input",{type:"password",id:"register-confirm-password",value:a.confirmPassword,onChange:t=>i("confirmPassword",t.target.value),required:!0,autoComplete:"new-password"})]})]}),e.jsxs("div",{className:"form-checkbox",children:[e.jsx("input",{type:"checkbox",id:"terms",checked:a.acceptTerms,onChange:t=>i("acceptTerms",t.target.checked),required:!0}),e.jsxs("label",{htmlFor:"terms",children:[r("auth.acceptTerms","I accept the"),e.jsx("a",{href:"/terms",target:"_blank",children:r("auth.termsLink","Terms of Service")})]})]}),e.jsx("button",{type:"submit",className:"submit-button",disabled:l||!P,children:l?r("common.loading","Loading..."):r("common.register","Create Account")})]})}),d&&e.jsx("div",{className:"auth-error",children:d})]}),e.jsxs("div",{className:"auth-cart-summary",children:[e.jsx("h3",{children:r("cart.orderSummary","Order Summary")}),e.jsxs("div",{className:"summary-item",children:[e.jsxs("span",{children:[r("cart.items","Items"),":"]}),e.jsx("span",{children:S})]}),e.jsxs("div",{className:"summary-total",children:[e.jsxs("span",{children:[r("cart.total","Total"),":"]}),e.jsxs("span",{children:[L(F)," грн"]})]}),e.jsx(D,{to:"/cart",className:"view-cart-link",children:r("checkout.viewCart","View Cart")})]})]}),e.jsx("style",{jsx:!0,children:`
        .checkout-auth-view {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: 'Inter', sans-serif;
        }

        .auth-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .auth-header {
          grid-column: 1 / -1;
          padding: 30px;
          background-color: #f9f9f9;
          text-align: center;
        }

        .auth-header h1 {
          margin: 0 0 10px;
          font-size: 1.8rem;
          color: #333;
        }

        .auth-subtitle {
          color: #666;
          margin: 0;
        }

        .auth-checking {
          grid-column: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 50px 0;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #52c41a;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .already-authenticated {
          grid-column: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
        }

        .success-icon {
          width: 60px;
          height: 60px;
          margin-bottom: 20px;
        }

        .already-authenticated h2 {
          margin-top: 0;
          color: #52c41a;
        }

        .continue-button {
          margin-top: 20px;
          padding: 12px 24px;
          background-color: #52c41a;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .continue-button:hover {
          background-color: #46b314;
        }

        .auth-tabs {
          grid-column: 1;
          display: flex;
          border-bottom: 1px solid #eee;
          margin-bottom: 20px;
        }

        .tab-button {
          flex: 1;
          padding: 15px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          color: #666;
          transition: all 0.2s ease;
        }

        .tab-button.active {
          color: #52c41a;
          border-bottom: 2px solid #52c41a;
        }

        .auth-form-container {
          grid-column: 1;
          padding: 0 30px 30px;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: flex;
          gap: 15px;
        }

        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-size: 14px;
          font-weight: 500;
          color: #555;
        }

        input[type="text"],
        input[type="email"],
        input[type="password"],
        input[type="tel"] {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-family: inherit;
          font-size: 16px;
          transition: border-color 0.2s ease;
        }

        input:focus {
          outline: none;
          border-color: #52c41a;
          box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.1);
        }

        .form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .forgot-password {
          color: #1890ff;
          text-decoration: none;
        }

        .forgot-password:hover {
          text-decoration: underline;
        }

        .form-checkbox {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          font-size: 14px;
        }

        .form-checkbox a {
          color: #1890ff;
          text-decoration: none;
        }

        .form-checkbox a:hover {
          text-decoration: underline;
        }

        .submit-button {
          padding: 14px;
          background-color: #52c41a;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .submit-button:hover {
          background-color: #46b314;
        }

        .submit-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }

        .auth-error {
          grid-column: 1;
          padding: 0 30px;
          color: #ff4d4f;
          margin-top: 10px;
        }

        .auth-cart-summary {
          grid-column: 2;
          grid-row: 2 / span 4;
          background-color: #f9f9f9;
          padding: 30px;
          border-left: 1px solid #eee;
        }

        .auth-cart-summary h3 {
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 18px;
          color: #333;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          color: #666;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #eee;
          font-weight: 600;
          font-size: 18px;
        }

        .view-cart-link {
          display: block;
          margin-top: 30px;
          text-align: center;
          color: #1890ff;
          text-decoration: none;
        }

        .view-cart-link:hover {
          text-decoration: underline;
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .auth-container {
            grid-template-columns: 1fr;
          }
          
          .auth-cart-summary {
            grid-column: 1;
            grid-row: auto;
            border-left: none;
            border-top: 1px solid #eee;
          }
          
          .form-row {
            flex-direction: column;
            gap: 20px;
          }
        }
      `})]})};export{W as default};
