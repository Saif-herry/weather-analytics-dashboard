import { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { useAppSelector } from "@/lib/store"
import { formatTempValue, formatDayName } from "@/lib/weather-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DailyTemperatureChart({ days }) {
  const unit = useAppSelector((s) => s.weather.unit)

  const data = useMemo(
    () =>
      days.map((d) => ({
        day: formatDayName(d.date),
        high: formatTempValue(d.day.maxtemp_c, d.day.maxtemp_f, unit),
        low: formatTempValue(d.day.mintemp_c, d.day.mintemp_f, unit),
        avg: formatTempValue(d.day.avgtemp_c, d.day.avgtemp_f, unit),
      })),
    [days, unit]
  )

  const unitLabel = unit === "fahrenheit" ? "°F" : "°C"
  const barColors = [
    "oklch(0.65 0.2 250)",
    "oklch(0.6 0.18 230)",
    "oklch(0.55 0.16 210)",
    "oklch(0.6 0.17 220)",
    "oklch(0.65 0.19 240)",
    "oklch(0.6 0.18 235)",
    "oklch(0.55 0.16 225)",
  ]

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">7-Day Temperature Range</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                tickLine={false}
                axisLine={false}
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
                  name === "high" ? "High" : name === "low" ? "Low" : "Average",
                ]}
              />
              <Bar dataKey="high" radius={[4, 4, 0, 0]} maxBarSize={24}>
                {data.map((_, idx) => (
                  <Cell key={idx} fill={barColors[idx % barColors.length]} opacity={0.8} />
                ))}
              </Bar>
              <Bar dataKey="low" fill="oklch(0.5 0.1 220)" opacity={0.4} radius={[4, 4, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
