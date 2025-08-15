import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for debounced search functionality
 * @param {Object} options - Search options
 * @param {number} options.debounceMs - Debounce delay in milliseconds (default: 300)
 * @param {string} options.apiUrl - API base URL (default: from env)
 * @param {number} options.minQueryLength - Minimum query length to trigger search (default: 2)
 * @param {number} options.maxResults - Maximum number of results to return (default: 10)
 */
const useSearch = (options = {}) => {
  const {
    debounceMs = 300,
    apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4242/api',
    minQueryLength = 2,
    maxResults = 10
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);

  const debounceTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    (searchQuery, searchOffset = 0, category = null) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        if (searchQuery.length < minQueryLength) {
          setResults([]);
          setSuggestions([]);
          setLoading(false);
          setError(null);
          return;
        }

        setLoading(true);
        setError(null);

        // Cancel previous request if it exists
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        try {
          const params = new URLSearchParams({
            q: searchQuery,
            limit: maxResults.toString(),
            offset: searchOffset.toString()
          });

          if (category) {
            params.append('category', category);
          }

          const response = await fetch(`${apiUrl}/search/products?${params}`, {
            signal: abortControllerRef.current.signal,
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (data.success) {
            if (searchOffset === 0) {
              setResults(data.data);
            } else {
              setResults(prev => [...prev, ...data.data]);
            }
            setTotal(data.pagination.total);
            setHasMore(data.pagination.has_more);
            setOffset(searchOffset + data.data.length);
          } else {
            throw new Error(data.error || 'Search failed');
          }
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error('Search error:', error);
            setError(error.message);
          }
        } finally {
          setLoading(false);
        }
      }, debounceMs);
    },
    [debounceMs, apiUrl, minQueryLength, maxResults]
  );

  // Debounced suggestions function
  const debouncedSuggestions = useCallback(
    (searchQuery) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        if (searchQuery.length < minQueryLength) {
          setSuggestions([]);
          return;
        }

        // Cancel previous request if it exists
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        try {
          const params = new URLSearchParams({
            q: searchQuery,
            limit: '5'
          });

          const response = await fetch(`${apiUrl}/search/suggestions?${params}`, {
            signal: abortControllerRef.current.signal,
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (data.success) {
            setSuggestions(data.data);
          }
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error('Suggestions error:', error);
          }
        }
      }, debounceMs);
    },
    [debounceMs, apiUrl, minQueryLength]
  );

  // Search products
  const searchProducts = useCallback(
    (searchQuery, searchOffset = 0, category = null) => {
      setQuery(searchQuery);
      debouncedSearch(searchQuery, searchOffset, category);
    },
    [debouncedSearch]
  );

  // Get suggestions
  const getSuggestions = useCallback(
    (searchQuery) => {
      debouncedSuggestions(searchQuery);
    },
    [debouncedSuggestions]
  );

  // Load more results
  const loadMore = useCallback(() => {
    if (!loading && hasMore && query) {
      searchProducts(query, offset);
    }
  }, [loading, hasMore, query, offset, searchProducts]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setLoading(false);
    setError(null);
    setHasMore(false);
    setTotal(0);
    setOffset(0);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Search categories
  const searchCategories = useCallback(
    async (searchQuery) => {
      if (searchQuery.length < minQueryLength) {
        return [];
      }

      try {
        const params = new URLSearchParams({
          q: searchQuery
        });

        const response = await fetch(`${apiUrl}/search/categories?${params}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          return data.data;
        } else {
          throw new Error(data.error || 'Category search failed');
        }
      } catch (error) {
        console.error('Category search error:', error);
        return [];
      }
    },
    [apiUrl, minQueryLength]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // State
    query,
    results,
    suggestions,
    loading,
    error,
    hasMore,
    total,
    offset,

    // Actions
    searchProducts,
    getSuggestions,
    loadMore,
    clearSearch,
    searchCategories,

    // Utilities
    isSearching: loading,
    hasResults: results.length > 0,
    hasSuggestions: suggestions.length > 0,
    isEmpty: !loading && results.length === 0 && query.length >= minQueryLength,
  };
};

export default useSearch;
