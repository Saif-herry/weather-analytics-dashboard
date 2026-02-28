import { useAppSelector } from "@/lib/store"
import { formatTemp, formatTime } from "@/lib/weather-utils"
import { WeatherIcon } from "./weather-icon"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export function HourlyForecast({ hours }) {
  const unit = useAppSelector((s) => s.weather.unit)

  const currentHour = new Date().getHours()
  const upcomingHours = hours.filter((h) => {
    const hourNum = parseInt(h.time.split(" ")[1].split(":")[0])
    return hourNum >= currentHour
  })
  const displayHours = upcomingHours.length > 0 ? upcomingHours : hours.slice(0, 12)

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-3 pb-3">
        {displayHours.map((hour, idx) => {
          const hourNum = parseInt(hour.time.split(" ")[1].split(":")[0])
          const isNow = hourNum === currentHour
          return (
            <div
              key={idx}
              className="flex flex-col items-center gap-2 rounded-lg border border-border/50 bg-secondary/30 p-3 min-w-[72px]"
            >
              <span className="text-xs text-muted-foreground font-medium">
                {isNow ? "Now" : formatTime(hour.time)}
              </span>
              <WeatherIcon code={hour.condition.code} size={20} />
              <span className="text-sm font-semibold text-foreground">
                {formatTemp(hour.temp_c, hour.temp_f, unit)}
              </span>
              {hour.chance_of_rain > 0 && (
                <span className="text-[10px] text-blue-400">{hour.chance_of_rain}%</span>
              )}
            </div>
          )
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
