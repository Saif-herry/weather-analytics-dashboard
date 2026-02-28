import { Settings, Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setUnit } from "@/lib/store/weather-slice"
import { cn } from "@/lib/utils"

export function SettingsPanel() {
  const dispatch = useAppDispatch()
  const unit = useAppSelector((s) => s.weather.unit)
  const { theme, setTheme } = useTheme()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Customize your weather dashboard experience.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {/* Temperature Unit */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-foreground">Temperature Unit</label>
            <div className="flex gap-2">
              <Button
                variant={unit === "celsius" ? "default" : "outline"}
                size="sm"
                onClick={() => dispatch(setUnit("celsius"))}
                className={cn("flex-1")}
              >
                Celsius
              </Button>
              <Button
                variant={unit === "fahrenheit" ? "default" : "outline"}
                size="sm"
                onClick={() => dispatch(setUnit("fahrenheit"))}
                className={cn("flex-1")}
              >
                Fahrenheit
              </Button>
            </div>
          </div>

          {/* Theme */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-foreground">Theme</label>
            <div className="flex gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
                className="flex-1 gap-1.5"
              >
                <Sun size={14} />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
                className="flex-1 gap-1.5"
              >
                <Moon size={14} />
                Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("system")}
                className="flex-1 gap-1.5"
              >
                <Monitor size={14} />
                System
              </Button>
            </div>
          </div>

          {/* API Info */}
          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Data refreshes automatically every 60 seconds to keep current conditions up to date.
            </p>
            <p className="text-xs text-muted-foreground">
              Connected directly to WeatherAPI.com from the browser.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
