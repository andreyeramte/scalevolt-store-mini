import{u as l,r as c,j as e,L as d}from"./index-Cov9520u.js";import{P as p}from"./ProductCard-BOdmdCx7.js";const m=({breadcrumbs:t,className:o})=>e.jsx("nav",{className:o,children:e.jsx("ol",{style:{display:"flex",listStyle:"none",padding:0,margin:0,fontSize:"14px",color:"#666"},children:t.map((r,n)=>e.jsxs("li",{style:{display:"flex",alignItems:"center"},children:[r.link?e.jsx("a",{href:r.link,style:{color:"#0066cc",textDecoration:"none",":hover":{textDecoration:"underline"}},onClick:i=>{i.preventDefault(),console.log("Navigate to:",r.link)},children:r.name}):e.jsx("span",{style:{color:"#333"},children:r.name}),n<t.length-1&&e.jsx("span",{style:{margin:"0 8px",color:"#999"},children:"/"})]},n))})}),h=({categoryId:t=null})=>{const r=l().pathname.split("/")[1]||"ua",n=[{id:11,name:"Octa Wall 2 Plug",price:500,image:"/images/dvushka_connectors0001_white.png",brand:"Delta",categoryId:2},{id:12,name:"Octa Wall 3 Plug",price:700,image:"/images/treshka_connectors0001_white.png",brand:"ABB",categoryId:2}],i=c.useMemo(()=>t?n.filter(a=>a.categoryId===Number(t)):n,[t]),s=[{name:"Головна",link:"/"},{name:"Низьковольтна Продукція",link:"/low-voltage"},{name:"Зарядки"}];return e.jsxs("div",{className:"catalogue-view",children:[e.jsx(m,{breadcrumbs:s,className:"breadcrumb-spacing"}),e.jsx("h1",{children:"Зарядки"}),e.jsx("div",{className:"products-container",children:i.map(a=>e.jsx("div",{className:"product-card-wrapper",children:e.jsx(d,{to:`/${r}/product/${a.id}`,style:{textDecoration:"none",color:"inherit"},children:e.jsx(p,{productId:a.id,title:a.name,price:a.price,imageSrc:a.image,brand:a.brand,region:r})})},a.id))}),e.jsx("style",{jsx:!0,children:`
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
      `})]})};export{h as default};
