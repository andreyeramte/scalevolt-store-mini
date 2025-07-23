import{u as d,r as l,j as t,L as p}from"./index-Cov9520u.js";import{P as m}from"./ProductCard-BOdmdCx7.js";const u=({breadcrumbs:a,className:o})=>t.jsx("nav",{className:o,children:t.jsx("ol",{style:{display:"flex",listStyle:"none",padding:0,margin:0,fontSize:"14px",color:"#666"},children:a.map((r,n)=>t.jsxs("li",{style:{display:"flex",alignItems:"center"},children:[r.link?t.jsx("a",{href:r.link,style:{color:"#0066cc",textDecoration:"none",":hover":{textDecoration:"underline"}},onClick:i=>{i.preventDefault(),console.log("Navigate to:",r.link)},children:r.name}):t.jsx("span",{style:{color:"#333"},children:r.name}),n<a.length-1&&t.jsx("span",{style:{margin:"0 8px",color:"#999"},children:"/"})]},n))})}),g=(a,o)=>({"product.mount.roof":"Roof Mount System","product.mount.ground":"Ground Mount System","product.mount.carport":"Carport Mount System","product.mount.tracker":"Solar Tracker Mount"})[a]||o||a,x=()=>({getProducts:[{id:1,categoryId:5,nameKey:"product.mount.roof",defaultName:"Roof Mount Kit Standard",price:299.99,image:"/api/placeholder/300/200",brand:"SolarMount Pro"},{id:2,categoryId:5,nameKey:"product.mount.ground",defaultName:"Ground Mount System",price:599.99,image:"/api/placeholder/300/200",brand:"TerraMount"},{id:3,categoryId:5,nameKey:"product.mount.carport",defaultName:"Carport Mount Structure",price:1299.99,image:"/api/placeholder/300/200",brand:"CarSolar"},{id:4,categoryId:5,nameKey:"product.mount.tracker",defaultName:"Single Axis Tracker",price:2199.99,image:"/api/placeholder/300/200",brand:"TrackerTech"}]}),j=()=>{const o=d().pathname.split("/")[1]||"ua",r=5,n=x(),i=l.useMemo(()=>n.getProducts.filter(e=>+e.categoryId===r).map(e=>({...e,uniqueKey:e.id})),[n.getProducts,r]),c=e=>g(e.nameKey,e.defaultName),s=[{name:"Home",link:"/"},{name:"Каталог",link:"/catalogue"},{name:"Система монтажу сонячних панелей"}];return t.jsxs("div",{className:"catalogue-view",children:[t.jsx(u,{breadcrumbs:s,className:"breadcrumb-spacing"}),t.jsx("h1",{children:"Система монтажу сонячних панелей"}),t.jsx("div",{className:"products-container",children:i.map(e=>t.jsx("div",{className:"product-card-wrapper",children:t.jsx(p,{to:`/${o}/product/${e.id}`,style:{textDecoration:"none",color:"inherit"},children:t.jsx(m,{productId:e.id,title:c(e),price:e.price,imageSrc:e.image,brand:e.brand,region:o})})},e.uniqueKey))}),t.jsx("style",{jsx:!0,children:`
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

        /* Same class used in Breadcrumb.vue for consistent spacing */
        .breadcrumb-spacing {
          margin-bottom: 1rem;
          padding: 0 20px;
          /* margin-top: 1rem; /* If you want additional top spacing above the breadcrumb */
        }

        .product-card-wrapper {
          transition: transform 0.2s ease;
        }

        .product-card-wrapper:hover {
          transform: translateY(-2px);
        }

        h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #333;
          margin: 0 0 20px 0;
          padding: 0 20px;
        }

        /* Responsive styles */
        @media (max-width: 1600px) {
          .products-container {
            grid-template-columns: repeat(5, 1fr); /* Five columns */
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
      `})]})};export{j as default};
