const express = require('express');
const router = express.Router();

// Product knowledge base for the chatbot with multi-language support
const productKnowledge = {
  'solar-panels': {
    name: {
      en: 'Solar Panels',
      ua: 'Сонячні панелі',
      pl: 'Panele słoneczne'
    },
    description: {
      en: 'High-efficiency solar panels for residential and commercial installations',
      ua: 'Високоефективні сонячні панелі для житлового та комерційного використання',
      pl: 'Wysokowydajne panele słoneczne do zastosowań mieszkalnych i komercyjnych'
    },
    features: {
      en: ['High efficiency', 'Durable construction', '25-year warranty', 'Easy installation'],
      ua: ['Висока ефективність', 'Міцна конструкція', '25-річна гарантія', 'Легка установка'],
      pl: ['Wysoka wydajność', 'Trwała konstrukcja', '25-letnia gwarancja', 'Łatwa instalacja']
    },
    applications: {
      en: ['Residential rooftops', 'Commercial buildings', 'Solar farms', 'Off-grid systems'],
      ua: ['Житлові дахи', 'Комерційні будівлі', 'Сонячні ферми', 'Автономні системи'],
      pl: ['Dachy mieszkalne', 'Budynki komercyjne', 'Farma słoneczne', 'Systemy off-grid']
    },
    installation: {
      steps: {
        en: [
          'Site assessment and solar potential analysis',
          'System design and component selection',
          'Permitting and regulatory compliance',
          'Installation of mounting system',
          'Panel installation and wiring',
          'Inverter connection and system testing',
          'Grid connection and commissioning'
        ],
        ua: [
          'Оцінка майданчика та аналіз сонячного потенціалу',
          'Проектування системи та вибір компонентів',
          'Отримання дозволів та дотримання нормативів',
          'Встановлення системи кріплення',
          'Встановлення панелей та підключення проводки',
          'Підключення інвертора та тестування системи',
          'Підключення до мережі та введення в експлуатацію'
        ],
        pl: [
          'Ocena miejsca i analiza potencjału słonecznego',
          'Projektowanie systemu i dobór komponentów',
          'Pozwolenia i zgodność z przepisami',
          'Montaż systemu mocującego',
          'Montaż paneli i okablowania',
          'Podłączenie inwertera i testowanie systemu',
          'Podłączenie do sieci i uruchomienie'
        ]
      },
      requirements: {
        en: ['Suitable roof orientation', 'Structural integrity', 'Electrical access', 'Permits'],
        ua: ['Відповідна орієнтація даху', 'Конструктивна цілісність', 'Електричний доступ', 'Дозволи'],
        pl: ['Odpowiednia orientacja dachu', 'Integralność strukturalna', 'Dostęp elektryczny', 'Pozwolenia']
      }
    },
    sizing: {
      residential: {
        en: '3-10 kW system for average home',
        ua: 'Система 3-10 кВт для середнього будинку',
        pl: 'System 3-10 kW dla przeciętnego domu'
      },
      commercial: {
        en: '10-100 kW+ depending on building size',
        ua: '10-100 кВт+ залежно від розміру будівлі',
        pl: '10-100 kW+ w zależności od wielkości budynku'
      },
      factors: {
        en: ['Energy consumption', 'Available space', 'Budget', 'Local regulations'],
        ua: ['Споживання енергії', 'Доступний простір', 'Бюджет', 'Місцеві нормативи'],
        pl: ['Zużycie energii', 'Dostępna przestrzeń', 'Budżet', 'Przepisy lokalne']
      }
    }
  },
  'batteries': {
    name: {
      en: 'Battery Storage Systems',
      ua: 'Акумуляторні системи',
      pl: 'Systemy bateryjne'
    },
    description: {
      en: 'Lithium battery systems for energy storage and backup power',
      ua: 'Літієві акумуляторні системи для накопичення енергії та резервного живлення',
      pl: 'Systemy baterii litowych do magazynowania energii i zasilania awaryjnego'
    },
    features: {
      en: ['High capacity', 'Long cycle life', 'Smart management', 'Scalable design'],
      ua: ['Висока ємність', 'Довгий термін служби', 'Розумне управління', 'Масштабований дизайн'],
      pl: ['Wysoka pojemność', 'Długi cykl życia', 'Inteligentne zarządzanie', 'Skalowalny projekt']
    },
    applications: {
      en: ['Solar energy storage', 'Backup power', 'Peak shaving', 'Off-grid systems'],
      ua: ['Накопичення сонячної енергії', 'Резервне живлення', 'Зрізання піків', 'Автономні системи'],
      pl: ['Magazynowanie energii słonecznej', 'Zasilanie awaryjne', 'Ścinanie szczytów', 'Systemy off-grid']
    }
  },
  'inverters': {
    name: {
      en: 'Solar Inverters',
      ua: 'Сонячні інвертори',
      pl: 'Inwertery słoneczne'
    },
    description: {
      en: 'High-efficiency inverters for converting DC to AC power',
      ua: 'Високоефективні інвертори для перетворення постійного струму в змінний',
      pl: 'Wysokowydajne inwertery do konwersji prądu stałego na przemienny'
    },
    features: {
      en: ['High efficiency', 'Smart monitoring', 'Grid-tie capability', 'Remote management'],
      ua: ['Висока ефективність', 'Розумний моніторинг', 'Можливість підключення до мережі', 'Віддалене управління'],
      pl: ['Wysoka wydajność', 'Inteligentny monitoring', 'Możliwość podłączenia do sieci', 'Zdalne zarządzanie']
    }
  },
  'ev-chargers': {
    name: {
      en: 'EV Charging Stations',
      ua: 'Зарядні станції для електромобілів',
      pl: 'Stacje ładowania EV'
    },
    description: {
      en: 'Fast and smart electric vehicle charging solutions',
      ua: 'Швидкі та розумні рішення для зарядки електромобілів',
      pl: 'Szybkie i inteligentne rozwiązania ładowania pojazdów elektrycznych'
    },
    features: {
      en: ['Fast charging', 'Smart scheduling', 'Mobile app control', 'Load management'],
      ua: ['Швидка зарядка', 'Розумне планування', 'Контроль через мобільний додаток', 'Управління навантаженням'],
      pl: ['Szybkie ładowanie', 'Inteligentne planowanie', 'Kontrola przez aplikację mobilną', 'Zarządzanie obciążeniem']
    }
  }
};

