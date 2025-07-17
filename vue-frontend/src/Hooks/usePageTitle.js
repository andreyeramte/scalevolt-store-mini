import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const usePageTitle = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const getPageTitle = (pathname) => {
      const pathSegments = pathname.split('/').filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1];
      const titleMap = {
        '': 'Home',
        'solar-panels': 'Solar Panels',
        'batteries': 'Batteries',
        'inverters': 'Inverters',
        'cart': 'Shopping Cart',
        'checkout': 'Checkout',
        'profile': 'User Profile',
        'company': 'Company',
        'auth': 'Authentication'
      };
      const baseTitle = titleMap[lastSegment] || 'SCALEVOLT';
      return `${t(baseTitle)} | SCALEVOLT`;
    };
    document.title = getPageTitle(location.pathname);
  }, [location.pathname, t]);
};

export default usePageTitle; 