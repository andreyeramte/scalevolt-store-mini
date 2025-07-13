import{r as c,j as e}from"./index-9GWEwC6O.js";const l=({productId:a,title:t,price:o,imageSrc:i,brand:d,onClick:n})=>e.jsxs("div",{onClick:n,style:{border:"1px solid #e5e7eb",borderRadius:"8px",padding:"16px",backgroundColor:"white",cursor:"pointer",transition:"transform 0.2s, box-shadow 0.2s",":hover":{transform:"translateY(-2px)",boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}},children:[e.jsx("img",{src:i||"/placeholder-product.jpg",alt:t,style:{width:"100%",height:"200px",objectFit:"cover",borderRadius:"4px",marginBottom:"12px"}}),e.jsx("h3",{style:{fontSize:"16px",fontWeight:"600",marginBottom:"8px",color:"#333"},children:t}),e.jsx("p",{style:{fontSize:"14px",color:"#666",marginBottom:"8px"},children:d}),e.jsxs("p",{style:{fontSize:"18px",fontWeight:"bold",color:"#0066cc"},children:["$",o]})]}),p=({breadcrumbs:a,className:t})=>e.jsx("nav",{className:t,children:e.jsx("ol",{style:{display:"flex",listStyle:"none",padding:0,margin:0,fontSize:"14px",color:"#666"},children:a.map((o,i)=>e.jsxs("li",{style:{display:"flex",alignItems:"center"},children:[o.link?e.jsx("a",{href:o.link,style:{color:"#0066cc",textDecoration:"none",":hover":{textDecoration:"underline"}},onClick:d=>{d.preventDefault(),console.log("Navigate to:",o.link)},children:o.name}):e.jsx("span",{style:{color:"#333"},children:o.name}),i<a.length-1&&e.jsx("span",{style:{margin:"0 8px",color:"#999"},children:"/"})]},i))})}),m=(a,t)=>({"product.solarset.residential":"Residential Solar Kit","product.solarset.commercial":"Commercial Solar System","product.solarset.offgrid":"Off-Grid Solar Package","product.solarset.hybrid":"Hybrid Solar System"})[a]||t||a,g=()=>({getProducts:[{id:1,categoryId:4,nameKey:"product.solarset.residential",defaultName:"5kW Complete Home Kit",price:4999.99,image:"/api/placeholder/300/200",brand:"SolarHome Pro"},{id:2,categoryId:4,nameKey:"product.solarset.commercial",defaultName:"50kW Business System",price:35999.99,image:"/api/placeholder/300/200",brand:"CommercialSolar"},{id:3,categoryId:4,nameKey:"product.solarset.offgrid",defaultName:"3kW Off-Grid Package",price:3499.99,image:"/api/placeholder/300/200",brand:"OffGrid Solutions"},{id:4,categoryId:4,nameKey:"product.solarset.hybrid",defaultName:"8kW Hybrid System",price:7999.99,image:"/api/placeholder/300/200",brand:"HybridTech"}]}),x=()=>{const t=g(),o=c.useMemo(()=>t.getProducts.filter(r=>+r.categoryId==4).map(r=>({...r,uniqueKey:r.id})),[t.getProducts,4]),i=r=>m(r.nameKey,r.defaultName),d=[{name:"Home",link:"/"},{name:"Каталог",link:"/catalogue"},{name:"SolarSets"}],n="SolarSets",s=r=>{console.log("Navigate to product:",r)};return e.jsxs("div",{className:"catalogue-view",children:[e.jsx(p,{breadcrumbs:d,className:"breadcrumb-spacing"}),e.jsx("h1",{children:n}),e.jsx("div",{className:"products-container",children:o.map(r=>e.jsx("div",{className:"product-card-wrapper",children:e.jsx(l,{productId:r.id,title:i(r),price:r.price,imageSrc:r.image,brand:r.brand,onClick:()=>s(r.id)})},r.uniqueKey))}),e.jsx("style",{jsx:!0,children:`
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
      `})]})};export{x as default};
