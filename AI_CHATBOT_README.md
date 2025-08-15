# 🤖 ScaleVolt AI Chatbot

A comprehensive AI-powered chatbot for your ScaleVolt website that handles sales, product knowledge, and implementation guidance.

## 🚀 Features

### **Core Capabilities**
- **Product Knowledge**: Deep understanding of solar panels, batteries, inverters, and EV chargers
- **Sales Qualification**: Intelligent lead generation and customer qualification
- **Installation Guidance**: Step-by-step implementation instructions
- **Technical Support**: Troubleshooting and maintenance assistance
- **Multi-language Support**: English, Ukrainian, and Polish
- **Context Awareness**: Remembers conversation history and user preferences

### **Advanced Features**
- **Smart Intent Recognition**: Understands user intent from natural language
- **Product Recommendations**: Suggests relevant products based on user needs
- **Interactive Elements**: Clickable suggestions, action buttons, and product cards
- **Real-time Responses**: Instant AI-powered responses
- **Conversation Management**: Maintains context across multiple messages

## 📁 Project Structure

```
vue-frontend/src/components/Chatbot/
├── AIChatbot.jsx          # Main chatbot component
└── AIChatbot.css          # Styling and animations

node-backend/backend-node/routes/
└── chatbotRoutes.js       # Backend AI logic and API endpoints
```

## 🛠️ Technical Implementation

### **Frontend (React)**
- **Component**: `AIChatbot.jsx`
- **Styling**: Modern CSS with animations and responsive design
- **State Management**: React hooks for conversation state
- **Internationalization**: i18n support for multiple languages
- **Real-time Updates**: Auto-scrolling and typing indicators

### **Backend (Node.js)**
- **AI Logic**: Intelligent intent analysis and response generation
- **Product Knowledge Base**: Comprehensive product information
- **Implementation Guides**: Detailed installation instructions
- **Sales Qualification**: Structured lead generation process
- **Conversation History**: Session management and context tracking

## 🎯 Key Components

### **1. Product Knowledge Base**
```javascript
const productKnowledge = {
  'solar-panels': {
    name: 'Solar Panels',
    description: 'High-efficiency solar panels for residential and commercial installations',
    features: ['High efficiency', 'Durable construction', '25-year warranty'],
    applications: ['Residential rooftops', 'Commercial buildings', 'Solar farms'],
    installation: {
      steps: ['Site assessment', 'System design', 'Installation', 'Commissioning'],
      requirements: ['Suitable roof orientation', 'Structural integrity', 'Electrical access']
    }
  }
  // ... more products
};
```

### **2. Implementation Guides**
```javascript
const implementationGuides = {
  'solar-installation': {
    title: 'Solar Panel Installation Guide',
    phases: [
      {
        phase: 'Planning & Design',
        duration: '2-4 weeks',
        tasks: ['Site assessment', 'System design', 'Permitting']
      }
      // ... more phases
    ]
  }
};
```

### **3. Sales Qualification**
```javascript
const salesQuestions = {
  residential: [
    'What is your average monthly electricity bill?',
    'Do you own your home or plan to stay for 5+ years?',
    'What is your primary motivation for going solar?'
  ]
};
```

## 🔧 Setup Instructions

### **1. Backend Setup**
```bash
cd node-backend/backend-node
npm install
npm run dev
```

The chatbot API will be available at:
- `POST /api/chatbot/message` - Process user messages
- `GET /api/chatbot/status` - Check chatbot status

### **2. Frontend Setup**
```bash
cd vue-frontend
npm install
npm run dev
```

The chatbot component is automatically included in the main App and will appear as a floating chat button.

### **3. Environment Variables**
```env
# Backend (.env)
PORT=3002
NODE_ENV=development

# Frontend (vite.config.js)
VITE_API_URL=http://localhost:3002/api
```

## 🎨 Customization

### **Adding New Products**
1. Update `productKnowledge` in `chatbotRoutes.js`
2. Add product features, applications, and installation details
3. Update intent recognition keywords

### **Customizing Responses**
1. Modify response handlers in `AIChatbot` class
2. Add new intent types in `analyzeIntent()`
3. Update translation keys in i18n files

### **Styling Changes**
1. Edit `AIChatbot.css` for visual modifications
2. Update color schemes, animations, and layout
3. Add dark mode support or custom themes

## 📊 Usage Examples

### **Product Inquiry**
```
User: "Tell me about solar panels"
Bot: "I'd be happy to tell you about our Solar Panels! High-efficiency solar panels for residential and commercial installations. Key features include: High efficiency, Durable construction, 25-year warranty, Easy installation. Common applications: Residential rooftops, Commercial buildings, Solar farms, Off-grid systems. Would you like to know about installation requirements or get a quote?"
```