// Implementation guides with multi-language support
const implementationGuides = {
  'solar-installation': {
    title: {
      en: 'Solar Panel Installation Guide',
      ua: 'Посібник з встановлення сонячних панелей',
      pl: 'Przewodnik instalacji paneli słonecznych'
    },
    overview: {
      en: 'Complete guide to installing solar panels on your property',
      ua: 'Повний посібник з встановлення сонячних панелей на вашій власності',
      pl: 'Kompletny przewodnik instalacji paneli słonecznych na Twojej nieruchomości'
    },
    phases: [
      {
        phase: {
          en: 'Planning & Design',
          ua: 'Планування та проектування',
          pl: 'Planowanie i projektowanie'
        },
        duration: {
          en: '2-4 weeks',
          ua: '2-4 тижні',
          pl: '2-4 tygodnie'
        },
        tasks: {
          en: [
            'Site assessment and solar potential analysis',
            'Energy consumption analysis',
            'System design and component selection',
            'Permitting and regulatory compliance',
            'Contractor selection and bidding'
          ],
          ua: [
            'Оцінка майданчика та аналіз сонячного потенціалу',
            'Аналіз споживання енергії',
            'Проектування системи та вибір компонентів',
            'Отримання дозволів та дотримання нормативів',
            'Вибір підрядника та торги'
          ],
          pl: [
            'Ocena miejsca i analiza potencjału słonecznego',
            'Analiza zużycia energii',
            'Projektowanie systemu i dobór komponentów',
            'Pozwolenia i zgodność z przepisami',
            'Wybór wykonawcy i przetargi'
          ]
        }
      }
    ]
  }
};

