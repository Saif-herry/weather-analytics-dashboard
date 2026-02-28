import { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts"
import { formatTime } from "@/lib/weather-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PrecipitationChart({ hours }) {
  const data = useMemo(
    () =>
      hours.map((h) => ({
        time: formatTime(h.time),
        precip: h.precip_mm,
        chanceOfRain: h.chance_of_rain,
        humidity: h.humidity,
      })),
    [hours]
  )

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Precipitation & Humidity</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                yAxisId="precip"
                tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}mm`}
                width={45}
              />
              <YAxis
                yAxisId="percent"
                orientation="right"
                tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
                width={40}
                domain={[0, 100]}
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
                  if (name === "precip") return [`${value} mm`, "Precipitation"]
                  if (name === "chanceOfRain") return [`${value}%`, "Rain Chance"]
                  return [`${value}%`, "Humidity"]
                }}
              />
              <Bar
                yAxisId="precip"
                dataKey="precip"
                fill="oklch(0.6 0.18 250)"
                opacity={0.6}
                radius={[2, 2, 0, 0]}
                maxBarSize={16}
              />
              <Line
                yAxisId="percent"
                type="monotone"
                dataKey="chanceOfRain"
                stroke="oklch(0.65 0.2 220)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
              />
              <Line
                yAxisId="percent"
                type="monotone"
                dataKey="humidity"
                stroke="oklch(0.7 0.12 170)"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
