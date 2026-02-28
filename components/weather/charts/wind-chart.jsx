import { useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { useAppSelector } from "@/lib/store"
import { formatTime } from "@/lib/weather-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function WindChart({ hours }) {
  const unit = useAppSelector((s) => s.weather.unit)

  const data = useMemo(
    () =>
      hours.map((h) => ({
        time: formatTime(h.time),
        wind: unit === "fahrenheit" ? h.wind_mph : h.wind_kph,
        direction: h.wind_dir,
        degree: h.wind_degree,
      })),
    [hours, unit]
  )

  const windUnit = unit === "fahrenheit" ? "mph" : "km/h"

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Wind Speed</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
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
                tickFormatter={(v) => `${v}`}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.2 0 0)",
                  border: "1px solid oklch(0.3 0 0)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "oklch(0.9 0 0)",
                }}
                formatter={(value, name, props) => {
                  const payload = props.payload
                  if (name === "wind") return [`${value} ${windUnit} ${payload.direction}`, "Wind Speed"]
                  return [value, name]
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px" }}
                formatter={() => `Wind (${windUnit})`}
              />
              <Line
                type="monotone"
                dataKey="wind"
                stroke="oklch(0.7 0.15 190)"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  stroke: "oklch(0.7 0.15 190)",
                  strokeWidth: 2,
                  fill: "oklch(0.2 0 0)",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
