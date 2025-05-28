import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';
import { Link, useNavigate } from 'react-router-dom';
import productService from '@/services/productService';
import { useProductsStore } from '@/stores/products';
import styles from './SearchBar.module.css';

export default function SearchBar({
  allProducts,
  searchKeys = ['name', 'description', 'sku', 'category'],
  minSearchLength = 2,
  productRoute = '/product/',
  maxSuggestions = 5,
  minSuggestionLength = 1,
  onlyShowInStock = false,
  onSearchSelected,       // emit: "search-selected"
  onSearchPerformed,     // emit: "search-performed"
  onSuggestionSelected   // emit: "suggestion-selected"
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const store = useProductsStore();

  const searchContainer = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [autoSuggestions, setAutoSuggestions] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Compute effectiveProducts just like Vue computed()
  const effectiveProducts = store.getProducts.length
    ? store.getProducts
    : allProducts;

  // Debounced search logic
  const performSearch = useCallback(debounce(() => {
    const query = searchTerm.trim().toLowerCase();
    const lang = localStorage.getItem('userLocale') || 'en';
    setNoResults(false);

    if (query.length < minSearchLength) {
      setFilteredResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const results = effectiveProducts.filter(p => {
        if (onlyShowInStock && p.stock !== undefined && p.stock <= 0) return false;
        if (p.searchableText) {
          return p.searchableText.includes(query);
        }
        return searchKeys.some(key => {
          const val = p[key] ?? p[`${key}Uk`] ?? p[`${key}Pl`];
          return String(val ?? '').toLowerCase().includes(query);
        });
      });
      setNoResults(results.length === 0);
      setFilteredResults(results.slice(0, 10));
      onSearchPerformed?.({
        term: query,
        lang,
        resultsCount: results.length,
        limitedResults: results.slice(0, 10)
      });
    } catch (err) {
      console.error(err);
      setError(t('search_error') || 'Error searching products.');
      setFilteredResults([]);
    } finally {
      setIsLoading(false);
    }
  }, 300), [searchTerm, effectiveProducts]);

  // Generate suggestions (mirrors generateSuggestions in Vue)
  const generateSuggestions = (query) => {
    if (query.length < minSuggestionLength) {
      setAutoSuggestions([]);
      return;
    }
    const normalized = query.trim().toLowerCase();
    const setS = new Set();

    effectiveProducts.forEach(p => {
      if (onlyShowInStock && p.stock !== undefined && p.stock <= 0) return;
      if (p.searchableText) {
        p.searchableText.split(/\s+/).forEach(w => {
          if (w.length > 3 && w.includes(normalized)) setS.add(w);
        });
      }
      searchKeys.forEach(key => {
        [key, `${key}Uk`, `${key}Pl`].forEach(k => {
          const v = String(p[k] ?? '').toLowerCase();
          if (v.includes(normalized)) setS.add(v);
        });
      });
    });

    let suggestions = Array.from(setS)
      .filter(s => s.includes(normalized))
      .sort((a, b) => {
        const aStarts = a.startsWith(normalized);
        const bStarts = b.startsWith(normalized);
        if (aStarts !== bStarts) return aStarts ? -1 : 1;
        return a.length - b.length;
      })
      .slice(0, maxSuggestions)
      .map(s => s.length > 50 ? s.slice(0, 50) + '...' : s);

    setAutoSuggestions(suggestions);
    setHighlightedIndex(-1);
  };

  // Event handlers (input, enter, arrow keys)
  const onInput = e => {
    const val = e.target.value;
    setSearchTerm(val);
    setShowDropdown(true);
    generateSuggestions(val);
    performSearch();
  };
  const onEnter = e => {
    if (highlightedIndex >= 0) {
      applySuggestion(autoSuggestions[highlightedIndex]);
    } else if (filteredResults.length) {
      selectProduct(filteredResults[0]);
    } else {
      onSearchPerformed?.({ term: searchTerm.trim(), resultsCount: 0, action: 'enter-key' });
    }
  };
  const highlightNext = () => {
    setHighlightedIndex(i => i < autoSuggestions.length - 1 ? i+1 : 0);
  };
  const highlightPrev = () => {
    setHighlightedIndex(i => i > 0 ? i-1 : autoSuggestions.length - 1);
  };

  // Selectors
  const selectProduct = (p) => {
    onSearchSelected?.(p);
    navigate(`${productRoute}${p.id}`);
    resetAll();
  };
  const applySuggestion = s => {
    setSearchTerm(s);
    setShowDropdown(true);
    performSearch();
    onSuggestionSelected?.(s);
  };
  const resetAll = () => {
    setSearchTerm('');
    setFilteredResults([]);
    setAutoSuggestions([]);
    setShowDropdown(false);
  };

  // Outside click closes dropdown
  useEffect(() => {
    const onClick = (e) => {
      if (searchContainer.current && !searchContainer.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <div className={styles['search-container']} ref={searchContainer}>
      <div className={styles['search-input-wrapper']} style={{width:'100%'}}>
        <input
          type="text"
          placeholder={t('common.search')}
          value={searchTerm}
          onChange={onInput}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.preventDefault(); onEnter(e); }
            if (e.key === 'ArrowDown') { e.preventDefault(); highlightNext(); }
            if (e.key === 'ArrowUp')   { e.preventDefault(); highlightPrev(); }
          }}
          aria-label="Search Products"
          onFocus={onInput}
          className={styles['search-input']}
          style={{width:'100%',minWidth:'216px'}}
        />
        <div className={styles['search-icon-wrapper']}>
          {/* same SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={styles['search-icon']}>
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>
      </div>

      {showDropdown && (
        <div className={styles['results-dropdown']}>
          {searchResult.length && searchTerm.length >= minSuggestionLength && (
            <div className={styles['suggestions-section']}>
              <h4 className={styles['suggestions-title']}>Suggestions</h4>
              <ul className={`${styles['suggestions-list']} flex flex-col px-20`}>
                {searchResult.map((sugg, i) => (
                  <li key={i} className={`${styles['suggestions-item']} flex jutify-between w-full`} onMouseDown={() => applySuggestion(sugg)}>
                    <Link to={`/product/${sugg.id}`} className="flex jutify-between w-full items-center">
                      <img className="suggestion-img" src={sugg.image} alt={sugg.defaultName || 'Product Image'} />
                      <div className="flex flex-col">
                        <h5 className="w-[200px] break-all">{t(sugg.nameKey)}</h5>
                        <span className="mt-10">{sugg.price} грн</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isLoading && (
            <div className={styles['dropdown-message']}>
              <div className={styles.spinner}></div>
              <span>Searching...</span>
            </div>
          )}

          {!isLoading && noResults && !autoSuggestions.length && (
            <div className={styles['dropdown-message']}>
              No results found for "{searchTerm}"
            </div>
          )}

          {filteredResults.length > 0 && (
            <div className={styles['products-section']}>
              {autoSuggestions.length > 0 && <h4 className={styles['products-title']}>Products</h4>}
              <ul className={styles['products-list']}>
                {filteredResults.map(p => (
                  <li key={p.id} className={styles['dropdown-item']} onMouseDown={() => selectProduct(p)}>
                    <div className={styles['product-info']}>
                      <img
                        src={p.image || '/default-product-image.png'}
                        alt={p.name}
                        className={styles['product-image']}
                        onError={e => e.currentTarget.src = '/default-product-image.png'}
                      />
                      <div className={styles['product-details']}>
                        <span className={styles['product-name']}>{p.name}</span>
                        <div className={styles['product-meta']}>
                          {p.price !== undefined && (
                            <span className={styles['product-price']}>
                              {typeof p.price === 'number' ? p.price.toFixed(2) : p.price}
                            </span>
                          )}
                          {p.stock !== undefined && (
                            <span className={styles['product-stock']}>
                              {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && <div className={styles['error-message']}>{error}</div>}
        </div>
      )}
    </div>
  );
}
