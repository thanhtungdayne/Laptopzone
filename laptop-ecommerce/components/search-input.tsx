"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Clock, Laptop, Tag, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSearch } from "@/context/search-context"

interface SearchInputProps {
  placeholder?: string
  className?: string
  onSearch?: () => void
}

export default function SearchInput({
  placeholder = "Tìm kiếm laptop...",
  className = "",
  onSearch,
}: SearchInputProps) {
  const { state, dispatch, search, getSuggestions } = useSearch()
  const [localQuery, setLocalQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        dispatch({ type: "SET_SHOW_SUGGESTIONS", payload: false })
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [dispatch])

  const handleInputChange = (value: string) => {
    setLocalQuery(value)
    dispatch({ type: "SET_QUERY", payload: value })

    if (value.trim()) {
      getSuggestions(value)
    } else {
      dispatch({ type: "CLEAR_SUGGESTIONS" })
    }
  }

  const handleSearch = (query?: string) => {
    const searchQuery = query || localQuery
    if (searchQuery.trim()) {
      search(searchQuery)
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      dispatch({ type: "SET_SHOW_SUGGESTIONS", payload: false })
      onSearch?.()
    }
  }

  const handleSuggestionClick = (suggestion: any) => {
    if (suggestion.type === "product") {
      router.push(`/product/${suggestion.data.id}`)
    } else if (suggestion.type === "brand") {
      search("", { brand: suggestion.data })
      router.push(`/search?brand=${encodeURIComponent(suggestion.data)}`)
    } else if (suggestion.type === "category") {
      search("", { category: suggestion.data })
      router.push(`/search?category=${encodeURIComponent(suggestion.data)}`)
    }
    dispatch({ type: "SET_SHOW_SUGGESTIONS", payload: false })
    onSearch?.()
  }

  const handleRecentSearchClick = (recentQuery: string) => {
    setLocalQuery(recentQuery)
    handleSearch(recentQuery)
  }

  const clearRecentSearch = (searchToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // In a real app, you'd remove this from recent searches
    console.log("Remove recent search:", searchToRemove)
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "product":
        return <Laptop className="h-4 w-4 text-muted-foreground" />
      case "brand":
      case "category":
        return <Tag className="h-4 w-4 text-muted-foreground" />
      default:
        return <Search className="h-4 w-4 text-muted-foreground" />
    }
  }

  const showSuggestions = isFocused && (state.showSuggestions || state.recentSearches.length > 0)

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          className="pl-8 pr-4"
          value={localQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          onFocus={() => {
            setIsFocused(true)
            if (localQuery.trim()) {
              getSuggestions(localQuery)
            }
          }}
          onBlur={() => {
            // Delay hiding suggestions to allow clicks
            setTimeout(() => setIsFocused(false), 200)
          }}
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          {/* Recent Searches */}
          {!localQuery.trim() && state.recentSearches.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Tìm kiếm gần đây</div>
              {state.recentSearches.map((recentQuery, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted rounded-sm"
                  onClick={() => handleRecentSearchClick(recentQuery)}
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{recentQuery}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={(e) => clearRecentSearch(recentQuery, e)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </button>
              ))}
            </div>
          )}

          {/* Search Suggestions */}
          {state.suggestions.length > 0 && (
            <div className="p-2">
              {!localQuery.trim() && state.recentSearches.length > 0 && <div className="border-t my-2" />}
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Gợi ý</div>
              {state.suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-muted rounded-sm text-left"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {getSuggestionIcon(suggestion.type)}
                  <span>{suggestion.text}</span>
                </button>
              ))}
            </div>
          )}

          {/* No suggestions */}
          {localQuery.trim() && state.suggestions.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">Không tìm thấy gợi ý cho "{localQuery}"</div>
          )}
        </div>
      )}
    </div>
  )
}
