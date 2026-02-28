import { Providers } from '@/components/providers'
import { Dashboard } from '@/components/weather/dashboard'

export default function App() {
  return (
    <Providers>
      <main className="min-h-screen bg-background">
        <Dashboard />
      </main>
    </Providers>
  )
}
