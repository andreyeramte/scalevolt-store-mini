import{u as p,r as c,j as a,L as u}from"./index-Cov9520u.js";import{P as g}from"./ProductCard-BOdmdCx7.js";const x=({breadcrumbs:r,className:o})=>a.jsx("nav",{className:o,children:a.jsx("ol",{style:{display:"flex",listStyle:"none",padding:0,margin:0,fontSize:"14px",color:"#666"},children:r.map((t,i)=>a.jsxs("li",{style:{display:"flex",alignItems:"center"},children:[t.link?a.jsx("a",{href:t.link,style:{color:"#0066cc",textDecoration:"none",":hover":{textDecoration:"underline"}},onClick:s=>{s.preventDefault(),console.log("Navigate to:",t.link)},children:t.name}):a.jsx("span",{style:{color:"#333"},children:t.name}),i<r.length-1&&a.jsx("span",{style:{margin:"0 8px",color:"#999"},children:"/"})]},i))})}),n=r=>({"header.categories.batteries":"Batteries","common.home":"Home","common.categories":"Categories"})[r]||r,h=()=>({getProducts:[{id:1,categoryId:2,nameKey:"product.battery.lithium",defaultName:"Lithium Battery 12V",price:299.99,image:"/api/placeholder/300/200",brand:"PowerMax"},{id:2,categoryId:2,nameKey:"product.battery.solar",defaultName:"Solar Battery 24V",price:459.99,image:"/api/placeholder/300/200",brand:"SolarTech"},{id:3,categoryId:2,nameKey:"product.battery.marine",defaultName:"Marine Battery 12V",price:189.99,image:"/api/placeholder/300/200",brand:"AquaPower"},{id:4,categoryId:2,nameKey:"product.battery.automotive",defaultName:"Automotive Battery",price:129.99,image:"/api/placeholder/300/200",brand:"AutoMax"},{id:5,categoryId:2,nameKey:"product.battery.ups",defaultName:"UPS Battery 48V",price:349.99,image:"/api/placeholder/300/200",brand:"BackupPro"}]}),b=()=>{const o=p().pathname.split("/")[1]||"ua",t=2,i=h(),s=c.useMemo(()=>i.getProducts.filter(e=>+e.categoryId===t).map(e=>({...e,uniqueKey:e.id})),[i.getProducts,t]),d=e=>n(e.nameKey)+" "+e.defaultName,l=c.useMemo(()=>[{name:n("common.home"),link:"/"},{name:n("common.categories"),link:"/catalogue"},{name:n("header.categories.batteries")}],[]);return a.jsxs("div",{className:"catalogue-view",children:[a.jsx(x,{breadcrumbs:l,className:"breadcrumb-spacing"}),a.jsx("h1",{children:n("header.categories.batteries")}),a.jsx("div",{className:"products-container",children:s.map(e=>{const m=e.image||"/images/placeholder.png";return a.jsx("div",{className:"product-card-wrapper",children:a.jsx(u,{to:`/${o}/product/${e.id}`,style:{textDecoration:"none",color:"inherit"},children:a.jsx(g,{productId:e.id,title:d(e),price:e.price,imageSrc:m,brand:e.brand,region:o})})},e.uniqueKey)})}),a.jsx("style",{jsx:!0,children:`
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
        }

        .product-card-wrapper {
          transition: transform 0.2s ease;
        }

        .product-card-wrapper:hover {
          transform: translateY(-2px);
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

        h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #333;
          margin: 0 0 20px 0;
          padding: 0 20px;
        }
      `})]})};export{b as default};
