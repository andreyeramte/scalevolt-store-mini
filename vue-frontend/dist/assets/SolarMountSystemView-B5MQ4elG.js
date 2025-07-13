import{r as s,j as e}from"./index-9GWEwC6O.js";const l=({productId:a,title:o,price:t,imageSrc:n,brand:i,onClick:c})=>e.jsxs("div",{onClick:c,style:{border:"1px solid #e5e7eb",borderRadius:"8px",padding:"16px",backgroundColor:"white",cursor:"pointer",transition:"transform 0.2s, box-shadow 0.2s",":hover":{transform:"translateY(-2px)",boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}},children:[e.jsx("img",{src:n||"/placeholder-product.jpg",alt:o,style:{width:"100%",height:"200px",objectFit:"cover",borderRadius:"4px",marginBottom:"12px"}}),e.jsx("h3",{style:{fontSize:"16px",fontWeight:"600",marginBottom:"8px",color:"#333"},children:o}),e.jsx("p",{style:{fontSize:"14px",color:"#666",marginBottom:"8px"},children:i}),e.jsxs("p",{style:{fontSize:"18px",fontWeight:"bold",color:"#0066cc"},children:["$",t]})]}),p=({breadcrumbs:a,className:o})=>e.jsx("nav",{className:o,children:e.jsx("ol",{style:{display:"flex",listStyle:"none",padding:0,margin:0,fontSize:"14px",color:"#666"},children:a.map((t,n)=>e.jsxs("li",{style:{display:"flex",alignItems:"center"},children:[t.link?e.jsx("a",{href:t.link,style:{color:"#0066cc",textDecoration:"none",":hover":{textDecoration:"underline"}},onClick:i=>{i.preventDefault(),console.log("Navigate to:",t.link)},children:t.name}):e.jsx("span",{style:{color:"#333"},children:t.name}),n<a.length-1&&e.jsx("span",{style:{margin:"0 8px",color:"#999"},children:"/"})]},n))})}),m=(a,o)=>({"product.mount.roof":"Roof Mount System","product.mount.ground":"Ground Mount System","product.mount.carport":"Carport Mount System","product.mount.tracker":"Solar Tracker Mount"})[a]||o||a,u=()=>({getProducts:[{id:1,categoryId:5,nameKey:"product.mount.roof",defaultName:"Roof Mount Kit Standard",price:299.99,image:"/api/placeholder/300/200",brand:"SolarMount Pro"},{id:2,categoryId:5,nameKey:"product.mount.ground",defaultName:"Ground Mount System",price:599.99,image:"/api/placeholder/300/200",brand:"TerraMount"},{id:3,categoryId:5,nameKey:"product.mount.carport",defaultName:"Carport Mount Structure",price:1299.99,image:"/api/placeholder/300/200",brand:"CarSolar"},{id:4,categoryId:5,nameKey:"product.mount.tracker",defaultName:"Single Axis Tracker",price:2199.99,image:"/api/placeholder/300/200",brand:"TrackerTech"}]}),x=()=>{const o=u(),t=s.useMemo(()=>o.getProducts.filter(r=>+r.categoryId==5).map(r=>({...r,uniqueKey:r.id})),[o.getProducts,5]),n=r=>m(r.nameKey,r.defaultName),i=[{name:"Home",link:"/"},{name:"Каталог",link:"/catalogue"},{name:"Система монтажу сонячних панелей"}],c="Система монтажу сонячних панелей",d=r=>{console.log("Navigate to product:",r)};return e.jsxs("div",{className:"catalogue-view",children:[e.jsx(p,{breadcrumbs:i,className:"breadcrumb-spacing"}),e.jsx("h1",{children:c}),e.jsx("div",{className:"products-container",children:t.map(r=>e.jsx("div",{className:"product-card-wrapper",children:e.jsx(l,{productId:r.id,title:n(r),price:r.price,imageSrc:r.image,brand:r.brand,onClick:()=>d(r.id)})},r.uniqueKey))}),e.jsx("style",{jsx:!0,children:`
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
      `})]})};export{x as default};
