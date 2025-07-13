import{r as d,j as e}from"./index-9GWEwC6O.js";const l=({productId:o,title:t,price:r,imageSrc:i,brand:n,onClick:c})=>e.jsxs("div",{onClick:c,style:{border:"1px solid #e5e7eb",borderRadius:"8px",padding:"16px",backgroundColor:"white",cursor:"pointer",transition:"transform 0.2s, box-shadow 0.2s",":hover":{transform:"translateY(-2px)",boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}},children:[e.jsx("img",{src:i||"/placeholder-product.jpg",alt:t,style:{width:"100%",height:"200px",objectFit:"cover",borderRadius:"4px",marginBottom:"12px"}}),e.jsx("h3",{style:{fontSize:"16px",fontWeight:"600",marginBottom:"8px",color:"#333"},children:t}),e.jsx("p",{style:{fontSize:"14px",color:"#666",marginBottom:"8px"},children:n}),e.jsxs("p",{style:{fontSize:"18px",fontWeight:"bold",color:"#0066cc"},children:["$",r]})]}),p=({breadcrumbs:o,className:t})=>e.jsx("nav",{className:t,children:e.jsx("ol",{style:{display:"flex",listStyle:"none",padding:0,margin:0,fontSize:"14px",color:"#666"},children:o.map((r,i)=>e.jsxs("li",{style:{display:"flex",alignItems:"center"},children:[r.link?e.jsx("a",{href:r.link,style:{color:"#0066cc",textDecoration:"none",":hover":{textDecoration:"underline"}},onClick:n=>{n.preventDefault(),console.log("Navigate to:",r.link)},children:r.name}):e.jsx("span",{style:{color:"#333"},children:r.name}),i<o.length-1&&e.jsx("span",{style:{margin:"0 8px",color:"#999"},children:"/"})]},i))})}),s=o=>({"header.categories.batteries":"Batteries","common.home":"Home","common.categories":"Categories"})[o]||o,m=()=>({getProducts:[{id:1,categoryId:2,nameKey:"product.battery.lithium",defaultName:"Lithium Battery 12V",price:299.99,image:"/api/placeholder/300/200",brand:"PowerMax"},{id:2,categoryId:2,nameKey:"product.battery.solar",defaultName:"Solar Battery 24V",price:459.99,image:"/api/placeholder/300/200",brand:"SolarTech"},{id:3,categoryId:2,nameKey:"product.battery.marine",defaultName:"Marine Battery 12V",price:189.99,image:"/api/placeholder/300/200",brand:"AquaPower"},{id:4,categoryId:2,nameKey:"product.battery.automotive",defaultName:"Automotive Battery",price:129.99,image:"/api/placeholder/300/200",brand:"AutoMax"},{id:5,categoryId:2,nameKey:"product.battery.ups",defaultName:"UPS Battery 48V",price:349.99,image:"/api/placeholder/300/200",brand:"BackupPro"}]}),u=()=>{const t=m(),r=d.useMemo(()=>t.getProducts.filter(a=>+a.categoryId==2).map(a=>({...a,uniqueKey:a.id})),[t.getProducts,2]),i=a=>s(a.nameKey)+" "+a.defaultName,n=d.useMemo(()=>[{name:s("common.home"),link:"/"},{name:s("common.categories"),link:"/catalogue"},{name:s("header.categories.batteries")}],[]),c=a=>{console.log("Navigate to product:",a)};return e.jsxs("div",{className:"catalogue-view",children:[e.jsx(p,{breadcrumbs:n,className:"breadcrumb-spacing"}),e.jsx("h1",{children:s("header.categories.batteries")}),e.jsx("div",{className:"products-container",children:r.map(a=>e.jsx("div",{className:"product-card-wrapper",children:e.jsx(l,{productId:a.id,title:i(a),price:a.price,imageSrc:a.image,brand:a.brand,onClick:()=>c(a.id)})},a.uniqueKey))}),e.jsx("style",{jsx:!0,children:`
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
      `})]})};export{u as default};
