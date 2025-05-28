import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const InstallationPopup = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Don't render if not open
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Ім\'я обов\'язкове';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обов\'язковий';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Невірний формат телефону';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email обов\'язковий';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Невірний формат email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      
      // Reset form after successful submission
      setFormData({ name: '', phone: '', email: '' });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="installation-overlay" onClick={handleOverlayClick}>
      <div className="installation-popup">
        <div className="installation-popup-header">
          <h3>Залишити заявку</h3>
          <button 
            type="button"
            onClick={onClose}
            className="close-button"
            disabled={isSubmitting}
          >
            <img src="/images/close.svg" alt="Закрити" width="20" />
          </button>
        </div>
        
        <div className="popup-form">
          <div className="form-row">
            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Ваше ім'я"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                disabled={isSubmitting}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="input-group">
              <input
                type="tel"
                name="phone"
                placeholder="Телефон"
                value={formData.phone}
                onChange={handleInputChange}
                className={`form-input ${errors.phone ? 'error' : ''}`}
                disabled={isSubmitting}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
          </div>
          
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              disabled={isSubmitting}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <button 
            type="button" 
            className="submit-button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Відправляємо...' : 'Відправити заявку'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .installation-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(22, 21, 21, 0.7);
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-top: 10vh;
          z-index: 1000;
        }

        .installation-popup {
          background: #ffffff;
          border-radius: 16px;
          padding: 32px;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .installation-popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .installation-popup-header h3 {
          font-weight: 500;
          font-size: 32px;
          line-height: 1.24;
          margin: 0;
          color: #262626;
        }

        .close-button {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background-color 0.2s;
        }

        .close-button:hover {
          background-color: #f5f5f5;
        }

        .close-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .popup-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: flex;
          gap: 16px;
        }

        .input-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-input {
          width: 100%;
          height: 50px;
          padding: 14px 20px;
          border: 1px solid #262626;
          border-radius: 12px;
          font-weight: 500;
          font-size: 18px;
          line-height: 1.32;
          color: #262626;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-input::placeholder {
          color: #b2bac0;
          font-weight: 500;
          font-size: 18px;
        }

        .form-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .form-input.error {
          border-color: #dc3545;
        }

        .form-input:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
        }

        .error-message {
          color: #dc3545;
          font-size: 14px;
          font-weight: 400;
        }

        .submit-button {
          background: #007bff;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 16px 24px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.1s;
          margin-top: 16px;
        }

        .submit-button:hover:not(:disabled) {
          background: #0056b3;
          transform: translateY(-1px);
        }

        .submit-button:disabled {
          background: #6c757d;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 768px) {
          .installation-popup {
            padding: 24px;
            margin: 20px;
          }

          .installation-popup-header h3 {
            font-size: 24px;
          }

          .form-row {
            flex-direction: column;
            gap: 16px;
          }

          .form-input {
            font-size: 16px;
          }

          .form-input::placeholder {
            font-size: 16px;
          }

          .submit-button {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default InstallationPopup;