export function formatTemp(tempC, tempF, unit) {
  if (unit === 'fahrenheit') return `${Math.round(tempF)}°F`
  return `${Math.round(tempC)}°C`
}

export function formatTempValue(tempC, tempF, unit) {
  return unit === 'fahrenheit' ? Math.round(tempF) : Math.round(tempC)
}

export function formatWind(kph, mph, unit) {
  if (unit === 'fahrenheit') return `${Math.round(mph)} mph`
  return `${Math.round(kph)} km/h`
}

export function getWeatherIcon(code) {
  const iconMap = {
    1000: 'sun',
    1003: 'cloud-sun',
    1006: 'cloud',
    1009: 'cloud',
    1030: 'cloud-fog',
    1063: 'cloud-rain',
    1066: 'snowflake',
    1069: 'cloud-rain',
    1072: 'cloud-drizzle',
    1087: 'cloud-lightning',
    1114: 'snowflake',
    1117: 'snowflake',
    1135: 'cloud-fog',
    1147: 'cloud-fog',
    1150: 'cloud-drizzle',
    1153: 'cloud-drizzle',
    1168: 'cloud-drizzle',
    1171: 'cloud-drizzle',
    1180: 'cloud-rain',
    1183: 'cloud-rain',
    1186: 'cloud-rain',
    1189: 'cloud-rain',
    1192: 'cloud-rain',
    1195: 'cloud-rain',
    1198: 'cloud-rain',
    1201: 'cloud-rain',
    1204: 'cloud-rain',
    1207: 'cloud-rain',
    1210: 'snowflake',
    1213: 'snowflake',
    1216: 'snowflake',
    1219: 'snowflake',
    1222: 'snowflake',
    1225: 'snowflake',
    1237: 'snowflake',
    1240: 'cloud-rain',
    1243: 'cloud-rain',
    1246: 'cloud-rain',
    1249: 'cloud-rain',
    1252: 'cloud-rain',
    1255: 'snowflake',
    1258: 'snowflake',
    1261: 'snowflake',
    1264: 'snowflake',
    1273: 'cloud-lightning',
    1276: 'cloud-lightning',
    1279: 'cloud-lightning',
    1282: 'cloud-lightning',
  }

  return iconMap[code] || 'cloud'
}

export function getWeatherGradient(code) {
  if (code === 1000) return 'from-amber-400/10 to-orange-400/5'
  if (code === 1003) return 'from-sky-400/10 to-blue-300/5'
  if (code >= 1006 && code <= 1009) return 'from-slate-400/10 to-gray-300/5'
  if (code >= 1063 && code <= 1201) return 'from-blue-400/10 to-indigo-300/5'
  if (code >= 1210 && code <= 1264) return 'from-cyan-400/10 to-blue-200/5'
  if (code >= 1273) return 'from-yellow-400/10 to-amber-300/5'
  return 'from-sky-400/10 to-blue-300/5'
}

export function formatTime(timeStr) {
  const date = new Date(timeStr.replace(' ', 'T'))
  return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
}

export function formatDayName(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}
