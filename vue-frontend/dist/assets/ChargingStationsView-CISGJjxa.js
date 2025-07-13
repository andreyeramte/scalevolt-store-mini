import{r as l,j as e}from"./index-9GWEwC6O.js";const d=({productId:t,title:n,price:a,imageSrc:o,brand:i,onClick:s})=>e.jsxs("div",{onClick:s,style:{border:"1px solid #e5e7eb",borderRadius:"8px",padding:"16px",backgroundColor:"white",cursor:"pointer",transition:"transform 0.2s, box-shadow 0.2s",":hover":{transform:"translateY(-2px)",boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}},children:[e.jsx("img",{src:o||"/placeholder-product.jpg",alt:n,style:{width:"100%",height:"200px",objectFit:"cover",borderRadius:"4px",marginBottom:"12px"}}),e.jsx("h3",{style:{fontSize:"16px",fontWeight:"600",marginBottom:"8px",color:"#333"},children:n}),e.jsx("p",{style:{fontSize:"14px",color:"#666",marginBottom:"8px"},children:i}),e.jsxs("p",{style:{fontSize:"18px",fontWeight:"bold",color:"#0066cc"},children:["$",a]})]}),c=({breadcrumbs:t,className:n})=>e.jsx("nav",{className:n,children:e.jsx("ol",{style:{display:"flex",listStyle:"none",padding:0,margin:0,fontSize:"14px",color:"#666"},children:t.map((a,o)=>e.jsxs("li",{style:{display:"flex",alignItems:"center"},children:[a.link?e.jsx("a",{href:a.link,style:{color:"#0066cc",textDecoration:"none",":hover":{textDecoration:"underline"}},onClick:i=>{i.preventDefault(),console.log("Navigate to:",a.link)},children:a.name}):e.jsx("span",{style:{color:"#333"},children:a.name}),o<t.length-1&&e.jsx("span",{style:{margin:"0 8px",color:"#999"},children:"/"})]},o))})}),m=({categoryId:t=null})=>{const n=[{id:11,name:"Octa Wall 2 Plug",price:500,image:"/images/dvushka_connectors0001_white.png",brand:"Delta",categoryId:2},{id:12,name:"Octa Wall 3 Plug",price:700,image:"/images/treshka_connectors0001_white.png",brand:"ABB",categoryId:2}],a=l.useMemo(()=>t?n.filter(r=>r.categoryId===Number(t)):n,[t]),o=[{name:"Головна",link:"/"},{name:"Низьковольтна Продукція",link:"/low-voltage"},{name:"Зарядки"}],i="Зарядки",s=r=>{console.log("Navigate to product:",r)};return e.jsxs("div",{className:"catalogue-view",children:[e.jsx(c,{breadcrumbs:o,className:"breadcrumb-spacing"}),e.jsx("h1",{children:i}),e.jsx("div",{className:"products-container",children:a.map(r=>e.jsx("div",{className:"product-card-wrapper",children:e.jsx(d,{productId:r.id,title:r.name,price:r.price,imageSrc:r.image,brand:r.brand,onClick:()=>s(r.id)})},r.id))}),e.jsx("style",{jsx:!0,children:`
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

        /* Optional spacing for the breadcrumb. */
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

        @media (max-width: 1600px) {
          .products-container {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        @media (max-width: 1200px) {
          .products-container {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 992px) {
          .products-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .products-container {
            grid-template-columns: 1fr;
          }
        }
      `})]})};export{m as default};
