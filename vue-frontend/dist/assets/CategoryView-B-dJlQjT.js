import{c as Q,f as U,u as W,b as X,r as m,j as r,L as Y}from"./index-Cov9520u.js";import{P as Z}from"./ProductCard-BOdmdCx7.js";const ae=({categoryName:w="",currentPath:s="",categoryId:y=null})=>{const{t:c}=Q();U();const M=W();X();const v=M.pathname.split("/")[1]||"ua",[f,p]=m.useState([]),[x,h]=m.useState(!0),[b,q]=m.useState(""),V={"/generators":"homeView.generators","/industrial-generators":"homeView.industrialGenerators","/solar-lighting-towers":"homeView.solarLightingTowers","/lifts-and-cranes":"homeView.liftsAndCranes","/dc-charging-stations":"homeView.dcChargingStations","/ac-charging-stations":"homeView.acChargingStations","/portable-charging-devices":"homeView.portableChargingDevices","/solar-panels":"homeView.solarPanels","/batteries":"homeView.batteries","/inverters":"homeView.inverters","/solar-sets":"homeView.solarSets","/mounting-systems":"homeView.mountingSystems"},F={"homeView.generators":"Генератори","homeView.industrialGenerators":"Промислові генератори для важких навантажень (100 кВт+)","homeView.solarLightingTowers":"Освітлювальні вежі на сонячних батареях","homeView.liftsAndCranes":"Підйомники та Крани","homeView.dcChargingStations":"Швидкі Зарядні Станції (DC)","homeView.acChargingStations":"Зарядні Станції Рівня 2 (AC)","homeView.portableChargingDevices":"Портативні/Мобільні Зарядні Пристрої","homeView.solarPanels":"Сонячні Панелі","homeView.batteries":"Батареї","homeView.inverters":"Інвертори","homeView.solarSets":"SolarSets","homeView.mountingSystems":"Система монтажу сонячних панелей"},_=["homeView.generators","homeView.industrialGenerators","homeView.solarLightingTowers","homeView.liftsAndCranes"],C=[{id:1,name:"Дизельний генератор 50кВт",type:"Генератори",price:25e3,image:"/images/generator-1.jpg",brand:"ScaleVolt",rentalPrices:{day:150,week:800,month:2500}},{id:2,name:"Промисловий генератор 150кВт",type:"Промислові генератори для важких навантажень (100 кВт+)",price:85e3,image:"/images/generator-2.jpg",brand:"ScaleVolt Pro",rentalPrices:{day:350,week:2e3,month:7500}}],P={getProducts:async(e={})=>(await new Promise(n=>setTimeout(n,500)),{data:{data:C}})},u=m.useMemo(()=>s&&Object.keys(V).includes(s),[s]),K=m.useMemo(()=>{if(w)return w;if(u){const e=V[s];return e?c(e):b}return b},[w,u,s,c,b]),O=async e=>{h(!0);const n=F[e];try{try{const t=await P.getProducts({filters:{type:{$eq:n}},populate:["general_information.images","pricing_and_inventory"]});if(t.data&&t.data.length>0){const i=t.data.map(a=>{var g,d,j,S,k,L,N,R,T,A,E,I,z,D,$,B,G;const l=_.includes(e);return{id:a.id,name:((g=a.attributes)==null?void 0:g.name)||a.name,price:((j=(d=a.attributes)==null?void 0:d.pricing_and_inventory)==null?void 0:j.price)||a.price,image:((T=(R=(N=(L=(k=(S=a.attributes)==null?void 0:S.general_information)==null?void 0:k.images)==null?void 0:L.data)==null?void 0:N[0])==null?void 0:R.attributes)==null?void 0:T.url)||a.image,brand:((E=(A=a.attributes)==null?void 0:A.general_information)==null?void 0:E.brand)||a.brand,isRentalItem:l,rentalPrices:l?{day:((z=(I=a.attributes)==null?void 0:I.pricing_and_inventory)==null?void 0:z.day_price)||150,week:(($=(D=a.attributes)==null?void 0:D.pricing_and_inventory)==null?void 0:$.week_price)||300,month:((G=(B=a.attributes)==null?void 0:B.pricing_and_inventory)==null?void 0:G.month_price)||600}:{}}});p(i);return}}catch(t){console.warn("API fetch failed, falling back to mock products",t)}const o=C.filter(t=>{var i;return t.type===n||((i=t.type)==null?void 0:i.toLowerCase())===n.toLowerCase()}).map(t=>{const i=_.includes(e);return{...t,isRentalItem:i,rentalPrices:i?t.rentalPrices||{day:150,week:300,month:600}:{}}});p(o)}catch(o){console.error("Error fetching products by type:",o),p([])}finally{h(!1)}},H=async e=>{h(!0);try{const o=(await P.getProducts({populate:["general_information.images","pricing_and_inventory"],filters:{categoryId:{$eq:e}}})).data.data.map(t=>{var i,a,l,g,d;return{id:t.id,name:t.attributes.name,price:((i=t.attributes.pricing_and_inventory)==null?void 0:i.price)||0,image:((d=(g=(l=(a=t.attributes.general_information.images)==null?void 0:a.data)==null?void 0:l[0])==null?void 0:g.attributes)==null?void 0:d.url)||"/default-image.jpg",brand:t.attributes.general_information.brand||"No Brand"}});p(o),q(o.length>0?o[0].attributes.categoryName:c("common.category"))}catch(n){console.error("Error fetching products:",n)}finally{h(!1)}},J=e=>e.images&&e.images.length>0?e.images[0]:e.image?Array.isArray(e.image)?e.image[0]:e.image:"/images/placeholder.png";return m.useEffect(()=>{if(u){const e=V[s];e&&O(e)}else y&&H(y)},[u,s,y]),r.jsxs("div",{className:"category-view",children:[r.jsx("h1",{children:K}),x&&r.jsx("div",{className:"loading-indicator",children:c("common.loading")}),!x&&f.length>0&&r.jsx("div",{className:"products-container",children:f.map(e=>r.jsx("div",{className:"product-card-wrapper",children:r.jsx(Y,{to:`/${v}/product/${e.id}`,style:{textDecoration:"none",color:"inherit"},children:r.jsx(Z,{productId:e.id,title:e.name||e.title,price:e.price,imageSrc:J(e),brand:e.brand,isRentalItem:e.isRentalItem,rentalPrices:e.rentalPrices,region:v})})},e.id))}),!x&&f.length===0&&r.jsx("div",{className:"no-products",children:r.jsx("p",{children:c("common.noProductsFound")})}),r.jsx("style",{jsx:!0,children:`
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
      `})]})};export{ae as default};
