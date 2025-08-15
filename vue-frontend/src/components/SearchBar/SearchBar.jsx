import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X, Clock, TrendingUp, Tag } from 'lucide-react';
import searchService from '../../services/searchService';
import './SearchBar.css';

export default function SearchBar({
  allProducts = [],
  onSearchSelected,
  onSearchPerformed,
  onSuggestionSelected,
  className = '',
  placeholder
}) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current region from URL
  const region = location.pathname.split('/')[1] || 'ua';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Handle search input changes with debouncing
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    
    // Use the search service for debounced search
    const performSearch = async () => {
      try {
        const results = await searchService.searchWithAutocomplete(searchTerm, {
          language: i18n.language,
          includeSuggestions: true
        });
        
        setSearchResults(results.products || []);
        setSuggestions(results.suggestions || []);
        setShowDropdown(true);
      } catch (error) {
        console.error('Search error:', error);
        // Fallback to local search
        const localResults = searchService.fuzzySearch(searchTerm, allProducts);
        setSearchResults(localResults);
        setSuggestions([]);
        setShowDropdown(true);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [searchTerm, i18n.language, allProducts]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showDropdown) return;

      const totalItems = searchResults.length + suggestions.length;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < totalItems - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            const allItems = [...searchResults, ...suggestions];
            const selectedItem = allItems[selectedIndex];
            handleItemSelect(selectedItem);
          } else {
            handleSearch(e);
          }
          break;
        case 'Escape':
          setShowDropdown(false);
          setSelectedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showDropdown, selectedIndex, searchResults, suggestions]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearchPerformed?.({ query: searchTerm.trim() });
      navigate(`/${region}/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  };

  const handleItemSelect = (item) => {
    if (item.type === 'category') {
      // Navigate to category
      navigate(`/${region}/category/${item.id}`);
    } else if (item.type === 'recent' || item.type === 'popular') {
      // Set search term and perform search
      setSearchTerm(item.text);
      onSearchPerformed?.({ query: item.text });
      navigate(`/${region}/search?q=${encodeURIComponent(item.text)}`);
    } else {
      // Product selection
      onSearchSelected?.(item);
      navigate(`/${region}/product/${item.id}`);
    }
    
    setSearchTerm('');
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion) => {
    onSuggestionSelected?.(suggestion);
    if (suggestion.type === 'category') {
      navigate(`/${region}/category/${suggestion.id}`);
    } else {
      setSearchTerm(suggestion.text);
      onSearchPerformed?.({ query: suggestion.text });
      navigate(`/${region}/search?q=${encodeURIComponent(suggestion.text)}`);
    }
    setShowDropdown(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSuggestions([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'recent':
        return <Clock size={14} />;
      case 'popular':
        return <TrendingUp size={14} />;
      case 'category':
        return <Tag size={14} />;
      default:
        return null;
    }
  };

  const renderSuggestionItem = (suggestion, index) => {
    const isSelected = index === selectedIndex;
    return (
      <div
        key={`suggestion-${index}`}
        className={`suggestion-item ${isSelected ? 'highlighted' : ''}`}
        onClick={() => handleSuggestionClick(suggestion)}
        onMouseEnter={() => setSelectedIndex(index)}
      >
        <div className="suggestion-content">
          {getSuggestionIcon(suggestion.type)}
          <span className="suggestion-text">{suggestion.text}</span>
        </div>
      </div>
    );
  };

  const renderProductItem = (product, index) => {
    const actualIndex = suggestions.length + index;
    const isSelected = actualIndex === selectedIndex;
    
    return (
      <div
        key={`product-${product.id}`}
        className={`dropdown-item ${isSelected ? 'highlighted' : ''}`}
        onClick={() => handleItemSelect(product)}
        onMouseEnter={() => setSelectedIndex(actualIndex)}
      >
        <div className="product-info">
          <div className="product-image">
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <div className="product-placeholder">📦</div>
            )}
          </div>
          <div className="product-details">
            <div className="product-name">{product.name}</div>
            <div className="product-meta">
              ${product.price} • {product.category}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`search-container ${className}`} ref={searchRef}>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder || t('search.placeholder', 'Search products...')}
            className="search-input"
            autoComplete="off"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="clear-button"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button type="submit" className="search-button">
          {t('search.button', 'Search')}
        </button>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div ref={dropdownRef} className="results-dropdown">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <span>{t('search.loading', 'Searching...')}</span>
            </div>
          ) : (
            <>
              {/* Suggestions Section */}
              {suggestions.length > 0 && (
                <div className="suggestions-section">
                  <h4 className="suggestions-title">
                    {t('search.suggestions', 'Suggestions')}
                  </h4>
                  <div className="suggestions-list">
                    {suggestions.map((suggestion, index) => 
                      renderSuggestionItem(suggestion, index)
                    )}
                  </div>
                </div>
              )}

              {/* Products Section */}
              {searchResults.length > 0 && (
                <div className="products-section">
                  <h4 className="products-title">
                    {t('search.products', 'Products')}
                  </h4>
                  <div className="products-list">
                    {searchResults.map((product, index) => 
                      renderProductItem(product, index)
                    )}
                  </div>
                </div>
              )}

              {/* No Results */}
              {searchResults.length === 0 && suggestions.length === 0 && searchTerm && (
                <div className="no-results">
                  <span>{t('search.noResults', 'No products found')}</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
