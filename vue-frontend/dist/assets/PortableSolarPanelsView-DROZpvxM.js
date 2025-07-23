import{f as l,u as d,r as p,j as e,L as m}from"./index-Cov9520u.js";import{P as u}from"./ProductCard-BOdmdCx7.js";const x=({breadcrumbs:o,className:n})=>e.jsx("nav",{className:n,children:e.jsx("ol",{style:{display:"flex",listStyle:"none",padding:0,margin:0,fontSize:"14px",color:"#666"},children:o.map((i,r)=>e.jsxs("li",{style:{display:"flex",alignItems:"center"},children:[i.link?e.jsx("a",{href:i.link,style:{color:"#0066cc",textDecoration:"none",":hover":{textDecoration:"underline"}},onClick:t=>{t.preventDefault(),console.log("Navigate to:",i.link)},children:i.name}):e.jsx("span",{style:{color:"#333"},children:i.name}),r<o.length-1&&e.jsx("span",{style:{margin:"0 8px",color:"#999"},children:"/"})]},r))})}),f=()=>{const n=l().id||null,r=d().pathname.split("/")[1]||"ua",s=[{id:1,name:"Портативні-Сонячні-панелі-Jackery-SolarSaga-100W",price:1e3,image:"/images/Categories/solar.panels/Портативні-Сонячні-панелі-Jackery-SolarSaga-100W.png",brand:"Longi",categoryId:12},{id:2,name:"Сонячна Панель Longi-420-Black",price:1200,image:"/images/Categories/solar.panels/Longi-420-Black.png",brand:"Longi",categoryId:12},{id:3,name:"Сонячна Панель Longi-425-Black",price:1e3,image:"/images/Categories/solar.panels/Longi-425-Black.png",brand:"Longi",categoryId:12},{id:4,name:"Сонячна Панель Longi-530-Black",price:1200,image:"/images/Categories/solar.panels/Longi-530-Black.png",brand:"Longi",categoryId:12},{id:5,name:"Сонячна Панель Longi-630-Bifacial",price:1e3,image:"/images/Categories/solar.panels/Longi-630-Bifacial.png",brand:"Longi",categoryId:12},{id:6,name:"Сонячна Панель Longi-430",price:1200,image:"/images/Categories/solar.panels/Longi-430.png",brand:"Longi",categoryId:13},{id:7,name:"Сонячна Панель Longi-580",price:1e3,image:"/images/Categories/solar.panels/Longi-580.png",brand:"Longi",categoryId:14},{id:8,name:"Сонячна Панель Longi-585",price:1200,image:"/images/Categories/solar.panels/Longi-585.png",brand:"Longi",categoryId:15},{id:9,name:"Сонячна Панель Longi-440",price:1e3,image:"/images/Categories/solar.panels/Longi-440.png",brand:"Longi-440",categoryId:16},{id:10,name:"Сонячна Панель Longi-455",price:1200,image:"/images/Categories/solar.panels/Longi-455.png",brand:"Longi",categoryId:17}].map(a=>({...a,uniqueKey:a.id})),g=p.useMemo(()=>n?s.filter(a=>a.categoryId===n):s,[n,s]),c=[{name:"Home",link:"/"},{name:"Каталог",link:"/catalogue"},{name:"Портативні сонячні панелі"}];return e.jsxs("div",{className:"catalogue-view",children:[e.jsx(x,{breadcrumbs:c,className:"breadcrumb-spacing"}),e.jsx("h1",{children:"Портативні сонячні панелі"}),e.jsx("div",{className:"products-container",children:g.map(a=>e.jsx("div",{className:"product-card-wrapper",children:e.jsx(m,{to:`/${r}/product/${a.id}`,style:{textDecoration:"none",color:"inherit"},children:e.jsx(u,{productId:a.id,title:a.name,price:a.price,imageSrc:a.image,brand:a.brand,region:r})})},a.uniqueKey))}),e.jsx("style",{jsx:!0,children:`
        .catalogue-view {
          padding-top: 120px; /* Header height + 10px buffer */
          margin-top: 0 !important;
        }

        .products-container {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 15px;
          padding: 20px;
          background-color: #f9fafb;
        }

        /* Match other pages so breadcrumb isn't hidden by a fixed header */
        .catalogue-view {
          margin-top: 80px;
        }

        /* Same class used in Breadcrumb.vue for consistent spacing */
        .breadcrumb-spacing {
          margin-bottom: 1rem;
          /* margin-top: 1rem; /* If you want additional top spacing above the breadcrumb */
        }

        /* Your existing styles */
        .products-container {
          display: grid;
          grid-template-columns: repeat(5, 1fr); /* Five columns */
          gap: 15px;
          padding: 20px;
          background-color: #f9fafb;
        }

        /* Responsive styles */
        @media (max-width: 1600px) {
          .products-container {
            grid-template-columns: repeat(5, 1fr); /* Four columns */
          }
        }

        @media (max-width: 1200px) {
          .products-container {
            grid-template-columns: repeat(3, 1fr); /* Three columns */
          }
        }

        @media (max-width: 992px) {
          .products-container {
            grid-template-columns: repeat(2, 1fr); /* Two columns */
          }
        }

        @media (max-width: 600px) {
          .products-container {
            grid-template-columns: 1fr; /* One column */
          }
        }
      `})]})};export{f as default};
