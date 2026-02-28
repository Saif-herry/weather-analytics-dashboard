import { useEffect, useMemo, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts"
import { Loader2, TrendingUp, Calendar, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { fetchCityHistory } from "@/lib/store/weather-slice"
import { formatTempValue } from "@/lib/weather-utils"
import { cn } from "@/lib/utils"

const CITY_COLORS = [
  "oklch(0.65 0.2 250)",
  "oklch(0.7 0.2 30)",
  "oklch(0.65 0.18 160)",
  "oklch(0.7 0.15 310)",
  "oklch(0.65 0.2 80)",
]

const METRICS = [
  { key: "temperature", label: "Temperature", icon: TrendingUp },
  { key: "precipitation", label: "Precipitation", icon: BarChart3 },
  { key: "humidity", label: "Humidity", icon: BarChart3 },
  { key: "wind", label: "Wind", icon: TrendingUp },
]

const DAY_OPTIONS = [
  { value: 3, label: "3 Days" },
  { value: 5, label: "5 Days" },
  { value: 7, label: "7 Days" },
]

export function HistoricalTrends() {
  const dispatch = useAppDispatch()
  const { favorites, historicalData, historyLoading, unit, cities } = useAppSelector(
    (s) => s.weather
  )
  const [selectedCities, setSelectedCities] = useState([])
  const [metric, setMetric] = useState("temperature")
  const [days, setDays] = useState(7)

  // Initialize selectedCities on mount using up to 3 favorites
  useEffect(() => {
    if (selectedCities.length === 0 && favorites.length > 0) {
      setSelectedCities(favorites.slice(0, 3))
    }
  }, [favorites, selectedCities.length])

  // Fetch historical data for selected cities
  useEffect(() => {
    selectedCities.forEach((cityName) => {
      const existing = historicalData[cityName]
      if (!existing || existing.length < days) {
        dispatch(fetchCityHistory({ cityName, days }))
      }
    })
  }, [dispatch, selectedCities, days, historicalData])

  const toggleCity = (city) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    )
  }

  // Build merged data for all selected cities
  const chartData = useMemo(() => {
    const allDates = new Set()
    selectedCities.forEach((city) => {
      historicalData[city]?.forEach((d) => allDates.add(d.date))
    })

    const sortedDates = [...allDates].sort().slice(-days)

    return sortedDates.map((date) => {
      const point = {
        date: new Date(date + "T00:00:00").toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }
      selectedCities.forEach((city) => {
        const dayData = historicalData[city]?.find((d) => d.date === date)
        if (dayData) {
          switch (metric) {
            case "temperature":
              point[`${city}_avg`] = formatTempValue(dayData.avgtemp_c, dayData.avgtemp_f, unit)
              point[`${city}_max`] = formatTempValue(dayData.maxtemp_c, dayData.maxtemp_f, unit)
              point[`${city}_min`] = formatTempValue(dayData.mintemp_c, dayData.mintemp_f, unit)
              break
            case "precipitation":
              point[`${city}_precip`] =
                unit === "fahrenheit" ? dayData.totalprecip_in : dayData.totalprecip_mm
              break
            case "humidity":
              point[`${city}_humidity`] = dayData.avghumidity
              break
            case "wind":
              point[`${city}_wind`] =
                unit === "fahrenheit" ? dayData.maxwind_mph : dayData.maxwind_kph
              break
          }
        }
      })
      return point
    })
  }, [selectedCities, historicalData, metric, unit, days])

  // Available cities: favorites + any loaded cities
  const availableCities = useMemo(() => {
    const names = new Set([...favorites, ...cities.map((c) => c.location.name)])
    return [...names]
  }, [favorites, cities])

  const unitLabel = unit === "fahrenheit" ? "°F" : "°C"
  const precipUnit = unit === "fahrenheit" ? "in" : "mm"
  const windUnit = unit === "fahrenheit" ? "mph" : "km/h"

  return (
    <div className="flex flex-col gap-5">
      {/* Controls */}
      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4">
            {/* City selection */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Compare Cities
              </label>
              <div className="flex flex-wrap gap-2">
                {availableCities.map((city) => (
                  <Button
                    key={city}
                    size="sm"
                    variant={selectedCities.includes(city) ? "default" : "outline"}
                    onClick={() => toggleCity(city)}
                    className={cn(
                      "h-7 text-xs",
                      selectedCities.includes(city) && "shadow-sm"
                    )}
                  >
                    <span
                      className="size-2 rounded-full mr-1.5"
                      style={{
                        backgroundColor: selectedCities.includes(city)
                          ? CITY_COLORS[selectedCities.indexOf(city) % CITY_COLORS.length]
                          : "transparent",
                        border: selectedCities.includes(city) ? "none" : "1px solid currentColor",
                      }}
                    />
                    {city}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Metric selection */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Metric
                </label>
                <div className="flex gap-1.5">
                  {METRICS.map((m) => (
                    <Button
                      key={m.key}
                      size="sm"
                      variant={metric === m.key ? "default" : "outline"}
                      onClick={() => setMetric(m.key)}
                      className="h-7 text-xs gap-1"
                    >
                      <m.icon size={12} />
                      {m.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Day range */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <Calendar size={10} className="inline mr-1" />
                  Period
                </label>
                <div className="flex gap-1.5">
                  {DAY_OPTIONS.map((opt) => (
                    <Button
                      key={opt.value}
                      size="sm"
                      variant={days === opt.value ? "default" : "outline"}
                      onClick={() => setDays(opt.value)}
                      className="h-7 text-xs"
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {historyLoading && (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
          <Loader2 size={16} className="animate-spin" />
          Loading historical data...
        </div>
      )}

      {/* Charts */}
      {selectedCities.length > 0 && chartData.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {/* Main trend chart */}
          {metric === "temperature" && (
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Average Temperature Comparison
                  </CardTitle>
                  <div className="flex gap-1.5">
                    {selectedCities.map((city, idx) => (
                      <Badge
                        key={city}
                        variant="outline"
                        className="text-[10px] gap-1"
                      >
                        <span
                          className="size-1.5 rounded-full"
                          style={{ backgroundColor: CITY_COLORS[idx % CITY_COLORS.length] }}
                        />
                        {city}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        {selectedCities.map((city, idx) => (
                          <linearGradient key={city} id={`hist-grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CITY_COLORS[idx % CITY_COLORS.length]} stopOpacity={0.2} />
                            <stop offset="95%" stopColor={CITY_COLORS[idx % CITY_COLORS.length]} stopOpacity={0} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${v}${unitLabel}`}
                        width={50}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.2 0 0)",
                          border: "1px solid oklch(0.3 0 0)",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "oklch(0.9 0 0)",
                        }}
                        formatter={(value, name) => {
                          const cityName = name.split("_")[0]
                          return [`${value}${unitLabel}`, `${cityName} Avg`]
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: "11px" }}
                        formatter={(value) => value.split("_")[0]}
                      />
                      {selectedCities.map((city, idx) => (
                        <Area
                          key={city}
                          type="monotone"
                          dataKey={`${city}_avg`}
                          stroke={CITY_COLORS[idx % CITY_COLORS.length]}
                          fill={`url(#hist-grad-${idx})`}
                          strokeWidth={2}
                          dot={{ r: 3, fill: CITY_COLORS[idx % CITY_COLORS.length] }}
                          activeDot={{ r: 5, strokeWidth: 2 }}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {metric === "temperature" && (
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  High / Low Temperature Range
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${v}${unitLabel}`}
                        width={50}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.2 0 0)",
                          border: "1px solid oklch(0.3 0 0)",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "oklch(0.9 0 0)",
                        }}
                        formatter={(value, name) => {
                          const parts = name.split("_")
                          const cityName = parts[0]
                          const type = parts[1] === "max" ? "High" : "Low"
                          return [`${value}${unitLabel}`, `${cityName} ${type}`]
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: "11px" }}
                        formatter={(value) => {
                          const parts = value.split("_")
                          return `${parts[0]} ${parts[1] === "max" ? "High" : "Low"}`
                        }}
                      />
                      {selectedCities.map((city, idx) => (
                        <Line
                          key={`${city}_max`}
                          type="monotone"
                          dataKey={`${city}_max`}
                          stroke={CITY_COLORS[idx % CITY_COLORS.length]}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      ))}
                      {selectedCities.map((city, idx) => (
                        <Line
                          key={`${city}_min`}
                          type="monotone"
                          dataKey={`${city}_min`}
                          stroke={CITY_COLORS[idx % CITY_COLORS.length]}
                          strokeWidth={1.5}
                          strokeDasharray="4 4"
                          dot={{ r: 2 }}
                          opacity={0.6}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {metric === "precipitation" && (
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Precipitation Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${v}${precipUnit}`}
                        width={50}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.2 0 0)",
                          border: "1px solid oklch(0.3 0 0)",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "oklch(0.9 0 0)",
                        }}
                        formatter={(value, name) => [
                          `${value} ${precipUnit}`,
                          name.split("_")[0],
                        ]}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: "11px" }}
                        formatter={(value) => value.split("_")[0]}
                      />
                      {selectedCities.map((city, idx) => (
                        <Bar
                          key={city}
                          dataKey={`${city}_precip`}
                          fill={CITY_COLORS[idx % CITY_COLORS.length]}
                          opacity={0.7}
                          radius={[4, 4, 0, 0]}
                          maxBarSize={20}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {metric === "humidity" && (
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Humidity Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        {selectedCities.map((city, idx) => (
                          <linearGradient key={city} id={`hum-grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CITY_COLORS[idx % CITY_COLORS.length]} stopOpacity={0.15} />
                            <stop offset="95%" stopColor={CITY_COLORS[idx % CITY_COLORS.length]} stopOpacity={0} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${v}%`}
                        width={45}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.2 0 0)",
                          border: "1px solid oklch(0.3 0 0)",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "oklch(0.9 0 0)",
                        }}
                        formatter={(value, name) => [
                          `${value}%`,
                          name.split("_")[0],
                        ]}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: "11px" }}
                        formatter={(value) => value.split("_")[0]}
                      />
                      {selectedCities.map((city, idx) => (
                        <Area
                          key={city}
                          type="monotone"
                          dataKey={`${city}_humidity`}
                          stroke={CITY_COLORS[idx % CITY_COLORS.length]}
                          fill={`url(#hum-grad-${idx})`}
                          strokeWidth={2}
                          dot={{ r: 3, fill: CITY_COLORS[idx % CITY_COLORS.length] }}
                          activeDot={{ r: 5 }}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {metric === "wind" && (
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Max Wind Speed Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${v}`}
                        width={40}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.2 0 0)",
                          border: "1px solid oklch(0.3 0 0)",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "oklch(0.9 0 0)",
                        }}
                        formatter={(value, name) => [
                          `${value} ${windUnit}`,
                          name.split("_")[0],
                        ]}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: "11px" }}
                        formatter={(value) => value.split("_")[0]}
                      />
                      {selectedCities.map((city, idx) => (
                        <Line
                          key={city}
                          type="monotone"
                          dataKey={`${city}_wind`}
                          stroke={CITY_COLORS[idx % CITY_COLORS.length]}
                          strokeWidth={2}
                          dot={{ r: 3, fill: CITY_COLORS[idx % CITY_COLORS.length] }}
                          activeDot={{ r: 5, strokeWidth: 2 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {selectedCities.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <TrendingUp size={32} className="text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">Select at least one city to view historical trends.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Choose from your favorites above to compare weather patterns.
          </p>
        </div>
      )}
    </div>
  )
}
