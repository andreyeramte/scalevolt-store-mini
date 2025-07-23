import{u as c,r as l,j as r,L as p}from"./index-Cov9520u.js";import{P as m}from"./ProductCard-BOdmdCx7.js";const g=({breadcrumbs:t,className:o})=>r.jsx("nav",{className:o,children:r.jsx("ol",{style:{display:"flex",listStyle:"none",padding:0,margin:0,fontSize:"14px",color:"#666"},children:t.map((a,i)=>r.jsxs("li",{style:{display:"flex",alignItems:"center"},children:[a.link?r.jsx("a",{href:a.link,style:{color:"#0066cc",textDecoration:"none",":hover":{textDecoration:"underline"}},onClick:d=>{d.preventDefault(),console.log("Navigate to:",a.link)},children:a.name}):r.jsx("span",{style:{color:"#333"},children:a.name}),i<t.length-1&&r.jsx("span",{style:{margin:"0 8px",color:"#999"},children:"/"})]},i))})}),u=(t,o)=>({"product.solarset.residential":"Residential Solar Kit","product.solarset.commercial":"Commercial Solar System","product.solarset.offgrid":"Off-Grid Solar Package","product.solarset.hybrid":"Hybrid Solar System"})[t]||o||t,x=()=>({getProducts:[{id:1,categoryId:4,nameKey:"product.solarset.residential",defaultName:"5kW Complete Home Kit",price:4999.99,image:"/api/placeholder/300/200",brand:"SolarHome Pro"},{id:2,categoryId:4,nameKey:"product.solarset.commercial",defaultName:"50kW Business System",price:35999.99,image:"/api/placeholder/300/200",brand:"CommercialSolar"},{id:3,categoryId:4,nameKey:"product.solarset.offgrid",defaultName:"3kW Off-Grid Package",price:3499.99,image:"/api/placeholder/300/200",brand:"OffGrid Solutions"},{id:4,categoryId:4,nameKey:"product.solarset.hybrid",defaultName:"8kW Hybrid System",price:7999.99,image:"/api/placeholder/300/200",brand:"HybridTech"}]}),y=()=>{const o=c().pathname.split("/")[1]||"ua",a=x(),i=l.useMemo(()=>a.getProducts.filter(e=>+e.categoryId==4).map(e=>({...e,uniqueKey:e.id})),[a.getProducts]),d=e=>u(e.nameKey,e.defaultName),n=[{name:"Home",link:"/"},{name:"Каталог",link:"/catalogue"},{name:"SolarSets"}];return r.jsxs("div",{className:"catalogue-view",children:[r.jsx(g,{breadcrumbs:n,className:"breadcrumb-spacing"}),r.jsx("h1",{children:"SolarSets"}),r.jsx("div",{className:"products-container",children:i.map(e=>{const s=e.image||"/images/placeholder.png";return r.jsx("div",{className:"product-card-wrapper",children:r.jsx(p,{to:`/${o}/product/${e.id}`,style:{textDecoration:"none",color:"inherit"},children:r.jsx(m,{productId:e.id,title:d(e),price:e.price,imageSrc:s,brand:e.brand,region:o})})},e.uniqueKey)})}),r.jsx("style",{jsx:!0,children:`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          max-width: 1200px;
          margin: 2rem auto;
          padding: 20px;
        }

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

        h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #333;
          margin: 0 0 20px 0;
          padding: 0 20px;
        }

        .product-item {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
        }

        .product-header {
          position: relative;
          padding: 1rem;
          background: #f8f9fa;
        }

        .product-checkbox {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 2;
          transform: scale(1.2);
        }

        .product-image {
          width: 100%;
          height: 200px;
          object-fit: contain;
          display: block;
        }

        .product-details {
          padding: 1rem;
        }

        .brand {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .product-title {
          font-size: 1.1rem;
          margin: 0.5rem 0;
          color: #333;
        }

        .price {
          font-size: 1.2rem;
          font-weight: bold;
          color: #2c3e50;
          margin: 1rem 0;
        }

        .add-to-cart {
          width: 100%;
          padding: 0.8rem;
          background-color: #42b983;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .add-to-cart:hover {
          background-color: #359c6d;
        }

        @media (max-width: 1200px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .products-container {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 992px) {
          .products-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .products-container {
            grid-template-columns: 1fr;
          }
        }
      `})]})};export{y as default};
