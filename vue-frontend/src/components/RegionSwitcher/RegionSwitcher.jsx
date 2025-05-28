import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './RegionSwitcher.css';

const availableLocales = [
  { code: 'ua', name: 'Українська', emoji: '🇺🇦' },
  { code: 'pl', name: 'Polski',      emoji: '🇵🇱' }
];

export default function RegionSwitcher() {
  const { i18n } = useTranslation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const containerRef = useRef(null);

  // current locale code
  const currentLocale = i18n.language;

  // find emoji/name for display
  const currentLocaleDetails = useMemo(() => {
    return availableLocales.find(l => l.code === currentLocale) || availableLocales[0];
  }, [currentLocale]);

  // toggle the dropdown
  const toggleDropdown = e => {
    e.stopPropagation();
    setDropdownVisible(v => !v);
  };

  // select a new locale and force reload
  const selectLocale = code => {
    if (code === currentLocale) {
      setDropdownVisible(false);
      return;
    }
    i18n.changeLanguage(code);
    localStorage.setItem('userLocale', code);
    document.documentElement.setAttribute('lang', code);
    setDropdownVisible(false);
    window.location.reload();
  };

  // close on outside click
  useEffect(() => {
    const onClick = () => {
      if (dropdownVisible) setDropdownVisible(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [dropdownVisible]);

  // sync from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('userLocale');
    if (saved && saved !== currentLocale) {
      i18n.changeLanguage(saved);
      document.documentElement.setAttribute('lang', saved);
    }
  }, [i18n, currentLocale]);

  return (
    <div className="region-switcher" ref={containerRef}>
      <div className="region-selector" onClick={toggleDropdown}>
        <span className="lang-code">
          {currentLocaleDetails.emoji} {currentLocale.toUpperCase()}
        </span>
        <div className="region-icon-container">
          <img
            src="/images/header/globe-icon.svg"
            alt="Region Icon"
            className="region-icon"
          />
        </div>
      </div>

      {dropdownVisible && (
        <div className="region-dropdown" onClick={e => e.stopPropagation()}>
          {availableLocales.map(locale => (
            <div
              key={locale.code}
              className={`region-option${currentLocale === locale.code ? ' active' : ''}`}
              onClick={() => selectLocale(locale.code)}
            >
              <span className="locale-emoji">{locale.emoji}</span>
              <span className="language">{locale.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
