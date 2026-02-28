import { Heart, Wind, Droplets, Eye, Pin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WeatherIcon } from "./weather-icon"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setSelectedCity, toggleFavorite } from "@/lib/store/weather-slice"
import { formatTemp, formatWind, getWeatherGradient } from "@/lib/weather-utils"
import { cn } from "@/lib/utils"

export function CityCard({ city }) {
  const dispatch = useAppDispatch()
  const { unit, favorites } = useAppSelector((s) => s.weather)
  const isFavorite = favorites.includes(city.location.name)
  const gradient = getWeatherGradient(city.current.condition.code)

  return (
    <Card
      className={cn(
        "cursor-pointer group relative overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5",
        "bg-gradient-to-br",
        gradient
      )}
      onClick={() => dispatch(setSelectedCity(city.location.name))}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-foreground">{city.location.name}</h3>
              {isFavorite && (
                <Pin size={12} className="text-primary fill-primary rotate-45" />
              )}
              <Button
                variant="ghost"
                size="icon-sm"
                className={cn(
                  "transition-opacity",
                  isFavorite ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  dispatch(toggleFavorite(city.location.name))
                }}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart
                  size={14}
                  className={cn(
                    isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                  )}
                />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {city.location.country}
            </p>
          </div>
          <WeatherIcon code={city.current.condition.code} size={36} className="opacity-80" />
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold tracking-tight text-foreground">
              {formatTemp(city.current.temp_c, city.current.temp_f, unit)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{city.current.condition.text}</p>
          <p className="text-xs text-muted-foreground">
            Feels like {formatTemp(city.current.feelslike_c, city.current.feelslike_f, unit)}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Droplets size={12} className="text-blue-400" />
            {city.current.humidity}%
          </span>
          <span className="flex items-center gap-1.5">
            <Wind size={12} className="text-cyan-400" />
            {formatWind(city.current.wind_kph, city.current.wind_mph, unit)}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye size={12} className="text-emerald-400" />
            {city.current.vis_km} km
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
