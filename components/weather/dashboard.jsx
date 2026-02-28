import { useEffect, useRef } from "react"
import { Loader2, Pin } from "lucide-react"
import { DashboardHeader } from "./dashboard-header"
import { CityCard } from "./city-card"
import { CityDetail } from "./city-detail"
import { HistoricalTrends } from "./historical-trends"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import {
  initializeFromStorage,
  fetchAllFavorites,
  fetchCityWeather,
} from "@/lib/store/weather-slice"
import { Skeleton } from "@/components/ui/skeleton"

function CityCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-3 w-20 mt-1.5" />
        </div>
        <Skeleton className="size-9 rounded-full" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-4 w-32 mt-2" />
        <Skeleton className="h-3 w-28 mt-1" />
      </div>
      <div className="mt-4 flex gap-4">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-14" />
      </div>
    </div>
  )
}

export function Dashboard() {
  const dispatch = useAppDispatch()
  const { cities, favorites, selectedCity, loading, error } = useAppSelector(
    (s) => s.weather
  )
  const initialized = useRef(false)
  const intervalRef = useRef(null)

  // Initialize from localStorage and fetch live data on mount
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      dispatch(initializeFromStorage())
      // Fetch live data for all favorite cities
      dispatch(fetchAllFavorites())
    }
  }, [dispatch])

  // Auto-refresh every 60 seconds (real-time: data should not be older than 60s)
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      favorites.forEach((city) => {
        dispatch(fetchCityWeather(city))
      })
    }, 60_000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [dispatch, favorites])

  // Filter to show favorite cities
  const favoriteCities = cities.filter((c) => favorites.includes(c.location.name))
  const otherCities = cities.filter((c) => !favorites.includes(c.location.name))
  const isInitialLoad = loading && cities.length === 0

  if (selectedCity) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <DashboardHeader />
        <CityDetail />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <DashboardHeader />

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading skeleton on first load */}
      {isInitialLoad ? (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Pin size={14} className="text-primary fill-primary rotate-45" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Pinned Cities
            </h2>
            <Loader2 size={14} className="text-muted-foreground animate-spin" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((name) => (
              <CityCardSkeleton key={name} />
            ))}
          </div>
        </section>
      ) : favoriteCities.length > 0 ? (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Pin size={14} className="text-primary fill-primary rotate-45" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Pinned Cities
            </h2>
            <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
              {favoriteCities.length}
            </span>
            {loading && (
              <Loader2 size={12} className="text-muted-foreground animate-spin ml-1" />
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteCities.map((city) => (
              <CityCard key={city.location.name} city={city} />
            ))}
          </div>
        </section>
      ) : !loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground">No pinned cities yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Search for a city above, then click the heart icon on its card to pin it.
          </p>
        </div>
      ) : null}

      {/* Show non-favorite cities below */}
      {otherCities.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Other Cities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherCities.map((city) => (
              <CityCard key={city.location.name} city={city} />
            ))}
          </div>
        </section>
      )}

      {/* Historical Trends section */}
      {favoriteCities.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Historical Trends
          </h2>
          <HistoricalTrends />
        </section>
      )}
    </div>
  )
}
