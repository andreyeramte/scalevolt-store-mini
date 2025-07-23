import{j as e,L as m,r as s,u as f,a as j}from"./index-Cov9520u.js";import{P as y}from"./ProductCard-BOdmdCx7.js";const v=({breadcrumbs:n=[]})=>{const i=n.length?n:[{name:"Home",link:"/"}];return e.jsxs("nav",{className:"breadcrumb-wrapper",children:[e.jsx("ol",{className:"breadcrumb-list",children:i.map((r,d)=>e.jsx("li",{className:"breadcrumb-item",children:r.link?e.jsx(m,{to:r.link,children:r.name}):e.jsx("span",{children:r.name})},d))}),e.jsx("style",{jsx:!0,children:`
        /* Existing example code */
        .catalogue-view {
          margin-top: 80px; /* Adjust as needed so the breadcrumb isn't behind a fixed header */
        }
        .breadcrumb-spacing {
          margin-bottom: 1rem;
          /* margin-top: 1rem; if you want additional top spacing just for the breadcrumb */
        }
        .products-container {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 15px;
          padding: 20px;
          background-color: #f9fafb;
        }

        @media (max-width: 1600px) {
          .products-container {
            grid-template-columns: repeat(5, 1fr);
          }
        }
        @media (max-width: 1200px) {
          .products-container {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 992px) {
          .products-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .products-container {
            grid-template-columns: 1fr;
          }
        }

        /* ──────────────────────────────────────────────────────────
           NEW BREADCRUMB STYLES (for "Store > Portable Energy" look)
           ────────────────────────────────────────────────────────── */

        .breadcrumb-wrapper {
          /* Light background color behind the breadcrumb */
          background-color: #f8f4ed;
          padding: 8px 16px;
        }

        .breadcrumb-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: inline-block;
          font-family: Arial, sans-serif;
          font-size: 14px;
        }

        .breadcrumb-item {
          display: inline;
          color: #333;
        }

        /* Insert '>' as the separator between items */
        .breadcrumb-item + .breadcrumb-item::before {
          content: '>';
          margin: 0 6px;
          color: #333;
        }

        /* Breadcrumb links */
        .breadcrumb-item a {
          text-decoration: none;
          color: #000; /* black text */
        }

        .breadcrumb-item a:hover {
          text-decoration: underline;
        }
      `})]})},S=()=>{const[n,i]=s.useState(!0),[r,d]=s.useState([]),[o,p]=s.useState(""),[c,u]=s.useState(""),l=f().pathname.split("/")[1]||"ua",b=[{name:"Головна",link:"/"},{name:"Низьковольтна Продукція",link:"#"},{name:"Кабелі електричні та дроти"}];s.useEffect(()=>{(async()=>{i(!0);try{const t={};o&&(t.category=o),c&&(t.search=c);const h=await j.get("/api/cables",{params:t});d(h.data)}catch(t){console.error("Error fetching cables:",t)}finally{i(!1)}})()},[o,c]);const x=a=>{p(a.target.value)},g=a=>{u(a.target.value)};return e.jsxs("div",{className:"catalogue-view",children:[e.jsx(v,{breadcrumbs:b,className:"breadcrumb-spacing"}),e.jsx("h1",{children:"Кабелі електричні та дроти"}),e.jsxs("div",{className:"mb-6 grid grid-cols-1 md:grid-cols-3 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Категорія"}),e.jsx("select",{className:"w-full p-2 border border-gray-300 rounded",value:o,onChange:x,children:e.jsx("option",{value:"",children:"Усі категорії"})})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Пошук"}),e.jsx("input",{type:"text",className:"w-full p-2 border border-gray-300 rounded",placeholder:"Пошук за назвою або моделлю...",value:c,onChange:g})]})]}),n?e.jsx("div",{className:"flex justify-center items-center h-64",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"})}):e.jsx("div",{className:"products-container",children:r.length===0?e.jsx("div",{className:"col-span-full bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded",children:"No cables found. Try adjusting your filters."}):r.map(a=>e.jsx("div",{className:"product-card-wrapper",children:e.jsx(m,{to:`/${l}/product/${a.id}`,style:{textDecoration:"none",color:"inherit"},children:e.jsx(y,{productId:a.id,title:a.name,price:a.market_data.price,imageSrc:a.image_url||"/images/placeholder.png",brand:a.specifications.conductor_material,isRentalItem:!1,region:l})})},a.id))})]})};export{S as default};