// Sales qualification questions with multi-language support
const salesQuestions = {
  residential: {
    en: [
      'What is your average monthly electricity bill?',
      'Do you own your home or plan to stay for 5+ years?',
      'What is your primary motivation for going solar? (savings, environmental, backup power)',
      'What is your budget range for the system?',
      'Do you have any shading issues on your roof?'
    ],
    ua: [
      'Який ваш середній місячний рахунок за електроенергію?',
      'Чи володієте ви будинком або плануєте проживати 5+ років?',
      'Яка ваша основна мотивація для переходу на сонячну енергію? (економія, екологія, резервне живлення)',
      'Який ваш бюджетний діапазон для системи?',
      'Чи є у вас проблеми з затіненням на даху?'
    ],
    pl: [
      'Jaki jest Twój średni miesięczny rachunek za energię elektryczną?',
      'Czy posiadasz dom lub planujesz mieszkać 5+ lat?',
      'Jaka jest Twoja główna motywacja do przejścia na energię słoneczną? (oszczędności, ekologia, zasilanie awaryjne)',
      'Jaki jest Twój zakres budżetu na system?',
      'Czy masz problemy z zacienieniem na dachu?'
    ]
  },
  commercial: {
    en: [
      'What is your business type and energy consumption pattern?',
      'Do you have available roof or ground space for solar?',
      'What are your sustainability goals?',
      'What is your budget and ROI expectations?',
      'Do you need backup power capabilities?'
    ],
    ua: [
      'Який тип вашого бізнесу та модель споживання енергії?',
      'Чи є у вас доступний простір на даху або землі для сонячних панелей?',
      'Які ваші цілі щодо сталого розвитку?',
      'Який ваш бюджет та очікування ROI?',
      'Чи потрібні вам можливості резервного живлення?'
    ],
    pl: [
      'Jaki jest typ Twojego biznesu i wzorzec zużycia energii?',
      'Czy masz dostępną przestrzeń na dachu lub gruncie dla paneli słonecznych?',
      'Jakie są Twoje cele zrównoważonego rozwoju?',
      'Jaki jest Twój budżet i oczekiwania ROI?',
      'Czy potrzebujesz możliwości zasilania awaryjnego?'
    ]
  }
};

