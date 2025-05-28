import React, { useState, useMemo } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './ProductQuoteForm.css';

export default function ProductQuoteForm({ productType, productId, productName }) {
  // Reactive state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    consumption: '',
    applicantType: '',
    reason: '',
    productId,
    productName,
    source: 'web_store',
    timestamp: new Date().toISOString(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Computed
  const isSolar   = useMemo(() => productType === 'solar',   [productType]);
  const isCharger = useMemo(() => productType === 'charger', [productType]);

  // Handlers
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const submitForm = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage('');

    try {
      const resp = await axios.post('/api/quote-requests', formData);
      if (resp.status === 200 || resp.status === 201) {
        setFormSuccess(true);
        setFormMessage(
          "Дякуємо! Ваш запит успішно надіслано. Наші менеджери зв'яжуться з вами найближчим часом."
        );
        // reset
        setFormData({
          name: '',
          phone: '',
          email: '',
          address: '',
          consumption: '',
          applicantType: '',
          reason: '',
          productId,
          productName,
          source: 'web_store',
          timestamp: new Date().toISOString(),
        });
      } else {
        throw new Error('Не вдалося відправити запит');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setFormSuccess(false);
      setFormMessage(
        "Виникла помилка при відправці запиту. Будь ласка, спробуйте пізніше або зв'яжіться з нами за телефоном."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`quote-form-container ${isSolar ? 'solar-form' : ''} ${isCharger ? 'charger-form' : ''}`}>
      <h3 className="form-title">
        {isSolar 
          ? 'Отримати безкоштовний розрахунок' 
          : 'Стати хостом зарядної станції'}
      </h3>

      <form onSubmit={submitForm} className="quote-form">
        {/* Contact Info */}
        <div className="form-section contact-info">
          <h4>Ваші контакти</h4>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Ім'я</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Введіть ваше ім'я"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Телефон</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+380"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Solar-specific */}
        {isSolar && (
          <div className="form-section solar-specific">
            <h4>Дані для розрахунку</h4>
            <div className="form-group">
              <label htmlFor="address">Адреса встановлення</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Вкажіть адресу об'єкта"
                required
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="consumption">
                Середньомісячне споживання (кВт)
              </label>
              <input
                type="number"
                id="consumption"
                name="consumption"
                placeholder="Наприклад: 300"
                required
                value={formData.consumption}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {/* Charger-specific */}
        {isCharger && (
          <div className="form-section charger-specific">
            <div className="form-group">
              <label htmlFor="applicantType">Тип заявника</label>
              <select
                id="applicantType"
                name="applicantType"
                required
                value={formData.applicantType}
                onChange={handleChange}
              >
                <option value="" disabled>Виберіть тип заявника</option>
                <option value="business">Бізнес</option>
                <option value="individual">Приватна особа</option>
                <option value="government">Державна установа</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="reason">
                Чому ви зацікавлені стати хостом зарядної станції Tesla?
              </label>
              <textarea
                id="reason"
                name="reason"
                rows="3"
                placeholder="Опишіть ваші мотиви та очікування"
                required
                value={formData.reason}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Відправляємо...' : 'Отримати розрахунок'}
          </button>
        </div>

        {formMessage && (
          <div className={`form-message ${formSuccess ? 'success' : 'error'}`}>
            {formMessage}
          </div>
        )}
      </form>
    </div>
  );
}

ProductQuoteForm.propTypes = {
  productType: PropTypes.oneOf(['solar','charger']).isRequired,
  productId:    PropTypes.oneOfType([PropTypes.string,PropTypes.number]).isRequired,
  productName:  PropTypes.string.isRequired,
};
