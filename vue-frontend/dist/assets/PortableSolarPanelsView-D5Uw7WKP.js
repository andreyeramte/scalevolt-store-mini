import{e as g,r as d,j as e}from"./index-9GWEwC6O.js";const p=({productId:s,title:i,price:o,imageSrc:r,brand:n,onClick:t})=>e.jsxs("div",{onClick:t,style:{border:"1px solid #e5e7eb",borderRadius:"8px",padding:"16px",backgroundColor:"white",cursor:"pointer",transition:"transform 0.2s, box-shadow 0.2s",":hover":{transform:"translateY(-2px)",boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}},children:[e.jsx("img",{src:r||"/placeholder-product.jpg",alt:i,style:{width:"100%",height:"200px",objectFit:"cover",borderRadius:"4px",marginBottom:"12px"}}),e.jsx("h3",{style:{fontSize:"16px",fontWeight:"600",marginBottom:"8px",color:"#333"},children:i}),e.jsx("p",{style:{fontSize:"14px",color:"#666",marginBottom:"8px"},children:n}),e.jsxs("p",{style:{fontSize:"18px",fontWeight:"bold",color:"#0066cc"},children:["$",o]})]}),m=({breadcrumbs:s,className:i})=>e.jsx("nav",{className:i,children:e.jsx("ol",{style:{display:"flex",listStyle:"none",padding:0,margin:0,fontSize:"14px",color:"#666"},children:s.map((o,r)=>e.jsxs("li",{style:{display:"flex",alignItems:"center"},children:[o.link?e.jsx("a",{href:o.link,style:{color:"#0066cc",textDecoration:"none",":hover":{textDecoration:"underline"}},onClick:n=>{n.preventDefault(),console.log("Navigate to:",o.link)},children:o.name}):e.jsx("span",{style:{color:"#333"},children:o.name}),r<s.length-1&&e.jsx("span",{style:{margin:"0 8px",color:"#999"},children:"/"})]},r))})}),u=()=>{const i=g().id||null,r=[{id:1,name:"Портативні-Сонячні-панелі-Jackery-SolarSaga-100W",price:1e3,image:"/images/Categories/solar.panels/Портативні-Сонячні-панелі-Jackery-SolarSaga-100W.png",brand:"Longi",categoryId:12},{id:2,name:"Сонячна Панель Longi-420-Black",price:1200,image:"/images/Categories/solar.panels/Longi-420-Black.png",brand:"Longi",categoryId:12},{id:3,name:"Сонячна Панель Longi-425-Black",price:1e3,image:"/images/Categories/solar.panels/Longi-425-Black.png",brand:"Longi",categoryId:12},{id:4,name:"Сонячна Панель Longi-530-Black",price:1200,image:"/images/Categories/solar.panels/Longi-530-Black.png",brand:"Longi",categoryId:12},{id:5,name:"Сонячна Панель Longi-630-Bifacial",price:1e3,image:"/images/Categories/solar.panels/Longi-630-Bifacial.png",brand:"Longi",categoryId:12},{id:6,name:"Сонячна Панель Longi-430",price:1200,image:"/images/Categories/solar.panels/Longi-430.png",brand:"Longi",categoryId:13},{id:7,name:"Сонячна Панель Longi-580",price:1e3,image:"/images/Categories/solar.panels/Longi-580.png",brand:"Longi",categoryId:14},{id:8,name:"Сонячна Панель Longi-585",price:1200,image:"/images/Categories/solar.panels/Longi-585.png",brand:"Longi",categoryId:15},{id:9,name:"Сонячна Панель Longi-440",price:1e3,image:"/images/Categories/solar.panels/Longi-440.png",brand:"Longi-440",categoryId:16},{id:10,name:"Сонячна Панель Longi-455",price:1200,image:"/images/Categories/solar.panels/Longi-455.png",brand:"Longi",categoryId:17}].map(a=>({...a,uniqueKey:a.id})),n=d.useMemo(()=>i?r.filter(a=>a.categoryId===i):r,[i,r]),t=[{name:"Home",link:"/"},{name:"Каталог",link:"/catalogue"},{name:"Портативні сонячні панелі"}],c="Портативні сонячні панелі",l=a=>{console.log("Navigate to product:",a)};return e.jsxs("div",{className:"catalogue-view",children:[e.jsx(m,{breadcrumbs:t,className:"breadcrumb-spacing"}),e.jsx("h1",{children:c}),e.jsx("div",{className:"products-container",children:n.map(a=>e.jsx("div",{className:"product-card-wrapper",children:e.jsx(p,{productId:a.id,title:a.name,price:a.price,imageSrc:a.image,brand:a.brand,onClick:()=>l(a.id)})},a.uniqueKey))}),e.jsx("style",{jsx:!0,children:`
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
      `})]})};export{u as default};
