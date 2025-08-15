import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Send, Bot, User, Loader2, ShoppingCart, Info, HelpCircle } from 'lucide-react';
import './AIChatbot.css';

const AIChatbot = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize chatbot with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'bot',
        content: t('chatbot.welcome', 'Hello! I\'m your ScaleVolt AI assistant. I can help you with:'),
        timestamp: new Date(),
        suggestions: [
          t('chatbot.suggestions.products', 'Browse products'),
          t('chatbot.suggestions.installation', 'Installation help'),
          t('chatbot.suggestions.quote', 'Get a quote'),
          t('chatbot.suggestions.support', 'Technical support')
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, t, i18n.language]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (content) => {
    if (!content.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          language: i18n.language,
          userInfo,
          conversationHistory: messages.slice(-5) // Send last 5 messages for context
        })
      });

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions || [],
        products: data.recommendedProducts || [],
        actions: data.actions || [],
        detectedLanguage: data.detectedLanguage
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Update user info if provided
      if (data.userInfo) {
        setUserInfo(prev => ({ ...prev, ...data.userInfo }));
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: t('chatbot.error', 'Sorry, I\'m having trouble right now. Please try again or contact our support team.'),
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const handleProductClick = (product) => {
    window.open(`/product/${product.id}`, '_blank');
  };

  const handleActionClick = (action) => {
    switch (action.type) {
      case 'open_quote_form':
        window.location.href = '/quote';
        break;
      case 'open_support':
        window.location.href = '/support';
        break;
      case 'open_cart':
        window.location.href = '/cart';
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('chatbot.toggle', 'Toggle chat')}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="chatbot-container">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <Bot size={20} />
              <span>{t('chatbot.title', 'ScaleVolt AI Assistant')}</span>
            </div>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label={t('chatbot.close', 'Close chat')}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chatbot-message ${message.type} ${message.isError ? 'error' : ''}`}
              >
                <div className="message-avatar">
                  {message.type === 'bot' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="message-content">
                  <div className="message-text">{message.content}</div>
                  
                  {/* Product Recommendations */}
                  {message.products && message.products.length > 0 && (
                    <div className="message-products">
                      <h4>{t('chatbot.recommendedProducts', 'Recommended Products:')}</h4>
                      <div className="product-cards">
                        {message.products.map((product) => (
                          <div
                            key={product.id}
                            className="product-card"
                            onClick={() => handleProductClick(product)}
                          >
                            <img src={product.image_url} alt={product.name} />
                            <div className="product-info">
                              <h5>{product.name}</h5>
                              <p className="price">${product.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="message-actions">
                      {message.actions.map((action, index) => (
                        <button
                          key={index}
                          className="action-button"
                          onClick={() => handleActionClick(action)}
                        >
                          {action.icon === 'cart' && <ShoppingCart size={16} />}
                          {action.icon === 'info' && <Info size={16} />}
                          {action.icon === 'help' && <HelpCircle size={16} />}
                          {action.text}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="message-suggestions">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="suggestion-button"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="chatbot-message bot">
                <div className="message-avatar">
                  <Bot size={16} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <Loader2 size={16} className="animate-spin" />
                    <span>{t('chatbot.typing', 'AI is typing...')}</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('chatbot.inputPlaceholder', 'Type your message...')}
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="send-button"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatbot; 