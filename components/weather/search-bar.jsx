import { useState, useRef, useEffect, useCallback } from "react"
import { Search, X, Loader2, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { searchCities, clearSearch, fetchCityWeather } from "@/lib/store/weather-slice"
import { cn } from "@/lib/utils"

export function SearchBar() {
  const dispatch = useAppDispatch()
  const { searchResults, searchLoading } = useAppSelector((s) => s.weather)
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const debounceRef = useRef(null)

  const handleSearch = useCallback(
    (value) => {
      setQuery(value)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      if (value.length < 2) {
        dispatch(clearSearch())
        setOpen(false)
        return
      }
      debounceRef.current = setTimeout(() => {
        dispatch(searchCities(value))
        setOpen(true)
      }, 300)
    },
    [dispatch]
  )

  const handleSelect = (cityName) => {
    dispatch(fetchCityWeather(cityName))
    setQuery("")
    setOpen(false)
    dispatch(clearSearch())
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <Input
          placeholder="Search cities..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => {
            if (searchResults.length > 0) setOpen(true)
          }}
          className="pl-9 pr-9 bg-secondary/50 border-border/50"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("")
              dispatch(clearSearch())
              setOpen(false)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {searchLoading ? (
            <div className="flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
              <Loader2 className="animate-spin" size={14} />
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <ul role="listbox" aria-label="City search results">
              {searchResults.map((result) => (
                <li key={result.id}>
                  <button
                    onClick={() => handleSelect(result.name)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-sm text-left",
                      "hover:bg-accent transition-colors"
                    )}
                  >
                    <MapPin size={14} className="text-muted-foreground shrink-0" />
                    <span>
                      <span className="font-medium">{result.name}</span>
                      {result.region && (
                        <span className="text-muted-foreground">, {result.region}</span>
                      )}
                      <span className="text-muted-foreground"> - {result.country}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No cities found
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