// Multi-language responses
const responses = {
  welcome: {
    en: 'Hello! I\'m your ScaleVolt AI assistant. I can help you with:',
    ua: 'Привіт! Я ваш AI-помічник ScaleVolt. Я можу допомогти вам з:',
    pl: 'Cześć! Jestem Twoim asystentem AI ScaleVolt. Mogę pomóc Ci z:'
  },
  productInquiry: {
    en: 'I can help you with information about our solar panels, battery storage systems, inverters, and EV chargers. Which product category interests you most?',
    ua: 'Я можу допомогти вам з інформацією про наші сонячні панелі, акумуляторні системи, інвертори та зарядні станції для електромобілів. Яка категорія продуктів вас найбільше цікавить?',
    pl: 'Mogę pomóc Ci z informacjami o naszych panelach słonecznych, systemach bateryjnych, inwerterach i stacjach ładowania EV. Która kategoria produktów najbardziej Cię interesuje?'
  },
  installationHelp: {
    en: 'Here\'s a comprehensive overview of solar installation: Complete guide to installing solar panels on your property. The process typically takes 4-6 weeks and involves three main phases: Planning & Design, Installation, Commissioning. Would you like detailed information about any specific phase?',
    ua: 'Ось комплексний огляд встановлення сонячних панелей: Повний посібник з встановлення сонячних панелей на вашій власності. Процес зазвичай займає 4-6 тижнів і включає три основні фази: Планування та проектування, Встановлення, Введення в експлуатацію. Чи хотіли б ви детальну інформацію про конкретну фазу?',
    pl: 'Oto kompleksowy przegląd instalacji słonecznej: Kompletny przewodnik instalacji paneli słonecznych na Twojej nieruchomości. Proces zazwyczaj trwa 4-6 tygodni i obejmuje trzy główne fazy: Planowanie i projektowanie, Instalacja, Uruchomienie. Czy chciałbyś szczegółowe informacje o konkretnej fazie?'
  },
  salesQualification: {
    en: 'Great! I\'d love to help you find the perfect solar solution. To better understand your needs, could you tell me: • What is your average monthly electricity bill? • Do you own your home? • What is your primary motivation for going solar?',
    ua: 'Чудово! Я хотів би допомогти вам знайти ідеальне сонячне рішення. Щоб краще зрозуміти ваші потреби, чи могли б ви сказати мені: • Який ваш середній місячний рахунок за електроенергію? • Чи володієте ви будинком? • Яка ваша основна мотивація для переходу на сонячну енергію?',
    pl: 'Świetnie! Chciałbym pomóc Ci znaleźć idealne rozwiązanie słoneczne. Aby lepiej zrozumieć Twoje potrzeby, czy mógłbyś mi powiedzieć: • Jaki jest Twój średni miesięczny rachunek za energię elektryczną? • Czy posiadasz dom? • Jaka jest Twoja główna motywacja do przejścia na energię słoneczną?'
  },
  technicalSupport: {
    en: 'I\'m here to help with technical support! I can assist with: • System troubleshooting • Performance optimization • Maintenance questions • Warranty information What specific issue are you experiencing?',
    ua: 'Я тут, щоб допомогти з технічною підтримкою! Я можу допомогти з: • Діагностикою системи • Оптимізацією продуктивності • Питаннями з обслуговування • Інформацією про гарантію Яку конкретну проблему ви відчуваєте?',
    pl: 'Jestem tutaj, aby pomóc z wsparciem technicznym! Mogę pomóc z: • Rozwiązywaniem problemów systemowych • Optymalizacją wydajności • Pytaniami dotyczącymi konserwacji • Informacjami o gwarancji Jaki konkretny problem doświadczasz?'
  },
  generalInfo: {
    en: 'Hello! I\'m your ScaleVolt AI assistant. I can help you with: • Product information and recommendations • Installation guidance and requirements • Pricing quotes and estimates • Technical support and troubleshooting • Sales qualification and project planning What would you like to know about today?',
    ua: 'Привіт! Я ваш AI-помічник ScaleVolt. Я можу допомогти вам з: • Інформацією про продукти та рекомендації • Керівництвом з встановлення та вимогами • Ціновими пропозиціями та оцінками • Технічною підтримкою та діагностикою • Кваліфікацією продажів та плануванням проектів Що б ви хотіли дізнатися сьогодні?',
    pl: 'Cześć! Jestem Twoim asystentem AI ScaleVolt. Mogę pomóc Ci z: • Informacjami o produktach i rekomendacjami • Wskazówkami instalacyjnymi i wymaganiami • Wycenami i szacunkami • Wsparciem technicznym i rozwiązywaniem problemów • Kwalifikacją sprzedaży i planowaniem projektów O czym chciałbyś się dziś dowiedzieć?'
  }
};

// AI Chatbot Logic with multi-language support
class AIChatbot {
  constructor() {
    this.conversationHistory = new Map();
  }

  // Detect language from user input
  detectLanguage(text) {
    const ukrainianPattern = /[а-яіїєґ]/i;
    const polishPattern = /[ąćęłńóśźż]/i;
    
    if (ukrainianPattern.test(text)) return 'ua';
    if (polishPattern.test(text)) return 'pl';
    return 'en'; // Default to English
  }

