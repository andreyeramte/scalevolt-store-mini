import{u as Y,e as H,f as J,r as d,j as a}from"./index-9GWEwC6O.js";const Q=({productId:w,title:r,price:p,imageSrc:l,brand:h,isRentalItem:m,rentalPrices:o,onClick:g})=>a.jsxs("div",{onClick:g,style:{border:"1px solid #e5e7eb",borderRadius:"8px",padding:"16px",backgroundColor:"white",cursor:"pointer",transition:"transform 0.2s, box-shadow 0.2s",":hover":{transform:"translateY(-2px)",boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}},children:[a.jsx("img",{src:l||"/placeholder-product.jpg",alt:r,style:{width:"100%",height:"200px",objectFit:"cover",borderRadius:"4px",marginBottom:"12px"}}),a.jsx("h3",{style:{fontSize:"16px",fontWeight:"600",marginBottom:"8px",color:"#333"},children:r}),a.jsx("p",{style:{fontSize:"14px",color:"#666",marginBottom:"8px"},children:h}),m&&o?a.jsx("div",{style:{marginBottom:"8px"},children:a.jsxs("p",{style:{fontSize:"14px",color:"#666",marginBottom:"4px"},children:["Day: $",o.day," | Week: $",o.week," | Month: $",o.month]})}):a.jsxs("p",{style:{fontSize:"18px",fontWeight:"bold",color:"#0066cc"},children:["$",p]})]}),X=({categoryName:w="",currentPath:r="",categoryId:p=null})=>{const{t:l}=Y();H(),J();const[h,m]=d.useState([]),[o,g]=d.useState(!0),[b,M]=d.useState(""),V={"/generators":"homeView.generators","/industrial-generators":"homeView.industrialGenerators","/solar-lighting-towers":"homeView.solarLightingTowers","/lifts-and-cranes":"homeView.liftsAndCranes","/dc-charging-stations":"homeView.dcChargingStations","/ac-charging-stations":"homeView.acChargingStations","/portable-charging-devices":"homeView.portableChargingDevices","/solar-panels":"homeView.solarPanels","/batteries":"homeView.batteries","/inverters":"homeView.inverters","/solar-sets":"homeView.solarSets","/mounting-systems":"homeView.mountingSystems"},F={"homeView.generators":"Генератори","homeView.industrialGenerators":"Промислові генератори для важких навантажень (100 кВт+)","homeView.solarLightingTowers":"Освітлювальні вежі на сонячних батареях","homeView.liftsAndCranes":"Підйомники та Крани","homeView.dcChargingStations":"Швидкі Зарядні Станції (DC)","homeView.acChargingStations":"Зарядні Станції Рівня 2 (AC)","homeView.portableChargingDevices":"Портативні/Мобільні Зарядні Пристрої","homeView.solarPanels":"Сонячні Панелі","homeView.batteries":"Батареї","homeView.inverters":"Інвертори","homeView.solarSets":"SolarSets","homeView.mountingSystems":"Система монтажу сонячних панелей"},v=["homeView.generators","homeView.industrialGenerators","homeView.solarLightingTowers","homeView.liftsAndCranes"],j=[{id:1,name:"Дизельний генератор 50кВт",type:"Генератори",price:25e3,image:"/images/generator-1.jpg",brand:"ScaleVolt",rentalPrices:{day:150,week:800,month:2500}},{id:2,name:"Промисловий генератор 150кВт",type:"Промислові генератори для важких навантажень (100 кВт+)",price:85e3,image:"/images/generator-2.jpg",brand:"ScaleVolt Pro",rentalPrices:{day:350,week:2e3,month:7500}}],C={getProducts:async(e={})=>(await new Promise(s=>setTimeout(s,500)),{data:{data:j}})},f=d.useMemo(()=>r&&Object.keys(V).includes(r),[r]),G=d.useMemo(()=>{if(w)return w;if(f){const e=V[r];return e?l(e):b}return b},[w,f,r,l,b]),W=async e=>{g(!0);const s=F[e];try{try{const t=await C.getProducts({filters:{type:{$eq:s}},populate:["general_information.images","pricing_and_inventory"]});if(t.data&&t.data.length>0){const n=t.data.map(i=>{var y,x,_,S,P,k,R,T,z,B,N,A,I,L,E,$,D;const u=v.includes(e);return{id:i.id,name:((y=i.attributes)==null?void 0:y.name)||i.name,price:((_=(x=i.attributes)==null?void 0:x.pricing_and_inventory)==null?void 0:_.price)||i.price,image:((z=(T=(R=(k=(P=(S=i.attributes)==null?void 0:S.general_information)==null?void 0:P.images)==null?void 0:k.data)==null?void 0:R[0])==null?void 0:T.attributes)==null?void 0:z.url)||i.image,brand:((N=(B=i.attributes)==null?void 0:B.general_information)==null?void 0:N.brand)||i.brand,isRentalItem:u,rentalPrices:u?{day:((I=(A=i.attributes)==null?void 0:A.pricing_and_inventory)==null?void 0:I.day_price)||150,week:((E=(L=i.attributes)==null?void 0:L.pricing_and_inventory)==null?void 0:E.week_price)||300,month:((D=($=i.attributes)==null?void 0:$.pricing_and_inventory)==null?void 0:D.month_price)||600}:{}}});m(n);return}}catch(t){console.warn("API fetch failed, falling back to mock products",t)}const c=j.filter(t=>{var n;return t.type===s||((n=t.type)==null?void 0:n.toLowerCase())===s.toLowerCase()}).map(t=>{const n=v.includes(e);return{...t,isRentalItem:n,rentalPrices:n?t.rentalPrices||{day:150,week:300,month:600}:{}}});m(c)}catch(c){console.error("Error fetching products by type:",c),m([])}finally{g(!1)}},q=async e=>{g(!0);try{const c=(await C.getProducts({populate:["general_information.images","pricing_and_inventory"],filters:{categoryId:{$eq:e}}})).data.data.map(t=>{var n,i,u,y,x;return{id:t.id,name:t.attributes.name,price:((n=t.attributes.pricing_and_inventory)==null?void 0:n.price)||0,image:((x=(y=(u=(i=t.attributes.general_information.images)==null?void 0:i.data)==null?void 0:u[0])==null?void 0:y.attributes)==null?void 0:x.url)||"/default-image.jpg",brand:t.attributes.general_information.brand||"No Brand"}});m(c),M(c.length>0?c[0].attributes.categoryName:l("common.category"))}catch(s){console.error("Error fetching products:",s)}finally{g(!1)}},K=e=>e.images&&e.images.length>0?e.images[0]:e.image?Array.isArray(e.image)?e.image[0]:e.image:"/images/placeholder.png";d.useEffect(()=>{if(f){const e=V[r];e&&W(e)}else p&&q(p)},[f,r,p]);const O=e=>{console.log("Navigate to product:",e)};return a.jsxs("div",{className:"category-view",children:[a.jsx("h1",{children:G}),o&&a.jsx("div",{className:"loading-indicator",children:l("common.loading")}),!o&&h.length>0&&a.jsx("div",{className:"products-container",children:h.map(e=>a.jsx(Q,{productId:e.id,title:e.name||e.title,price:e.price,imageSrc:K(e),brand:e.brand,isRentalItem:e.isRentalItem,rentalPrices:e.rentalPrices,onClick:()=>O(e.id)},e.id))}),!o&&h.length===0&&a.jsx("div",{className:"no-products",children:a.jsx("p",{children:l("common.noProductsFound")})}),a.jsx("style",{jsx:!0,children:`
        .category-view {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .category-view h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
        }

        .loading-indicator {
          text-align: center;
          padding: 40px;
          font-size: 18px;
          color: #666;
        }

        .products-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .no-products {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .no-products p {
          font-size: 18px;
          margin: 0;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .category-view {
            padding: 15px;
          }
          
          .category-view h1 {
            font-size: 1.5rem;
          }
          
          .products-container {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
          }
        }

        @media (max-width: 480px) {
          .products-container {
            grid-template-columns: 1fr;
          }
        }
      `})]})};export{X as default};
