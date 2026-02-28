import { useAppSelector } from "@/lib/store"
import { formatTemp, formatDayName } from "@/lib/weather-utils"
import { WeatherIcon } from "./weather-icon"
import { Droplets } from "lucide-react"

export function DailyForecast({ days }) {
  const unit = useAppSelector((s) => s.weather.unit)

  return (
    <div className="flex flex-col gap-1">
      {days.map((day, idx) => (
        <div
          key={idx}
          className="flex items-center gap-4 py-2.5 px-3 rounded-lg hover:bg-secondary/40 transition-colors"
        >
          <span className="text-sm font-medium text-foreground w-16 shrink-0">
            {formatDayName(day.date)}
          </span>

          <div className="flex items-center gap-2 w-20 shrink-0">
            <WeatherIcon code={day.day.condition.code} size={18} />
            {day.day.daily_chance_of_rain > 20 && (
              <span className="flex items-center gap-0.5 text-[10px] text-blue-400">
                <Droplets size={10} />
                {day.day.daily_chance_of_rain}%
              </span>
            )}
          </div>

          <div className="flex-1 flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-10 text-right">
              {formatTemp(day.day.mintemp_c, day.day.mintemp_f, unit)}
            </span>
            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden relative">
              <div
                className="absolute inset-y-0 bg-gradient-to-r from-blue-400 to-amber-400 rounded-full"
                style={{
                  left: `${Math.max(0, ((day.day.mintemp_c + 10) / 50) * 100)}%`,
                  right: `${Math.max(0, 100 - ((day.day.maxtemp_c + 10) / 50) * 100)}%`,
                }}
              />
            </div>
            <span className="text-sm font-medium text-foreground w-10">
              {formatTemp(day.day.maxtemp_c, day.day.maxtemp_f, unit)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
