import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = 'https://api.weatherapi.com/v1'
const CACHE_DURATION = 60_000

function loadFavorites() {
  if (typeof window === 'undefined') return ['London', 'New York', 'Tokyo']
  try {
    const stored = localStorage.getItem('weather-favorites')
    return stored ? JSON.parse(stored) : ['London', 'New York', 'Tokyo']
  } catch {
    return ['London', 'New York', 'Tokyo']
  }
}

function saveFavorites(favorites) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('weather-favorites', JSON.stringify(favorites))
  } catch {
    // ignore
  }
}

function loadUnit() {
  if (typeof window === 'undefined') return 'celsius'
  try {
    const stored = localStorage.getItem('weather-unit')
    return stored === 'fahrenheit' ? 'fahrenheit' : 'celsius'
  } catch {
    return 'celsius'
  }
}

function saveUnit(unit) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('weather-unit', unit)
  } catch {
    // ignore
  }
}

async function fetchWeatherApi(path, params) {
  const isMissingKey = !API_KEY || API_KEY.trim() === ''
  const isPlaceholderKey = API_KEY?.includes('PASTE_YOUR_WEATHERAPI_KEY_HERE')

  if (isMissingKey || isPlaceholderKey) {
    throw new Error('Set a valid VITE_WEATHER_API_KEY in .env and restart the dev server.')
  }

  const query = new URLSearchParams({ key: API_KEY, ...params })
  const res = await fetch(`${BASE_URL}/${path}?${query.toString()}`)
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error('WeatherAPI rejected the key. Check VITE_WEATHER_API_KEY in .env.')
    }
    throw new Error(data?.error?.message || 'Weather API request failed')
  }

  return data
}

export const fetchCityWeather = createAsyncThunk(
  'weather/fetchCity',
  async (cityName, { getState, rejectWithValue }) => {
    const state = getState().weather
    const lastUpdate = state.lastUpdated[cityName]
    const existing = state.cities.find(
      (c) => c.location.name.toLowerCase() === cityName.toLowerCase()
    )

    if (existing && lastUpdate && Date.now() - lastUpdate < CACHE_DURATION) {
      return existing
    }

    try {
      return await fetchWeatherApi('forecast.json', {
        q: cityName,
        days: '7',
        aqi: 'no',
        alerts: 'no',
      })
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Network error')
    }
  }
)

export const searchCities = createAsyncThunk(
  'weather/search',
  async (query, { rejectWithValue }) => {
    if (!query || query.length < 2) return []

    try {
      const data = await fetchWeatherApi('search.json', { q: query })
      return data.map((item, index) => ({ ...item, id: item.id || `${item.name}-${item.region}-${index}` }))
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Search failed')
    }
  }
)

export const fetchAllFavorites = createAsyncThunk(
  'weather/fetchAllFavorites',
  async (_, { getState, dispatch }) => {
    const favorites = getState().weather.favorites
    const results = await Promise.allSettled(
      favorites.map((city) => dispatch(fetchCityWeather(city)).unwrap())
    )

    return results.filter((r) => r.status === 'fulfilled').map((r) => r.value)
  }
)

export const forceRefreshCity = createAsyncThunk(
  'weather/forceRefresh',
  async (cityName, { rejectWithValue }) => {
    try {
      return await fetchWeatherApi('forecast.json', {
        q: cityName,
        days: '7',
        aqi: 'no',
        alerts: 'no',
      })
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Network error')
    }
  }
)

