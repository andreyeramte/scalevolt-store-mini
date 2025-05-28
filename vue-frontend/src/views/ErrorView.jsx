import React, { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ErrorView = ({ errorCode: propErrorCode, message: propMessage }) => {
  const navigate = useNavigate();
  const { errorCode: paramErrorCode } = useParams();
  const { t } = useTranslation();
  
  // Use prop errorCode first, then URL param, then default to 404
  const errorCode = propErrorCode || paramErrorCode || '404';
  
  const getErrorInfo = (code) => {
    switch (code) {
      case '404':
        return {
          title: t('error.notFound', 'Сторінка не знайдена'),
          message: propMessage || t('error.pageNotFoundMessage', 'Вибачте, сторінка, яку ви шукаете, не існує.')
        };
      case '500':
        return {
          title: t('error.serverError', 'Внутрішня помилка сервера'),
          message: propMessage || t('error.serverErrorMessage', 'Щось пішло не так. Спробуйте пізніше.')
        };
      case '403':
        return {
          title: t('error.forbidden', 'Доступ заборонено'),
          message: propMessage || t('error.forbiddenMessage', 'У вас немає прав для доступу до цієї сторінки.')
        };
      default:
        return {
          title: t('error.somethingWrong', 'Помилка'),
          message: propMessage || t('error.generalErrorMessage', 'Виникла несподівана помилка.')
        };
    }
  };

  const errorInfo = getErrorInfo(errorCode);

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const openChat = () => {
    console.log('Opening chat support');
    alert(t('error.chatNotAvailable', 'Чат наразі недоступний'));
  };

  // Set page title based on error code
  useEffect(() => {
    document.title = `${errorInfo.title} | SCALEVOLT`;
  }, [errorInfo.title]);

  return (
    <div className="error-page-container">
      <div className="error-content">
        <img src="/images/404.error.svg" alt="Error" className="error-icon" />
        
        <h1 className="error-title">{errorInfo.title}</h1>
        <p className="error-message">{errorInfo.message}</p>
        
        <div className="actions">
          <button onClick={goBack} className="btn-back">
            <i className="icon-arrow-left"></i> {t('error.goBack', 'Назад')}
          </button>
          <Link to="/" className="btn-home">
            <i className="icon-home"></i> {t('error.goHome', 'На головну')}
          </Link>
        </div>
        
        <div className="help-section">
          <h2>{t('error.needHelp', 'Потрібна допомога?')}</h2>
          <p>{t('error.contactSupport', 'Зв\'яжіться з нашою службою підтримки')}</p>
          <div className="contact-options">
            <a href="mailto:scalevolt.info@gmail.com" className="contact-option">
              <i className="icon-mail"></i>
              <span>scalevolt.info@gmail.com</span>
            </a>
            <a href="#" className="contact-option" onClick={(e) => { e.preventDefault(); openChat(); }}>
              <i className="icon-chat"></i>
              <span>{t('error.liveChat', 'Онлайн чат')}</span>
            </a>
            <a href="tel:+380XXXXXXXX" className="contact-option">
              <i className="icon-phone"></i>
              <span>+380 XX XXX XX XX</span>
            </a>
          </div>
        </div>
        
        <div className="suggested-links">
          <h3>{t('error.explorePages', 'Дослідіть наші сторінки')}</h3>
          <div className="link-grid">
            <Link to="/shop" className="suggested-link">
              <i className="icon-shop"></i>
              <span>{t('error.shop', 'Магазин')}</span>
            </Link>
            <Link to="/delivery-warranty-returns" className="suggested-link">
              <i className="icon-delivery"></i>
              <span>{t('error.delivery', 'Доставка')}</span>
            </Link>
            <Link to="/lease-info" className="suggested-link">
              <i className="icon-lease"></i>
              <span>{t('error.leaseInfo', 'Інформація про оренду')}</span>
            </Link>
            <Link to="/support" className="suggested-link">
              <i className="icon-support"></i>
              <span>{t('error.support', 'Підтримка')}</span>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .error-page-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          background-color: #f9f9f9;
          font-family: Arial, sans-serif;
        }

        .error-content {
          max-width: 800px;
          width: 100%;
          background-color: #ffffff;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .error-icon {
          width: 120px;
          height: 120px;
          margin-bottom: 30px;
        }

        .error-title {
          font-size: 32px;
          color: #333;
          margin-bottom: 15px;
        }

        .error-message {
          font-size: 18px;
          color: #666;
          margin-bottom: 30px;
          line-height: 1.5;
        }

        .actions {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 40px;
        }

        .btn-back, .btn-home {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .btn-back {
          background-color: #f0f0f0;
          color: #333;
          border: none;
        }

        .btn-back:hover {
          background-color: #e0e0e0;
        }

        .btn-home {
          background-color: #f26e9a;
          color: white;
          border: none;
        }

        .btn-home:hover {
          background-color: #e05a86;
        }

        .btn-back i, .btn-home i {
          margin-right: 8px;
          font-size: 18px;
        }

        .help-section {
          margin-top: 40px;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
        }

        .help-section h2 {
          font-size: 22px;
          color: #333;
          margin-bottom: 10px;
        }

        .help-section p {
          color: #666;
          margin-bottom: 20px;
        }

        .contact-options {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 15px;
        }

        .contact-option {
          display: flex;
          align-items: center;
          padding: 10px 15px;
          border-radius: 6px;
          background-color: #fff;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          color: #333;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .contact-option:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .contact-option i {
          margin-right: 10px;
          font-size: 20px;
          color: #f26e9a;
        }

        .suggested-links {
          margin-top: 40px;
        }

        .suggested-links h3 {
          font-size: 20px;
          color: #333;
          margin-bottom: 20px;
        }

        .link-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }

        .suggested-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px;
          border-radius: 8px;
          background-color: #f9f9f9;
          color: #333;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .suggested-link:hover {
          background-color: #f2f2f2;
          transform: translateY(-2px);
        }

        .suggested-link i {
          font-size: 24px;
          margin-bottom: 10px;
          color: #f26e9a;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .error-content {
            padding: 30px 20px;
          }
          
          .error-icon {
            width: 100px;
            height: 100px;
          }
          
          .error-title {
            font-size: 28px;
          }
          
          .error-message {
            font-size: 16px;
          }
          
          .actions {
            flex-direction: column;
          }
          
          .btn-back, .btn-home {
            width: 100%;
          }
          
          .contact-options {
            flex-direction: column;
          }
          
          .contact-option {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ErrorView;