import { CloudSun } from "lucide-react"
import { SearchBar } from "./search-bar"
import { SettingsPanel } from "./settings-panel"
import { useAppSelector } from "@/lib/store"
import { Badge } from "@/components/ui/badge"

export function DashboardHeader() {
  const { unit, loading } = useAppSelector((s) => s.weather)

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10">
          <CloudSun size={20} className="text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Weather Analytics</h1>
          <p className="text-xs text-muted-foreground">Real-time weather data & forecasts</p>
        </div>
        <Badge variant="outline" className="ml-2 text-[10px] uppercase tracking-wider">
          {unit === "celsius" ? "Metric" : "Imperial"}
        </Badge>
        <div className="flex items-center gap-1.5 ml-1">
          <span className={`size-1.5 rounded-full ${loading ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
          <span className="text-[10px] text-muted-foreground">
            {loading ? "Updating" : "Live"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-1 sm:flex-initial sm:max-w-md">
        <SearchBar />
        <SettingsPanel />
      </div>
    </header>
  )
}