export const fetchCityHistory = createAsyncThunk(
  'weather/fetchCityHistory',
  async ({ cityName, days }, { rejectWithValue }) => {
    try {
      const dates = []
      for (let i = 1; i <= days; i++) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        dates.push(d.toISOString().split('T')[0])
      }

      const results = await Promise.allSettled(
        dates.map(async (dt) => {
          const data = await fetchWeatherApi('history.json', {
            q: cityName,
            dt,
          })

          const day = data.forecast?.forecastday?.[0]
          if (!day) throw new Error('No historical day data')

          return {
            date: day.date,
            cityName,
            avgtemp_c: day.day.avgtemp_c,
            avgtemp_f: day.day.avgtemp_f,
            maxtemp_c: day.day.maxtemp_c,
            maxtemp_f: day.day.maxtemp_f,
            mintemp_c: day.day.mintemp_c,
            mintemp_f: day.day.mintemp_f,
            avghumidity: day.day.avghumidity,
            totalprecip_mm: day.day.totalprecip_mm,
            totalprecip_in: day.day.totalprecip_in,
            maxwind_kph: day.day.maxwind_kph,
            maxwind_mph: day.day.maxwind_mph,
            avgvis_km: day.day.avgvis_km,
            uv: day.day.uv,
            condition: day.day.condition,
          }
        })
      )

      const successData = results
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value)
        .sort((a, b) => a.date.localeCompare(b.date))

      return { cityName, data: successData }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch history')
    }
  }
)

const initialState = {
  cities: [],
  favorites: ['London', 'New York', 'Tokyo'],
  selectedCity: null,
  unit: 'celsius',
  loading: false,
  error: null,
  searchResults: [],
  searchLoading: false,
  lastUpdated: {},
  historicalData: {},
  historyLoading: false,
}

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setSelectedCity(state, action) {
      state.selectedCity = action.payload
    },
    toggleFavorite(state, action) {
      const city = action.payload
      if (state.favorites.includes(city)) {
        state.favorites = state.favorites.filter((f) => f !== city)
      } else {
        state.favorites.push(city)
      }
      saveFavorites(state.favorites)
    },
    setUnit(state, action) {
      state.unit = action.payload
      saveUnit(action.payload)
    },
    clearSearch(state) {
      state.searchResults = []
    },
    initializeFromStorage(state) {
      state.favorites = loadFavorites()
      state.unit = loadUnit()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCityWeather.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCityWeather.fulfilled, (state, action) => {
        state.loading = false
        const cityName = action.payload.location.name
        const existingIdx = state.cities.findIndex(
          (c) => c.location.name.toLowerCase() === cityName.toLowerCase()
        )

        if (existingIdx >= 0) {
          state.cities[existingIdx] = action.payload
        } else {
          state.cities.push(action.payload)
        }

        state.lastUpdated[cityName] = Date.now()
      })
      .addCase(fetchCityWeather.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message || 'Failed to fetch weather data'
      })
      .addCase(searchCities.pending, (state) => {
        state.searchLoading = true
      })
      .addCase(searchCities.fulfilled, (state, action) => {
        state.searchLoading = false
        state.searchResults = action.payload
      })
      .addCase(searchCities.rejected, (state) => {
        state.searchLoading = false
        state.searchResults = []
      })
      .addCase(fetchAllFavorites.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllFavorites.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(fetchAllFavorites.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch favorites'
      })
      .addCase(forceRefreshCity.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(forceRefreshCity.fulfilled, (state, action) => {
        state.loading = false
        const cityName = action.payload.location.name
        const existingIdx = state.cities.findIndex(
          (c) => c.location.name.toLowerCase() === cityName.toLowerCase()
        )

        if (existingIdx >= 0) {
          state.cities[existingIdx] = action.payload
        } else {
          state.cities.push(action.payload)
        }

        state.lastUpdated[cityName] = Date.now()
      })
      .addCase(forceRefreshCity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to refresh weather data'
      })
      .addCase(fetchCityHistory.pending, (state) => {
        state.historyLoading = true
      })
      .addCase(fetchCityHistory.fulfilled, (state, action) => {
        state.historyLoading = false
        state.historicalData[action.payload.cityName] = action.payload.data
      })
      .addCase(fetchCityHistory.rejected, (state, action) => {
        state.historyLoading = false
        state.error = action.payload || 'Failed to fetch historical data'
      })
  },
})

export const {
  setSelectedCity,
  toggleFavorite,
  setUnit,
  clearSearch,
  initializeFromStorage,
} = weatherSlice.actions

export default weatherSlice.reducer
