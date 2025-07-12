"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type { Laptop } from "@/types/product";
import { laptops } from "@/data/laptops";

export interface SearchFilters {
  category: string;
  brand: string;
  priceRange: [number, number];
  inStock: boolean;
}

export interface SearchSuggestion {
  type: "product" | "brand" | "category";
  text: string;
  data?: Laptop | string;
}

interface SearchState {
  query: string;
  results: Laptop[];
  suggestions: SearchSuggestion[];
  filters: SearchFilters;
  sortBy: string;
  isLoading: boolean;
  showSuggestions: boolean;
  recentSearches: string[];
}

type SearchAction =
  | { type: "SET_QUERY"; payload: string }
  | { type: "SET_RESULTS"; payload: Laptop[] }
  | { type: "SET_SUGGESTIONS"; payload: SearchSuggestion[] }
  | { type: "SET_FILTERS"; payload: Partial<SearchFilters> }
  | { type: "SET_SORT"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SHOW_SUGGESTIONS"; payload: boolean }
  | { type: "ADD_RECENT_SEARCH"; payload: string }
  | { type: "CLEAR_SUGGESTIONS" }
  | { type: "CLEAR_SEARCH" };

const SearchContext = createContext<{
  state: SearchState;
  dispatch: React.Dispatch<SearchAction>;
  search: (query: string, filters?: Partial<SearchFilters>) => void;
  getSuggestions: (query: string) => void;
} | null>(null);

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, query: action.payload };
    case "SET_RESULTS":
      return { ...state, results: action.payload, isLoading: false };
    case "SET_SUGGESTIONS":
      return { ...state, suggestions: action.payload };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "SET_SORT":
      return { ...state, sortBy: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_SHOW_SUGGESTIONS":
      return { ...state, showSuggestions: action.payload };
    case "ADD_RECENT_SEARCH":
      const newRecentSearches = [
        action.payload,
        ...state.recentSearches.filter((s) => s !== action.payload),
      ].slice(0, 5);
      return { ...state, recentSearches: newRecentSearches };
    case "CLEAR_SUGGESTIONS":
      return { ...state, suggestions: [], showSuggestions: false };
    case "CLEAR_SEARCH":
      return {
        ...state,
        query: "",
        results: [],
        suggestions: [],
        showSuggestions: false,
      };
    default:
      return state;
  }
}

const initialState: SearchState = {
  query: "",
  results: [],
  suggestions: [],
  filters: {
    category: "",
    brand: "",
    priceRange: [0, 5000],
    inStock: false,
  },
  sortBy: "relevance",
  isLoading: false,
  showSuggestions: false,
  recentSearches: [],
};

export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  const search = useCallback(
    (query: string, filters?: Partial<SearchFilters>) => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_QUERY", payload: query });

      if (filters) {
        dispatch({ type: "SET_FILTERS", payload: filters });
      }

      // Use current state for filters if no new filters provided
      const currentFilters = { ...state.filters, ...filters };

      // Simulate API delay
      setTimeout(() => {
        const results = performSearch(query, currentFilters, state.sortBy);
        dispatch({ type: "SET_RESULTS", payload: results });

        if (query.trim()) {
          dispatch({ type: "ADD_RECENT_SEARCH", payload: query.trim() });
        }
      }, 300);
    },
    [state.filters, state.sortBy]
  );

  const getSuggestions = useCallback((query: string) => {
    if (!query.trim()) {
      dispatch({ type: "CLEAR_SUGGESTIONS" });
      return;
    }

    const suggestions = generateSuggestions(query);
    dispatch({ type: "SET_SUGGESTIONS", payload: suggestions });
    dispatch({ type: "SET_SHOW_SUGGESTIONS", payload: true });
  }, []);

  return (
    <SearchContext.Provider value={{ state, dispatch, search, getSuggestions }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}

// Search logic
function performSearch(query: string, filters: SearchFilters, sortBy: string): Laptop[] {
  let results = laptops;

  // Text search
  if (query.trim()) {
    const searchTerms = query.toLowerCase().split(" ");
    results = results.filter((laptop) => {
      const searchableText = `
        ${laptop.name} 
        ${laptop.brand} 
        ${laptop.processor} 
        ${laptop.category}
        ${laptop.features.join(" ")}
      `.toLowerCase();

      return searchTerms.every((term) => searchableText.includes(term));
    });
  }

  // Apply filters
  if (filters.category) {
    results = results.filter((laptop) => laptop.category === filters.category);
  }

  if (filters.brand) {
    results = results.filter((laptop) => laptop.brand === filters.brand);
  }

  if (filters.priceRange) {
    results = results.filter(
      (laptop) =>
        laptop.price >= filters.priceRange[0] && laptop.price <= filters.priceRange[1]
    );
  }

  if (filters.inStock) {
    results = results.filter((laptop) => laptop.inStock);
  }

  // Sort results
  switch (sortBy) {
    case "price-low":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      results.sort((a, b) => b.price - a.price);
      break;
    case "name":
      results.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "relevance":
    default:
      // Keep original order for relevance
      break;
  }

  return results;
}

// Generate search suggestions
function generateSuggestions(query: string): SearchSuggestion[] {
  const suggestions: SearchSuggestion[] = [];
  const lowerQuery = query.toLowerCase();

  // Product suggestions
  const productMatches = laptops
    .filter((laptop) => laptop.name.toLowerCase().includes(lowerQuery))
    .slice(0, 3)
    .map((laptop) => ({
      type: "product" as const,
      text: laptop.name,
      data: laptop,
    }));

  // Brand suggestions
  const brands = [...new Set(laptops.map((laptop) => laptop.brand))];
  const brandMatches = brands
    .filter((brand) => brand.toLowerCase().includes(lowerQuery))
    .slice(0, 2)
    .map((brand) => ({
      type: "brand" as const,
      text: `${brand} laptops`,
      data: brand,
    }));

  // Category suggestions
  const categories = [...new Set(laptops.map((laptop) => laptop.category))];
  const categoryMatches = categories
    .filter((category) => category.toLowerCase().includes(lowerQuery))
    .slice(0, 2)
    .map((category) => ({
      type: "category" as const,
      text: `${category.charAt(0).toUpperCase() + category.slice(1)} laptops`,
      data: category,
    }));

  return [...productMatches, ...brandMatches, ...categoryMatches].slice(0, 6);
}