### **Installation Help**
```
User: "How do I install solar panels?"
Bot: "Here's a comprehensive overview of solar installation: Complete guide to installing solar panels on your property. The process typically takes 4-6 weeks and involves three main phases: Planning & Design, Installation, Commissioning. Would you like detailed information about any specific phase?"
```

### **Sales Qualification**
```
User: "I'm interested in buying solar panels"
Bot: "Great! I'd love to help you find the perfect solar solution. To better understand your needs, could you tell me: • What is your average monthly electricity bill? • Do you own your home? • What is your primary motivation for going solar?"
```

## 🔍 Intent Recognition

The chatbot recognizes these intents:

| Intent | Keywords | Response Type |
|--------|----------|---------------|
| `product_inquiry` | solar, panel, battery, inverter, charger | Product information and recommendations |
| `installation_help` | install, installation, setup, mount | Step-by-step guidance |
| `pricing_quote` | price, cost, quote, estimate, budget | Quote generation and qualification |
| `technical_support` | problem, issue, error, fault, troubleshoot | Technical assistance |
| `sales_qualification` | interested, buy, purchase, sales, contact | Lead qualification |
| `general_info` | what, how, why, when, where, info, help | General assistance |

## 🌐 Multi-language Support

The chatbot supports multiple languages through i18n:

```javascript
// Translation keys
"chatbot": {
  "welcome": "Hello! I'm your ScaleVolt AI assistant. I can help you with:",
  "title": "ScaleVolt AI Assistant",
  "suggestions": {
    "products": "Browse products",
    "installation": "Installation help",
    "quote": "Get a quote",
    "support": "Technical support"
  }
}
```

## 🔧 API Endpoints

### **POST /api/chatbot/message**
Process user messages and generate AI responses.

**Request:**
```json
{
  "message": "Tell me about solar panels",
  "language": "en",
  "userInfo": {
    "sessionId": "user123",
    "location": "Ukraine"
  },
  "conversationHistory": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi! How can I help?"}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "response": "I'd be happy to tell you about our Solar Panels!...",
  "suggestions": ["Installation guide", "Get a quote"],
  "actions": [
    {
      "type": "open_quote_form",
      "text": "Get Quote",
      "icon": "cart"
    }
  ],
  "recommendedProducts": [],
  "userInfo": null
}
```

### **GET /api/chatbot/status**
Check chatbot status and features.

**Response:**
```json
{
  "success": true,
  "status": "online",
  "features": [
    "Product knowledge and recommendations",
    "Installation guidance",
    "Sales qualification",
    "Technical support",
    "Multi-language support"
  ]
}
```

## 🎯 Best Practices

### **1. Content Management**
- Keep product knowledge up-to-date
- Regularly update implementation guides
- Add new sales qualification questions
- Monitor and improve response quality

### **2. Performance Optimization**
- Implement conversation caching
- Use efficient intent recognition
- Optimize response generation
- Monitor API response times

### **3. User Experience**
- Provide clear, helpful responses
- Include relevant suggestions
- Offer multiple action options
- Maintain conversation context

### **4. Analytics and Monitoring**
- Track conversation flows
- Monitor user satisfaction
- Analyze common questions
- Identify improvement opportunities

## 🚀 Future Enhancements

### **Planned Features**
- **Machine Learning Integration**: Advanced NLP and intent recognition
- **Voice Support**: Speech-to-text and text-to-speech
- **Advanced Analytics**: Conversation insights and user behavior
- **Integration APIs**: CRM, email marketing, and sales tools
- **Custom Training**: Domain-specific AI model training

### **Advanced Capabilities**
- **Predictive Responses**: Anticipate user needs
- **Personalization**: User-specific recommendations
- **Multi-modal Support**: Image and document processing
- **Real-time Collaboration**: Human agent handoff
- **Advanced Security**: Enhanced data protection

## 📞 Support

For questions about the AI chatbot implementation:

- **Technical Issues**: Check the console logs and API responses
- **Customization**: Modify the knowledge base and response handlers
- **Integration**: Update the frontend component and backend routes
- **Performance**: Monitor response times and optimize as needed

## 🎉 Success Metrics

Track these metrics to measure chatbot effectiveness:

- **Engagement Rate**: Percentage of users who interact with the chatbot
- **Resolution Rate**: Percentage of conversations that reach a satisfactory conclusion
- **Lead Generation**: Number of qualified leads generated through the chatbot
- **User Satisfaction**: Feedback scores and conversation ratings
- **Response Time**: Average time to generate and deliver responses

---

**The ScaleVolt AI Chatbot is designed to provide intelligent, helpful, and engaging customer support while driving sales and improving user experience.** 