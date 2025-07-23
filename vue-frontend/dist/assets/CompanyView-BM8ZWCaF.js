import{r,j as e}from"./index-Cov9520u.js";const u=()=>{const[s,c]=r.useState({name:"",email:"",message:""}),o=(t,i="")=>({"about.companyTitle":"ScaleVolt - Ваш надійний партнер","about.companySubtitle":"Ми створюємо майбутнє енергетики з відновлюваними джерелами","about.missionTitle":"Наша місія","about.missionText":"Ми прагнемо зробити відновлювану енергетику доступною для всіх. Наша місія полягає в тому, щоб надавати високоякісні сонячні рішення, які допомагають нашим клієнтам зменшити витрати на електроенергію та внести свій внесок у збереження навколишнього середовища.","about.valuesTitle":"Наші цінності","about.historyTitle":"Наша історія","about.teamTitle":"Наша команда","about.historyComingSoon":"Історія компанії буде доступна незабаром.","contact.question":"Маєте питання?","contact.email":"scalevolt.info@gmail.com","contact.address":"Київ, Україна","form.name":"Ім'я","form.email":"Email","form.message":"Повідомлення","form.namePlaceholder":"Введіть ваше ім'я","form.emailPlaceholder":"Введіть ваш email","form.messagePlaceholder":"Введіть ваше повідомлення","form.submit":"Відправити","form.submitSuccess":"Дякуємо за ваше повідомлення!"})[t]||i||t,m=[{title:"Якість",description:"Ми пропонуємо лише найкращі продукти з високою якістю та надійністю."},{title:"Інновації",description:"Постійно шукаємо нові технології та рішення для наших клієнтів."},{title:"Сервіс",description:"Надаємо професійну підтримку на всіх етапах співпраці."},{title:"Екологічність",description:"Турбуємося про навколишнє середовище та сталий розвиток."}],d=[{year:"2020",title:"Заснування компанії",description:"ScaleVolt була заснована з метою просування відновлюваної енергетики в Україні."},{year:"2021",title:"Перші проекти",description:"Успішно реалізовано перші проекти сонячних електростанцій для приватних клієнтів."},{year:"2022",title:"Розширення",description:"Відкриття нових напрямків: промислові рішення та системи накопичення енергії."},{year:"2023",title:"Міжнародне визнання",description:"Отримання сертифікатів якості та початок експорту продукції."}],p=[{name:"Олександр Петренко",position:"Генеральний директор",bio:"Експерт з відновлюваної енергетики з 15-річним досвідом у галузі."},{name:"Марія Коваленко",position:"Технічний директор",bio:"Інженер-електрик, спеціаліст з проектування сонячних електростанцій."},{name:"Андрій Сидоренко",position:"Менеджер з продажів",bio:"Досвідчений фахівець з продажів енергетичного обладнання."}],x=r.useMemo(()=>{try{return m}catch(t){return console.error("Error accessing values data:",t),m}},[]),h=r.useMemo(()=>{try{return d}catch(t){return console.error("Error accessing history timeline data:",t),d}},[]),g=r.useMemo(()=>{try{return p}catch(t){return console.error("Error accessing team data:",t),p}},[]),f=()=>{console.log("Form submitted:",s),alert(o("form.submitSuccess")),c({name:"",email:"",message:""})},l=t=>{const{name:i,value:a}=t.target;c(n=>({...n,[i]:a}))};return r.useEffect(()=>{const t={threshold:.1,rootMargin:"0px 0px -100px 0px"},i=new IntersectionObserver(a=>{a.forEach(n=>{n.isIntersecting&&(n.target.classList.add("visible"),i.unobserve(n.target))})},t);return document.querySelectorAll(".fade-in-section").forEach(a=>{i.observe(a)}),()=>{i.disconnect()}},[]),e.jsxs("div",{className:"company-page",children:[e.jsx("div",{className:"hero-section",children:e.jsxs("div",{className:"parallax-container",children:[e.jsx("h1",{className:"company-title",children:o("about.companyTitle")}),e.jsx("p",{className:"company-subtitle",children:o("about.companySubtitle")})]})}),e.jsx("section",{className:"mission-section fade-in-section",children:e.jsxs("div",{className:"container",children:[e.jsx("h2",{children:o("about.missionTitle")}),e.jsxs("div",{className:"mission-content",children:[e.jsx("div",{className:"mission-image",children:e.jsx("div",{className:"placeholder-image"})}),e.jsx("div",{className:"mission-text",children:e.jsx("p",{children:o("about.missionText")})})]})]})}),e.jsx("section",{className:"values-section",children:e.jsxs("div",{className:"container",children:[e.jsx("h2",{children:o("about.valuesTitle")}),e.jsx("div",{className:"values-grid",children:x.map((t,i)=>e.jsxs("div",{className:"value-card",children:[e.jsx("div",{className:"value-icon",children:e.jsx("div",{className:`icon-placeholder icon-${i+1}`})}),e.jsx("h3",{children:t.title}),e.jsx("p",{children:t.description})]},i))})]})}),e.jsx("section",{className:"history-section fade-in-section",children:e.jsxs("div",{className:"container",children:[e.jsx("h2",{children:o("about.historyTitle")}),e.jsxs("div",{className:"timeline",children:[h.map((t,i)=>e.jsxs("div",{className:"timeline-item",children:[e.jsx("div",{className:"timeline-year",children:t.year}),e.jsxs("div",{className:"timeline-content",children:[e.jsx("h3",{children:t.title}),e.jsx("p",{children:t.description})]})]},i)),h.length===0&&e.jsx("div",{className:"timeline-fallback",children:e.jsx("p",{children:o("about.historyComingSoon","Історія компанії буде доступна незабаром.")})})]})]})}),e.jsx("section",{className:"team-section fade-in-section",children:e.jsxs("div",{className:"container",children:[e.jsx("h2",{children:o("about.teamTitle")}),e.jsx("div",{className:"team-grid",children:g.map((t,i)=>e.jsxs("div",{className:"team-member",children:[e.jsxs("div",{className:"member-photo",children:[e.jsx("div",{className:"member-placeholder"}),e.jsx("div",{className:"member-overlay",children:e.jsx("p",{children:t.bio})})]}),e.jsx("h3",{children:t.name}),e.jsx("p",{className:"member-position",children:t.position})]},i))})]})}),e.jsx("section",{className:"contact-section fade-in-section",children:e.jsxs("div",{className:"container",children:[e.jsx("h2",{children:o("contact.question")}),e.jsxs("div",{className:"contact-container",children:[e.jsxs("div",{className:"contact-info",children:[e.jsx("p",{children:o("contact.question")}),e.jsxs("div",{className:"contact-detail",children:[e.jsx("span",{className:"icon-email",children:"✉️"}),e.jsx("a",{href:"mailto:scalevolt.info@gmail.com",children:o("contact.email")})]}),e.jsxs("div",{className:"contact-detail",children:[e.jsx("span",{className:"icon-location",children:"📍"}),e.jsx("p",{children:o("contact.address")})]})]}),e.jsxs("div",{className:"contact-form",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"name",children:o("form.name")}),e.jsx("input",{type:"text",id:"name",name:"name",value:s.name,onChange:l,placeholder:o("form.namePlaceholder")})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"email",children:o("form.email")}),e.jsx("input",{type:"email",id:"email",name:"email",value:s.email,onChange:l,placeholder:o("form.emailPlaceholder")})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"message",children:o("form.message")}),e.jsx("textarea",{id:"message",name:"message",value:s.message,onChange:l,placeholder:o("form.messagePlaceholder")})]}),e.jsx("button",{type:"button",onClick:f,className:"submit-btn",children:o("form.submit")})]})]})]})}),e.jsx("style",{jsx:!0,children:`
        .company-page {
          width: 100%;
          overflow-x: hidden;
          color: #333;
        }

        /* Hero Section with Parallax */
        .hero-section {
          height: 60vh;
          background-color: #333;
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          position: relative;
          background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), 
                           linear-gradient(to right, #0f2027, #203a43, #2c5364);
        }

        .parallax-container {
          z-index: 1;
          padding: 0 20px;
        }

        .company-title {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          animation: fadeInUp 1.2s ease-out;
          color: white;
        }

        .company-subtitle {
          font-size: 1.5rem;
          max-width: 700px;
          margin: 0 auto;
          animation: fadeInUp 1.5s ease-out;
          color: white;
        }

        /* Sections General Styling */
        section {
          padding: 5rem 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          position: relative;
          color: #333;
        }

        h2::after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background-color: #4285F4;
        }

        /* Fade-in Animation for Sections */
        .fade-in-section {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1s ease, transform 1s ease;
        }

        .fade-in-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Mission Section */
        .mission-section {
          background-color: #f8f8f8;
        }

        .mission-content {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
          align-items: center;
        }

        .mission-image {
          flex: 1;
          min-width: 300px;
        }

        .placeholder-image {
          width: 100%;
          height: 300px;
          background: linear-gradient(to right, #4285F4, #4285F4);
          border-radius: 10px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .placeholder-image:hover {
          transform: scale(1.02);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }

        .mission-text {
          flex: 1;
          min-width: 300px;
        }

        .mission-text p {
          font-size: 1.2rem;
          line-height: 1.8;
          color: #333;
        }

        /* Values Section */
        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
        }

        .value-card {
          background-color: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .value-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background-color: #4CAF50;
          transform: translateY(-5px);
          transition: transform 0.3s ease;
        }

        .value-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }

        .value-card:hover::before {
          transform: translateY(0);
        }

        .value-icon {
          margin-bottom: 20px;
        }

        .icon-placeholder {
          width: 60px;
          height: 60px;
          margin: 0 auto;
          background-color: #4CAF50;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          position: relative;
          animation: pulse 3s infinite;
        }

        .icon-1::after {
          content: '★';
          position: absolute;
        }

        .icon-2::after {
          content: '🔍';
          position: absolute;
        }

        .icon-3::after {
          content: '👥';
          position: absolute;
        }

        .icon-4::after {
          content: '🌱';
          position: absolute;
        }

        .value-card h3 {
          margin-bottom: 15px;
          font-size: 1.5rem;
          color: #333;
        }

        .value-card p {
          color: #333;
        }

        /* History Timeline */
        .timeline {
          position: relative;
          max-width: 800px;
          margin: 0 auto;
        }

        .timeline::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 3px;
          background-color: #4285F4;
          transform: translateX(-50%);
        }

        .timeline-item {
          position: relative;
          margin-bottom: 50px;
          display: flex;
          justify-content: flex-start;
          width: 50%;
          padding-right: 40px;
          left: 0;
        }

        .timeline-item:nth-child(even) {
          left: 50%;
          padding-right: 0;
          padding-left: 40px;
        }

        .timeline-year {
          position: absolute;
          top: 0;
          right: -70px;
          background-color: #001201;
          color: white;
          padding: 10px 15px;
          border-radius: 5px;
          font-weight: bold;
          z-index: 2;
        }

        .timeline-item:nth-child(even) .timeline-year {
          right: auto;
          left: -70px;
        }

        .timeline-content {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease;
          width: 100%;
        }

        .timeline-content:hover {
          transform: scale(1.05);
        }

        .timeline-content h3 {
          color: #000 !important;
          margin-top: 0;
          margin-bottom: 10px;
        }

        .timeline-content p {
          color: #333 !important;
          margin-bottom: 0;
        }

        /* Fallback for empty timeline */
        .timeline-fallback {
          text-align: center;
          padding: 30px;
          background-color: #f8f8f8;
          border-radius: 10px;
          margin-top: 20px;
          color: #666;
        }

        /* Team Section */
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
        }

        .team-member {
          background-color: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease;
        }

        .team-member:hover {
          transform: translateY(-10px);
        }

        .member-photo {
          position: relative;
          overflow: hidden;
          height: 250px;
        }

        .member-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #4CAF50, #2E7D32);
          transition: transform 0.5s ease;
        }

        .member-overlay {
          position: absolute;
          bottom: -100%;
          left: 0;
          right: 0;
          background-color: rgba(76, 175, 80, 0.9);
          color: white;
          padding: 20px;
          transition: bottom 0.3s ease;
        }

        .member-overlay p {
          color: white;
        }

        .team-member:hover .member-placeholder {
          transform: scale(1.1);
        }

        .team-member:hover .member-overlay {
          bottom: 0;
        }

        .team-member h3 {
          padding: 15px 15px 5px;
          margin: 0;
          color: #333;
        }

        .member-position {
          padding: 0 15px 15px;
          margin: 0;
          color: #666;
          font-style: italic;
        }

        /* Contact Section */
        .contact-section {
          background-color: #f8f8f8;
        }

        .contact-container {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
        }

        .contact-info {
          flex: 1;
          min-width: 300px;
        }

        .contact-info p {
          color: #333;
        }

        .contact-detail {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }

        .contact-detail p, .contact-detail a {
          color: #333;
        }

        .icon-email, .icon-location {
          margin-right: 10px;
          font-size: 1.5rem;
        }

        .contact-form {
          flex: 2;
          min-width: 300px;
          background-color: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #333;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          color: #333;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #4CAF50;
          box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
          outline: none;
        }

        .form-group textarea {
          min-height: 150px;
          resize: vertical;
        }

        .submit-btn {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }

        .submit-btn:hover {
          background-color: #388E3C;
          transform: translateY(-2px);
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .company-title {
            font-size: 2.5rem;
          }
          
          .company-subtitle {
            font-size: 1.2rem;
          }
          
          .timeline::before {
            left: 30px;
          }
          
          .timeline-item {
            width: 100%;
            padding-right: 0;
            padding-left: 70px;
          }
          
          .timeline-item:nth-child(even) {
            left: 0;
            padding-left: 70px;
          }
          
          .timeline-year {
            right: auto;
            left: -5px;
          }
          
          .timeline-item:nth-child(even) .timeline-year {
            left: -5px;
          }
        }
      `})]})};export{u as default};
