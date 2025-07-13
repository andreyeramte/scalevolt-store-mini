import{j as n,L as w,a as E,u as T,r as S,b as _}from"./index-9GWEwC6O.js";const D=({breadcrumbs:c=[]})=>{const l=c.length?c:[{name:"Home",link:"/"}];return n.jsxs("nav",{className:"breadcrumb-wrapper",children:[n.jsx("ol",{className:"breadcrumb-list",children:l.map((r,t)=>n.jsx("li",{className:"breadcrumb-item",children:r.link?n.jsx(w,{to:r.link,children:r.name}):n.jsx("span",{children:r.name})},t))}),n.jsx("style",{jsx:!0,children:`
        /* Existing example code */
        .catalogue-view {
          margin-top: 80px; /* Adjust as needed so the breadcrumb isn't behind a fixed header */
        }
        .breadcrumb-spacing {
          margin-bottom: 1rem;
          /* margin-top: 1rem; if you want additional top spacing just for the breadcrumb */
        }
        .products-container {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 15px;
          padding: 20px;
          background-color: #f9fafb;
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

        /* ──────────────────────────────────────────────────────────
           NEW BREADCRUMB STYLES (for "Store > Portable Energy" look)
           ────────────────────────────────────────────────────────── */

        .breadcrumb-wrapper {
          /* Light background color behind the breadcrumb */
          background-color: #f8f4ed;
          padding: 8px 16px;
        }

        .breadcrumb-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: inline-block;
          font-family: Arial, sans-serif;
          font-size: 14px;
        }

        .breadcrumb-item {
          display: inline;
          color: #333;
        }

        /* Insert '>' as the separator between items */
        .breadcrumb-item + .breadcrumb-item::before {
          content: '>';
          margin: 0 6px;
          color: #333;
        }

        /* Breadcrumb links */
        .breadcrumb-item a {
          text-decoration: none;
          color: #000; /* black text */
        }

        .breadcrumb-item a:hover {
          text-decoration: underline;
        }
      `})]})},H={};function R(c,l){let r;try{r=c()}catch{return}return{getItem:a=>{var e;const p=f=>f===null?null:JSON.parse(f,void 0),h=(e=r.getItem(a))!=null?e:null;return h instanceof Promise?h.then(p):p(h)},setItem:(a,e)=>r.setItem(a,JSON.stringify(e,void 0)),removeItem:a=>r.removeItem(a)}}const I=c=>l=>{try{const r=c(l);return r instanceof Promise?r:{then(t){return I(t)(r)},catch(t){return this}}}catch(r){return{then(t){return this},catch(t){return I(t)(r)}}}},L=(c,l)=>(r,t,a)=>{let e={getStorage:()=>localStorage,serialize:JSON.stringify,deserialize:JSON.parse,partialize:o=>o,version:0,merge:(o,g)=>({...g,...o}),...l},p=!1;const h=new Set,f=new Set;let u;try{u=e.getStorage()}catch{}if(!u)return c((...o)=>{console.warn(`[zustand persist middleware] Unable to update item '${e.name}', the given storage is currently unavailable.`),r(...o)},t,a);const x=I(e.serialize),j=()=>{const o=e.partialize({...t()});let g;const i=x({state:o,version:e.version}).then(v=>u.setItem(e.name,v)).catch(v=>{g=v});if(g)throw g;return i},b=a.setState;a.setState=(o,g)=>{b(o,g),j()};const y=c((...o)=>{r(...o),j()},t,a);let d;const s=()=>{var o;if(!u)return;p=!1,h.forEach(i=>i(t()));const g=((o=e.onRehydrateStorage)==null?void 0:o.call(e,t()))||void 0;return I(u.getItem.bind(u))(e.name).then(i=>{if(i)return e.deserialize(i)}).then(i=>{if(i)if(typeof i.version=="number"&&i.version!==e.version){if(e.migrate)return e.migrate(i.state,i.version);console.error("State loaded from storage couldn't be migrated since no migrate function was provided")}else return i.state}).then(i=>{var v;return d=e.merge(i,(v=t())!=null?v:y),r(d,!0),j()}).then(()=>{g==null||g(d,void 0),p=!0,f.forEach(i=>i(d))}).catch(i=>{g==null||g(void 0,i)})};return a.persist={setOptions:o=>{e={...e,...o},o.getStorage&&(u=o.getStorage())},clearStorage:()=>{u==null||u.removeItem(e.name)},getOptions:()=>e,rehydrate:()=>s(),hasHydrated:()=>p,onHydrate:o=>(h.add(o),()=>{h.delete(o)}),onFinishHydration:o=>(f.add(o),()=>{f.delete(o)})},s(),d||y},A=(c,l)=>(r,t,a)=>{let e={storage:R(()=>localStorage),partialize:s=>s,version:0,merge:(s,o)=>({...o,...s}),...l},p=!1;const h=new Set,f=new Set;let u=e.storage;if(!u)return c((...s)=>{console.warn(`[zustand persist middleware] Unable to update item '${e.name}', the given storage is currently unavailable.`),r(...s)},t,a);const x=()=>{const s=e.partialize({...t()});return u.setItem(e.name,{state:s,version:e.version})},j=a.setState;a.setState=(s,o)=>{j(s,o),x()};const b=c((...s)=>{r(...s),x()},t,a);a.getInitialState=()=>b;let y;const d=()=>{var s,o;if(!u)return;p=!1,h.forEach(i=>{var v;return i((v=t())!=null?v:b)});const g=((o=e.onRehydrateStorage)==null?void 0:o.call(e,(s=t())!=null?s:b))||void 0;return I(u.getItem.bind(u))(e.name).then(i=>{if(i)if(typeof i.version=="number"&&i.version!==e.version){if(e.migrate)return[!0,e.migrate(i.state,i.version)];console.error("State loaded from storage couldn't be migrated since no migrate function was provided")}else return[!1,i.state];return[!1,void 0]}).then(i=>{var v;const[C,N]=i;if(y=e.merge(N,(v=t())!=null?v:b),r(y,!0),C)return x()}).then(()=>{g==null||g(y,void 0),y=t(),p=!0,f.forEach(i=>i(y))}).catch(i=>{g==null||g(void 0,i)})};return a.persist={setOptions:s=>{e={...e,...s},s.storage&&(u=s.storage)},clearStorage:()=>{u==null||u.removeItem(e.name)},getOptions:()=>e,rehydrate:()=>d(),hasHydrated:()=>p,onHydrate:s=>(h.add(s),()=>{h.delete(s)}),onFinishHydration:s=>(f.add(s),()=>{f.delete(s)})},e.skipHydration||d(),y||b},P=(c,l)=>"getStorage"in l||"serialize"in l||"deserialize"in l?((H?"production":void 0)!=="production"&&console.warn("[DEPRECATED] `getStorage`, `serialize` and `deserialize` options are deprecated. Use `storage` option instead."),L(c,l)):A(c,l),Q=P,z=E(Q((c,l)=>({cartItems:[],addToCart:r=>{c(t=>t.cartItems.find(e=>e.id===r.id)?{cartItems:t.cartItems.map(e=>e.id===r.id?{...e,quantity:e.quantity+(r.quantity||1)}:e)}:{cartItems:[...t.cartItems,{...r,quantity:r.quantity||1}]})},removeFromCart:r=>{c(t=>({cartItems:t.cartItems.filter(a=>a.id!==r)}))},increaseQuantity:r=>{c(t=>({cartItems:t.cartItems.map(a=>a.id===r?{...a,quantity:a.quantity+1}:a)}))},decreaseQuantity:r=>{c(t=>{const a=t.cartItems.find(e=>e.id===r);return a&&a.quantity>1?{cartItems:t.cartItems.map(e=>e.id===r?{...e,quantity:e.quantity-1}:e)}:a&&a.quantity===1?{cartItems:t.cartItems.filter(e=>e.id!==r)}:t})},updateQuantity:(r,t)=>{c(a=>({cartItems:a.cartItems.map(e=>e.id===r?{...e,quantity:Math.max(0,t)}:e).filter(e=>e.quantity>0)}))},clearCart:()=>{c({cartItems:[]})},getItemQuantity:r=>{const t=l().cartItems.find(a=>a.id===r);return t?t.quantity:0},getCartTotal:()=>l().cartItems.reduce((r,t)=>r+t.price*t.quantity,0),getCartCount:()=>l().cartItems.reduce((r,t)=>r+t.quantity,0),getCartItems:()=>l().cartItems,isInCart:r=>l().cartItems.some(t=>t.id===r)}),{name:"cart-storage",getStorage:()=>localStorage})),F=({productId:c,title:l,price:r,imageSrc:t,brand:a="",rentalPrices:e={},isRentalItem:p=!1})=>{const{t:h}=T(),{cartItems:f,addToCart:u,increaseQuantity:x,decreaseQuantity:j,getItemQuantity:b}=z(),[y,d]=S.useState("day"),s=b(c),o=`/product/${c}`,g=m=>e[m]?e[m].toLocaleString():"N/A",i=m=>{const k={day:"product.durations.day",week:"product.durations.week",month:"product.durations.month"};return k[m]?h(k[m]):m.charAt(0).toUpperCase()+m.slice(1)},v=m=>{d(m)},C=m=>{m.stopPropagation(),m.preventDefault(),u(p?{id:c,name:l,price:e[y],image:t,brand:a,quantity:1,rentalDuration:y,isRental:!0}:{id:c,name:l,price:r,image:t,brand:a,quantity:1})},N=m=>{m.stopPropagation(),m.preventDefault(),x(c)},q=m=>{m.stopPropagation(),m.preventDefault(),j(c)};return n.jsxs("div",{className:`product-card ${p?"rental-mode":""}`,children:[n.jsx(w,{to:o,className:"product-image",children:n.jsx("img",{src:t,alt:l||"Product Image"})}),n.jsx(w,{to:o,className:"product-name",children:n.jsx("h2",{children:h(l)})}),a&&n.jsxs("div",{className:"product-brand",children:[h("product.brand"),": ",a]}),p?n.jsxs("div",{className:"rental-pricing",children:[n.jsx("div",{className:"rental-duration-options",children:Object.keys(e).map(m=>n.jsx("button",{onClick:()=>v(m),className:y===m?"selected":"",children:i(m)},m))}),n.jsxs("h3",{className:"product-price",children:[g(y)," грн / ",y]})]}):n.jsxs("h3",{className:"product-price",children:[r," грн"]}),n.jsx("div",{className:"cart-controls",children:s>0?n.jsxs("div",{className:"quantity-controls fade-in",children:[n.jsx("button",{onClick:q,className:"decrement-btn",children:"-"}),n.jsx("span",{className:"quantity-number",children:s}),n.jsx("button",{onClick:N,className:"increment-btn",children:"+"})]}):n.jsx("button",{className:"add-to-cart fade-in",onClick:C,children:h(p?"product.rent":"product.addToCart")})})]})},J=()=>{const[c,l]=S.useState(!0),[r,t]=S.useState([]),[a,e]=S.useState([]),[p,h]=S.useState(""),[f,u]=S.useState(""),x=[{name:"Головна",link:"/"},{name:"Низьковольтна Продукція",link:"#"},{name:"Кабелі електричні та дроти"}];S.useEffect(()=>{(async()=>{l(!0);try{const s={};p&&(s.category=p),f&&(s.search=f);const o=await _.get("/api/cables",{params:s});t(o.data)}catch(s){console.error("Error fetching cables:",s)}finally{l(!1)}})()},[p,f]),S.useEffect(()=>{(async()=>{try{const s=await _.get("/api/categories");e(s.data)}catch(s){console.error("Error fetching categories:",s)}})()},[]);const j=d=>{h(d.target.value)},b=d=>{u(d.target.value)};return n.jsxs("div",{className:"catalogue-view",children:[n.jsx(D,{breadcrumbs:x,className:"breadcrumb-spacing"}),n.jsx("h1",{children:"Кабелі електричні та дроти"}),n.jsxs("div",{className:"mb-6 grid grid-cols-1 md:grid-cols-3 gap-4",children:[n.jsxs("div",{children:[n.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Категорія"}),n.jsxs("select",{className:"w-full p-2 border border-gray-300 rounded",value:p,onChange:j,children:[n.jsx("option",{value:"",children:"Усі категорії"}),a.map(d=>n.jsx("option",{value:d.id,children:d.name},d.id))]})]}),n.jsxs("div",{children:[n.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Пошук"}),n.jsx("input",{type:"text",className:"w-full p-2 border border-gray-300 rounded",placeholder:"Пошук за назвою або моделлю...",value:f,onChange:b})]})]}),c?n.jsx("div",{className:"flex justify-center items-center h-64",children:n.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"})}):n.jsx("div",{className:"products-container",children:r.length===0?n.jsx("div",{className:"col-span-full bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded",children:"No cables found. Try adjusting your filters."}):r.map(d=>n.jsx("div",{className:"product-card-wrapper",children:n.jsx(F,{productId:d.id,title:d.name,price:d.market_data.price,imageSrc:d.image_url||"/images/placeholder.png",brand:d.specifications.conductor_material,isRentalItem:!1})},d.id))})]})};export{J as default};