  // Get translated text based on language
  getTranslatedText(textObj, language) {
    if (typeof textObj === 'string') return textObj;
    if (textObj && textObj[language]) return textObj[language];
    return textObj.en || textObj; // Fallback to English
  }

  // Process user message and generate response
  async processMessage(message, language = 'en', userInfo = null, conversationHistory = []) {
    const sessionId = userInfo?.sessionId || 'default';
    const history = this.conversationHistory.get(sessionId) || [];
    
    // Detect language if not provided
    if (!language || language === 'auto') {
      language = this.detectLanguage(message);
    }
    
    // Add current message to history
    history.push({ role: 'user', content: message });
    
    // Analyze message intent
    const intent = this.analyzeIntent(message.toLowerCase());
    const response = await this.generateResponse(intent, message, language, userInfo, history);
    
    // Update conversation history
    history.push({ role: 'assistant', content: response.content });
    this.conversationHistory.set(sessionId, history.slice(-10)); // Keep last 10 messages
    
    return response;
  }

  // Analyze user intent
  analyzeIntent(message) {
    const intents = {
      product_inquiry: ['solar', 'panel', 'battery', 'inverter', 'charger', 'product', 'system'],
      installation_help: ['install', 'installation', 'setup', 'mount', 'connect', 'wiring'],
      pricing_quote: ['price', 'cost', 'quote', 'estimate', 'budget', 'afford'],
      technical_support: ['problem', 'issue', 'error', 'fault', 'troubleshoot', 'support'],
      sales_qualification: ['interested', 'buy', 'purchase', 'sales', 'contact'],
      general_info: ['what', 'how', 'why', 'when', 'where', 'info', 'help']
    };

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return intent;
      }
    }
    
    return 'general_info';
  }

  // Generate response based on intent and language
  async generateResponse(intent, message, language, userInfo, history) {
    switch (intent) {
      case 'product_inquiry':
        return this.handleProductInquiry(message, language);
      case 'installation_help':
        return this.handleInstallationHelp(message, language);
      case 'pricing_quote':
        return this.handlePricingQuote(message, language, userInfo);
      case 'technical_support':
        return this.handleTechnicalSupport(message, language);
      case 'sales_qualification':
        return this.handleSalesQualification(message, language, userInfo);
      default:
        return this.handleGeneralInfo(message, language);
    }
  }

  // Handle product inquiries with multi-language support
  handleProductInquiry(message, language) {
    const productCategories = Object.keys(productKnowledge);
    const mentionedProducts = productCategories.filter(category => 
      message.includes(category.replace('-', ' ')) || 
      Object.values(productKnowledge[category].name).some(name => 
        message.toLowerCase().includes(name.toLowerCase())
      )
    );

    if (mentionedProducts.length > 0) {
      const product = productKnowledge[mentionedProducts[0]];
      const productName = this.getTranslatedText(product.name, language);
      const description = this.getTranslatedText(product.description, language);
      const features = this.getTranslatedText(product.features, language);
      const applications = this.getTranslatedText(product.applications, language);
      
      return {
        content: this.getTranslatedText(responses.productInquiry, language)
          .replace('{productName}', productName)
          .replace('{description}', description)
          .replace('{features}', features.join(', '))
          .replace('{applications}', applications.join(', ')),
        suggestions: [
          this.getTranslatedText({ en: 'Installation guide', ua: 'Посібник з встановлення', pl: 'Przewodnik instalacji' }, language),
          this.getTranslatedText({ en: 'Get a quote', ua: 'Отримати пропозицію', pl: 'Otrzymać wycenę' }, language),
          this.getTranslatedText({ en: 'Technical specifications', ua: 'Технічні характеристики', pl: 'Specyfikacje techniczne' }, language),
          this.getTranslatedText({ en: 'Compare products', ua: 'Порівняти продукти', pl: 'Porównaj produkty' }, language)
        ],
        actions: [
          {
            type: 'open_quote_form',
            text: this.getTranslatedText({ en: 'Get Quote', ua: 'Отримати пропозицію', pl: 'Otrzymać wycenę' }, language),
            icon: 'cart'
          }
        ]
      };
    }

    return {
      content: this.getTranslatedText(responses.productInquiry, language),
      suggestions: [
        this.getTranslatedText({ en: 'Solar Panels', ua: 'Сонячні панелі', pl: 'Panele słoneczne' }, language),
        this.getTranslatedText({ en: 'Battery Storage', ua: 'Акумуляторні системи', pl: 'Systemy bateryjne' }, language),
        this.getTranslatedText({ en: 'Solar Inverters', ua: 'Сонячні інвертори', pl: 'Inwertery słoneczne' }, language),
        this.getTranslatedText({ en: 'EV Chargers', ua: 'Зарядні станції EV', pl: 'Stacje ładowania EV' }, language)
      ]
    };
  }

  // Handle installation help with multi-language support
  handleInstallationHelp(message, language) {
    const guide = implementationGuides['solar-installation'];
    const title = this.getTranslatedText(guide.title, language);
    const overview = this.getTranslatedText(guide.overview, language);
    const phases = guide.phases.map(p => this.getTranslatedText(p.phase, language)).join(', ');
    
    return {
      content: this.getTranslatedText(responses.installationHelp, language)
        .replace('{overview}', overview)
        .replace('{phases}', phases),
      suggestions: [
        this.getTranslatedText({ en: 'Planning phase details', ua: 'Деталі фази планування', pl: 'Szczegóły fazy planowania' }, language),
        this.getTranslatedText({ en: 'Installation timeline', ua: 'Графік встановлення', pl: 'Harmonogram instalacji' }, language),
        this.getTranslatedText({ en: 'Requirements checklist', ua: 'Чек-лист вимог', pl: 'Lista kontrolna wymagań' }, language),
        this.getTranslatedText({ en: 'Get professional quote', ua: 'Отримати професійну пропозицію', pl: 'Otrzymać profesjonalną wycenę' }, language)
      ],
      actions: [
        {
          type: 'open_quote_form',
          text: this.getTranslatedText({ en: 'Get Installation Quote', ua: 'Отримати пропозицію на встановлення', pl: 'Otrzymać wycenę instalacji' }, language),
          icon: 'info'
        }
      ]
    };
  }

  // Handle pricing and quotes with multi-language support
  handlePricingQuote(message, language, userInfo) {
    return {
      content: this.getTranslatedText({ 
        en: 'I can help you get a personalized quote for your solar system! To provide the most accurate estimate, I\'ll need some information about your project. Let me ask you a few questions to understand your needs better.',
        ua: 'Я можу допомогти вам отримати персональну пропозицію для вашої сонячної системи! Щоб надати найбільш точну оцінку, мені потрібна інформація про ваш проект. Дозвольте мені задати кілька запитань, щоб краще зрозуміти ваші потреби.',
        pl: 'Mogę pomóc Ci otrzymać spersonalizowaną wycenę dla Twojego systemu słonecznego! Aby zapewnić najdokładniejszą wycenę, potrzebuję informacji o Twoim projekcie. Pozwól mi zadać kilka pytań, aby lepiej zrozumieć Twoje potrzeby.'
      }, language),
      suggestions: [
        this.getTranslatedText({ en: 'Residential project', ua: 'Житловий проект', pl: 'Projekt mieszkalny' }, language),
        this.getTranslatedText({ en: 'Commercial project', ua: 'Комерційний проект', pl: 'Projekt komercyjny' }, language),
        this.getTranslatedText({ en: 'Just want ballpark estimate', ua: 'Просто хочу приблизну оцінку', pl: 'Chcę tylko przybliżoną wycenę' }, language)
      ],
      actions: [
        {
          type: 'open_quote_form',
          text: this.getTranslatedText({ en: 'Get Detailed Quote', ua: 'Отримати детальну пропозицію', pl: 'Otrzymać szczegółową wycenę' }, language),
          icon: 'cart'
        }
      ]
    };
  }

  // Handle technical support with multi-language support
  handleTechnicalSupport(message, language) {
    return {
      content: this.getTranslatedText(responses.technicalSupport, language),
      suggestions: [
        this.getTranslatedText({ en: 'System not working', ua: 'Система не працює', pl: 'System nie działa' }, language),
        this.getTranslatedText({ en: 'Performance issues', ua: 'Проблеми з продуктивністю', pl: 'Problemy z wydajnością' }, language),
        this.getTranslatedText({ en: 'Maintenance questions', ua: 'Питання з обслуговування', pl: 'Pytania dotyczące konserwacji' }, language),
        this.getTranslatedText({ en: 'Contact support team', ua: 'Зв\'язатися з командою підтримки', pl: 'Skontaktuj się z zespołem wsparcia' }, language)
      ],
      actions: [
        {
          type: 'open_support',
          text: this.getTranslatedText({ en: 'Contact Support', ua: 'Зв\'язатися з підтримкою', pl: 'Skontaktuj się z pomocą' }, language),
          icon: 'help'
        }
      ]
    };
  }

  // Handle sales qualification with multi-language support
  handleSalesQualification(message, language, userInfo) {
    const questions = salesQuestions.residential;
    const translatedQuestions = questions[language] || questions.en;
    
    return {
      content: this.getTranslatedText(responses.salesQualification, language),
      suggestions: [
        this.getTranslatedText({ en: 'Monthly bill: $100-200', ua: 'Місячний рахунок: $100-200', pl: 'Rachunek miesięczny: $100-200' }, language),
        this.getTranslatedText({ en: 'Monthly bill: $200-400', ua: 'Місячний рахунок: $200-400', pl: 'Rachunek miesięczny: $200-400' }, language),
        this.getTranslatedText({ en: 'Monthly bill: $400+', ua: 'Місячний рахунок: $400+', pl: 'Rachunek miesięczny: $400+' }, language),
        this.getTranslatedText({ en: 'I\'m just exploring options', ua: 'Я просто вивчаю варіанти', pl: 'Tylko badam opcje' }, language)
      ]
    };
  }

  // Handle general information with multi-language support
  handleGeneralInfo(message, language) {
    return {
      content: this.getTranslatedText(responses.generalInfo, language),
      suggestions: [
        this.getTranslatedText({ en: 'Learn about products', ua: 'Дізнатися про продукти', pl: 'Dowiedz się o produktach' }, language),
        this.getTranslatedText({ en: 'Installation help', ua: 'Допомога з встановленням', pl: 'Pomoc w instalacji' }, language),
        this.getTranslatedText({ en: 'Get a quote', ua: 'Отримати пропозицію', pl: 'Otrzymać wycenę' }, language),
        this.getTranslatedText({ en: 'Technical support', ua: 'Технічна підтримка', pl: 'Wsparcie techniczne' }, language)
      ]
    };
  }
}

// Initialize chatbot
const chatbot = new AIChatbot();

// Chatbot message endpoint
router.post('/message', async (req, res) => {
  try {
    const { message, language = 'auto', userInfo, conversationHistory } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    const response = await chatbot.processMessage(message, language, userInfo, conversationHistory);
    
    res.json({
      success: true,
      response: response.content,
      suggestions: response.suggestions || [],
      actions: response.actions || [],
      recommendedProducts: response.recommendedProducts || [],
      userInfo: response.userInfo || null,
      detectedLanguage: chatbot.detectLanguage(message)
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process message',
      details: error.message
    });
  }
});

// Get chatbot status
router.get('/status', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    supportedLanguages: ['en', 'ua', 'pl'],
    features: [
      'Multi-language product knowledge and recommendations',
      'Installation guidance in Ukrainian, Polish, and English',
      'Sales qualification with language detection',
      'Technical support in multiple languages',
      'Context-aware conversations'
    ]
  });
});

module.exports = router; 