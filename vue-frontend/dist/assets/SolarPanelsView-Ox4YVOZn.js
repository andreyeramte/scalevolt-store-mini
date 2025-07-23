import{u as p,r as s,j as e,L as u}from"./index-Cov9520u.js";import{P as g}from"./ProductCard-BOdmdCx7.js";const x=({breadcrumbs:o,className:n})=>e.jsx("nav",{className:n,children:e.jsx("ol",{style:{display:"flex",listStyle:"none",padding:0,margin:0,fontSize:"14px",color:"#666"},children:o.map((r,t)=>e.jsxs("li",{style:{display:"flex",alignItems:"center"},children:[r.link?e.jsx("a",{href:r.link,style:{color:"#0066cc",textDecoration:"none",":hover":{textDecoration:"underline"}},onClick:l=>{l.preventDefault(),console.log("Navigate to:",r.link)},children:r.name}):e.jsx("span",{style:{color:"#333"},children:r.name}),t<o.length-1&&e.jsx("span",{style:{margin:"0 8px",color:"#999"},children:"/"})]},t))})}),i=o=>({"homeView.solarPanels":"Solar Panels","common.home":"Home","common.categories":"Categories","product.solar.monocrystalline":"Monocrystalline","product.solar.polycrystalline":"Polycrystalline","product.solar.flexible":"Flexible Solar Panel","product.solar.bifacial":"Bifacial Solar Panel"})[o]||o,y=()=>({getProducts:[{id:1,categoryId:1,nameKey:"product.solar.monocrystalline",defaultName:"400W High Efficiency",price:299.99,image:"/api/placeholder/300/200",brand:"SunPower",uniqueKey:1},{id:2,categoryId:1,nameKey:"product.solar.polycrystalline",defaultName:"350W Standard",price:249.99,image:"/api/placeholder/300/200",brand:"Canadian Solar",uniqueKey:2},{id:3,categoryId:1,nameKey:"product.solar.flexible",defaultName:"100W Portable",price:199.99,image:"/api/placeholder/300/200",brand:"Renogy",uniqueKey:3},{id:4,categoryId:1,nameKey:"product.solar.bifacial",defaultName:"450W Double Glass",price:399.99,image:"/api/placeholder/300/200",brand:"Longi Solar",uniqueKey:4},{id:5,categoryId:1,nameKey:"product.solar.monocrystalline",defaultName:"500W Premium",price:449.99,image:"/api/placeholder/300/200",brand:"JinkoSolar",uniqueKey:5}]}),b=()=>{const n=p().pathname.split("/")[1]||"ua",r=1,t=y(),l=s.useMemo(()=>t.getProducts.filter(a=>+a.categoryId===r),[t.getProducts,r]),c=a=>i(a.nameKey)+" "+a.defaultName,d=s.useMemo(()=>[{name:i("common.home"),link:"/"},{name:i("common.categories"),link:"/catalogue"},{name:i("homeView.solarPanels")}],[]);return e.jsxs("div",{className:"catalogue-view",children:[e.jsx(x,{breadcrumbs:d,className:"breadcrumb-spacing"}),e.jsx("h1",{children:i("homeView.solarPanels")}),e.jsx("div",{className:"products-container",children:l.map(a=>{const m=a.image||"/images/placeholder.png";return e.jsx("div",{className:"product-card-wrapper",children:e.jsx(u,{to:`/${n}/product/${a.id}`,style:{textDecoration:"none",color:"inherit"},children:e.jsx(g,{productId:a.id,title:c(a),price:a.price,imageSrc:m,brand:a.brand,region:n})})},a.uniqueKey)})}),e.jsx("style",{jsx:!0,children:`
        .catalogue-view {
          padding-top: 120px; /* Header height + 10px buffer */
          margin-top: 80px;
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
      `})]})};export{b as default};
