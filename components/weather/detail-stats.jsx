import {
  Droplets,
  Wind,
  Gauge,
  Eye,
  Thermometer,
  Sun,
  CloudRain,
  Compass,
} from "lucide-react"
import { useAppSelector } from "@/lib/store"
import { formatTemp, formatWind } from "@/lib/weather-utils"

function StatItem({ icon, label, value, subValue }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30">
      <div className="text-muted-foreground shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
        {subValue && <p className="text-[10px] text-muted-foreground">{subValue}</p>}
      </div>
    </div>
  )
}

export function DetailStats({ current }) {
  const unit = useAppSelector((s) => s.weather.unit)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatItem
        icon={<Droplets size={18} className="text-blue-400" />}
        label="Humidity"
        value={`${current.humidity}%`}
        subValue={`Dew point ${formatTemp(current.dewpoint_c, current.dewpoint_f, unit)}`}
      />
      <StatItem
        icon={<Wind size={18} className="text-cyan-400" />}
        label="Wind"
        value={formatWind(current.wind_kph, current.wind_mph, unit)}
        subValue={`Gust ${formatWind(current.gust_kph, current.gust_mph, unit)}`}
      />
      <StatItem
        icon={<Compass size={18} className="text-emerald-400" />}
        label="Wind Direction"
        value={`${current.wind_dir} (${current.wind_degree}°)`}
      />
      <StatItem
        icon={<Gauge size={18} className="text-orange-400" />}
        label="Pressure"
        value={`${current.pressure_mb} mb`}
        subValue={`${current.pressure_in} in`}
      />
      <StatItem
        icon={<Eye size={18} className="text-emerald-400" />}
        label="Visibility"
        value={`${current.vis_km} km`}
        subValue={`${current.vis_miles} miles`}
      />
      <StatItem
        icon={<Thermometer size={18} className="text-red-400" />}
        label="Feels Like"
        value={formatTemp(current.feelslike_c, current.feelslike_f, unit)}
      />
      <StatItem
        icon={<Sun size={18} className="text-amber-400" />}
        label="UV Index"
        value={`${current.uv}`}
        subValue={
          current.uv <= 2 ? "Low" : current.uv <= 5 ? "Moderate" : current.uv <= 7 ? "High" : "Very High"
        }
      />
      <StatItem
        icon={<CloudRain size={18} className="text-blue-400" />}
        label="Precipitation"
        value={`${current.precip_mm} mm`}
        subValue={`${current.precip_in} in`}
      />
    </div>
  )
}
