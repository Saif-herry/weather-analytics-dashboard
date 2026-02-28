import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  CloudSun,
} from "lucide-react"
import { getWeatherIcon } from "@/lib/weather-utils"
import { cn } from "@/lib/utils"

const iconComponents = {
  sun: Sun,
  "cloud-sun": CloudSun,
  cloud: Cloud,
  "cloud-rain": CloudRain,
  "cloud-drizzle": CloudDrizzle,
  snowflake: CloudSnow,
  "cloud-lightning": CloudLightning,
  "cloud-fog": CloudFog,
}

export function WeatherIcon({ code, className, size = 24 }) {
  const iconName = getWeatherIcon(code)
  const Icon = iconComponents[iconName] || Cloud

  const colorClass =
    iconName === "sun"
      ? "text-amber-400"
      : iconName === "cloud-sun"
        ? "text-sky-400"
        : iconName === "cloud-rain" || iconName === "cloud-drizzle"
          ? "text-blue-400"
          : iconName === "snowflake"
            ? "text-cyan-300"
            : iconName === "cloud-lightning"
              ? "text-yellow-400"
              : "text-muted-foreground"

  return <Icon className={cn(colorClass, className)} size={size} />
}
