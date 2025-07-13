import{r as c,j as e}from"./index-9GWEwC6O.js";const d=({productId:t,title:o,price:r,imageSrc:n,brand:i,onClick:s})=>e.jsxs("div",{onClick:s,style:{border:"1px solid #e5e7eb",borderRadius:"8px",padding:"16px",backgroundColor:"white",cursor:"pointer",transition:"transform 0.2s, box-shadow 0.2s",":hover":{transform:"translateY(-2px)",boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}},children:[e.jsx("img",{src:n||"/placeholder-product.jpg",alt:o,style:{width:"100%",height:"200px",objectFit:"cover",borderRadius:"4px",marginBottom:"12px"}}),e.jsx("h3",{style:{fontSize:"16px",fontWeight:"600",marginBottom:"8px",color:"#333"},children:o}),e.jsx("p",{style:{fontSize:"14px",color:"#666",marginBottom:"8px"},children:i}),e.jsxs("p",{style:{fontSize:"18px",fontWeight:"bold",color:"#0066cc"},children:["$",r]})]}),p=({breadcrumbs:t,className:o})=>e.jsx("nav",{className:o,children:e.jsx("ol",{style:{display:"flex",listStyle:"none",padding:0,margin:0,fontSize:"14px",color:"#666"},children:t.map((r,n)=>e.jsxs("li",{style:{display:"flex",alignItems:"center"},children:[r.link?e.jsx("a",{href:r.link,style:{color:"#0066cc",textDecoration:"none",":hover":{textDecoration:"underline"}},onClick:i=>{i.preventDefault(),console.log("Navigate to:",r.link)},children:r.name}):e.jsx("span",{style:{color:"#333"},children:r.name}),n<t.length-1&&e.jsx("span",{style:{margin:"0 8px",color:"#999"},children:"/"})]},n))})}),l=t=>({"homeView.solarPanels":"Solar Panels","common.home":"Home","common.categories":"Categories","product.solar.monocrystalline":"Monocrystalline","product.solar.polycrystalline":"Polycrystalline","product.solar.flexible":"Flexible Solar Panel","product.solar.bifacial":"Bifacial Solar Panel"})[t]||t,m=()=>({getProducts:[{id:1,categoryId:1,nameKey:"product.solar.monocrystalline",defaultName:"400W High Efficiency",price:299.99,image:"/api/placeholder/300/200",brand:"SunPower",uniqueKey:1},{id:2,categoryId:1,nameKey:"product.solar.polycrystalline",defaultName:"350W Standard",price:249.99,image:"/api/placeholder/300/200",brand:"Canadian Solar",uniqueKey:2},{id:3,categoryId:1,nameKey:"product.solar.flexible",defaultName:"100W Portable",price:199.99,image:"/api/placeholder/300/200",brand:"Renogy",uniqueKey:3},{id:4,categoryId:1,nameKey:"product.solar.bifacial",defaultName:"450W Double Glass",price:399.99,image:"/api/placeholder/300/200",brand:"Longi Solar",uniqueKey:4},{id:5,categoryId:1,nameKey:"product.solar.monocrystalline",defaultName:"500W Premium",price:449.99,image:"/api/placeholder/300/200",brand:"JinkoSolar",uniqueKey:5}]}),g=()=>{const o=m(),r=c.useMemo(()=>o.getProducts.filter(a=>+a.categoryId==1),[o.getProducts,1]),n=a=>l(a.nameKey)+" "+a.defaultName,i=c.useMemo(()=>[{name:l("common.home"),link:"/"},{name:l("common.categories"),link:"/catalogue"},{name:l("homeView.solarPanels")}],[]),s=a=>{console.log("Navigate to product:",a)};return e.jsxs("div",{className:"catalogue-view",children:[e.jsx(p,{breadcrumbs:i,className:"breadcrumb-spacing"}),e.jsx("h1",{children:l("homeView.solarPanels")}),e.jsx("div",{className:"products-container",children:r.map(a=>e.jsx("div",{className:"product-card-wrapper",children:e.jsx(d,{productId:a.id,title:n(a),price:a.price,imageSrc:a.image,brand:a.brand,onClick:()=>s(a.id)})},a.uniqueKey))}),e.jsx("style",{jsx:!0,children:`
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
      `})]})};export{g as default};
