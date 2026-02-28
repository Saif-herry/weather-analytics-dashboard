import { ArrowLeft, Heart, RefreshCw, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WeatherIcon } from "./weather-icon"
import { HourlyForecast } from "./hourly-forecast"
import { DailyForecast } from "./daily-forecast"
import { DetailStats } from "./detail-stats"
import { TemperatureChart } from "./charts/temperature-chart"
import { PrecipitationChart } from "./charts/precipitation-chart"
import { WindChart } from "./charts/wind-chart"
import { DailyTemperatureChart } from "./charts/daily-temperature-chart"
import { HistoricalTrends } from "./historical-trends"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setSelectedCity, toggleFavorite, forceRefreshCity } from "@/lib/store/weather-slice"
import { formatTemp, getWeatherGradient } from "@/lib/weather-utils"
import { cn } from "@/lib/utils"

export function CityDetail() {
  const dispatch = useAppDispatch()
  const { cities, selectedCity, unit, favorites, loading } = useAppSelector((s) => s.weather)

  const city = cities.find(
    (c) => c.location.name.toLowerCase() === selectedCity?.toLowerCase()
  )

  if (!city) return null

  const isFavorite = favorites.includes(city.location.name)
  const gradient = getWeatherGradient(city.current.condition.code)
  const todayHours = city.forecast.forecastday[0]?.hour || []

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(setSelectedCity(null))}
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">{city.location.name}</h2>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => dispatch(toggleFavorite(city.location.name))}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                size={16}
                className={cn(isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground")}
              />
            </Button>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {city.location.region ? `${city.location.region}, ` : ""}{city.location.country}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {city.location.localtime}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch(forceRefreshCity(city.location.name))}
          disabled={loading}
          className="gap-1.5"
        >
          <RefreshCw size={14} className={cn(loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Current Weather Hero */}
      <Card className={cn("bg-gradient-to-br overflow-hidden", gradient)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-5">
              <WeatherIcon code={city.current.condition.code} size={64} />
              <div>
                <div className="text-5xl font-bold tracking-tight text-foreground">
                  {formatTemp(city.current.temp_c, city.current.temp_f, unit)}
                </div>
                <p className="text-lg text-muted-foreground mt-1">{city.current.condition.text}</p>
                <p className="text-sm text-muted-foreground">
                  Feels like {formatTemp(city.current.feelslike_c, city.current.feelslike_f, unit)}
                </p>
              </div>
            </div>
            {city.forecast.forecastday[0] && (
              <div className="text-right text-sm text-muted-foreground">
                <p>
                  H: {formatTemp(city.forecast.forecastday[0].day.maxtemp_c, city.forecast.forecastday[0].day.maxtemp_f, unit)}
                  {" / "}
                  L: {formatTemp(city.forecast.forecastday[0].day.mintemp_c, city.forecast.forecastday[0].day.mintemp_f, unit)}
                </p>
                <p className="text-xs mt-1">
                  Last updated: {city.current.last_updated}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detail Stats */}
      <DetailStats current={city.current} />

      {/* Tabs */}
      <Tabs defaultValue="forecast" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">7-Day Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <DailyForecast days={city.forecast.forecastday} />
              </CardContent>
            </Card>
            <DailyTemperatureChart days={city.forecast.forecastday} />
          </div>
        </TabsContent>

        <TabsContent value="hourly" className="mt-4">
          <div className="flex flex-col gap-4">
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Hourly Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <HourlyForecast hours={todayHours} />
              </CardContent>
            </Card>
            <TemperatureChart hours={todayHours} title="Hourly Temperature" />
          </div>
        </TabsContent>

        <TabsContent value="charts" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TemperatureChart hours={todayHours} />
            <PrecipitationChart hours={todayHours} />
            <WindChart hours={todayHours} />
            <DailyTemperatureChart days={city.forecast.forecastday} />
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <HistoricalTrends />
        </TabsContent>
      </Tabs>
    </div>
  )
}
