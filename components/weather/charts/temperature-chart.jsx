import { useMemo } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { useAppSelector } from "@/lib/store"
import { formatTempValue, formatTime } from "@/lib/weather-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TemperatureChart({ hours, title = "Temperature Trend" }) {
  const unit = useAppSelector((s) => s.weather.unit)

  const data = useMemo(
    () =>
      hours.map((h) => ({
        time: formatTime(h.time),
        temp: formatTempValue(h.temp_c, h.temp_f, unit),
        feelsLike: formatTempValue(h.feelslike_c, h.feelslike_f, unit),
      })),
    [hours, unit]
  )

  const unitLabel = unit === "fahrenheit" ? "°F" : "°C"

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.2 250)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.65 0.2 250)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="feelsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.7 0.15 160)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="oklch(0.7 0.15 160)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}${unitLabel}`}
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
                  `${value}${unitLabel}`,
                  name === "temp" ? "Temperature" : "Feels Like",
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px" }}
                formatter={(value) => (value === "temp" ? "Temperature" : "Feels Like")}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="oklch(0.65 0.2 250)"
                fill="url(#tempGradient)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: "oklch(0.65 0.2 250)", strokeWidth: 2, fill: "oklch(0.2 0 0)" }}
              />
              <Area
                type="monotone"
                dataKey="feelsLike"
                stroke="oklch(0.7 0.15 160)"
                fill="url(#feelsGradient)"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 3, stroke: "oklch(0.7 0.15 160)", strokeWidth: 2, fill: "oklch(0.2 0 0)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
