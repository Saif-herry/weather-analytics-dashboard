# 🌦️ Weather Analytics Dashboard

A modern, scalable, and interactive **Weather Analytics Dashboard** built using **React, Redux Toolkit, and Vite**.

The application provides real-time weather insights, forecast analytics, historical comparisons, and rich data visualizations for multiple cities.

---

## 📌 Project Overview

This project demonstrates strong understanding of:

- API Integration  
- Centralized State Management  
- Data Visualization  
- UI/UX Design Principles  
- Performance Optimization  
- Responsive Design  

---

## 🚀 Features

### 📊 Dashboard Overview

- Displays weather summary cards for multiple cities  
- Shows:
  - Current Temperature  
  - Weather Condition Icon  
  - Humidity  
  - Wind Speed  
- Quick visual comparison between cities  
- Favorite cities pinned on dashboard  

---

### 🔍 Detailed Weather Analytics

When a user selects a city:

- 5–7 Day Forecast  
- Hour-by-Hour Forecast  
- Extended Metrics:
  - Pressure  
  - UV Index  
  - Wind Direction  
  - Feels Like Temperature  

---

### 📈 Interactive Data Visualization

Built using **Recharts**:

- Temperature Trends (Hourly & Daily)  
- Precipitation Patterns  
- Wind Speed Trends  
- Interactive Tooltips  
- Fully Responsive Charts  

---

### 📅 Historical Weather Comparison (Implemented)

- Compare past weather trends  
- Analyze temperature changes over time  
- Visual chart-based comparison  
- Long-term weather pattern insights  

---

### 🌙 Dark / Light Theme Toggle (Implemented)

- User-controlled theme switching  
- Smooth UI transitions  
- Improved accessibility  
- Modern UI experience  

---

### 🔎 Search & Favorites

- Search cities using Weather API  
- Add / Remove cities from favorites  
- Favorites persist using Local Storage  
- Quick access to important locations  

---

### 🌡 Temperature Unit Toggle

- Switch between:
  - Celsius (°C)  
  - Fahrenheit (°F)  
- Managed globally using Redux Toolkit  

---

## 🛠️ Technical Stack

| Technology        | Purpose                     |
|------------------|----------------------------|
| React (Hooks)    | UI Development              |
| Redux Toolkit    | Global State Management     |
| WeatherAPI       | Real-Time Weather Data      |
| Recharts         | Data Visualization          |
| Tailwind / CSS   | Styling                     |
| Local Storage    | Persistence                 |
| Vite             | Build Tool                  |

---

## 🌐 API Integration

Weather data is fetched from:

**WeatherAPI**  
https://www.weatherapi.com/

The application handles:

- Asynchronous API calls  
- Error handling  
- Loading states  
- Secure API key management via environment variables  

---

## 📂 Project Structure
weather-analytics-dashboard/
├── app/
│ └── globals.css
├── components/
│ ├── providers.jsx
│ ├── theme-provider.jsx
│ ├── ui/
│ │ ├── badge.jsx
│ │ ├── button.jsx
│ │ ├── card.jsx
│ │ ├── dialog.jsx
│ │ ├── input.jsx
│ │ ├── scroll-area.jsx
│ │ ├── skeleton.jsx
│ │ └── tabs.jsx
│ └── weather/
│ ├── charts/
│ │ ├── daily-temperature-chart.jsx
│ │ ├── precipitation-chart.jsx
│ │ ├── temperature-chart.jsx
│ │ └── wind-chart.jsx
│ ├── city-card.jsx
│ ├── city-detail.jsx
│ ├── daily-forecast.jsx
│ ├── dashboard-header.jsx
│ ├── dashboard.jsx
│ ├── detail-stats.jsx
│ ├── historical-trends.jsx
│ ├── hourly-forecast.jsx
│ ├── search-bar.jsx
│ ├── settings-panel.jsx
│ └── weather-icon.jsx
├── lib/
│ ├── store/
│ │ ├── index.js
│ │ └── weather-slice.js
│ ├── utils.js
│ └── weather-utils.js
├── public/
├── src/
│ ├── App.jsx
│ └── main.jsx
├── styles/
│ └── globals.css
├── .env.example
├── package.json
├── vite.config.js


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/weather-analytics-dashboard.git

### 2️⃣ Navigate to Project Folder
cd weather-analytics-dashboard
### 3️⃣ Install Dependencies
npm install
### 4️⃣ Setup Environment Variables

Create a .env file in the root directory:

VITE_WEATHER_API_KEY=your_api_key_here
### 5️⃣ Run the Application
npm run dev

## Application runs on:

http://localhost:5173
📱 Responsive Design

Fully responsive layout

## Optimized for:

Desktop

Tablet

Mobile devices

## 🧠 Architectural Highlights

Clean component-based architecture

Centralized state management with Redux Toolkit

Reusable and modular chart components

Scalable folder structure

Proper separation of concerns (UI / Logic / API Layer)

## 🔮 Future Enhancements

Google Authentication

API caching & rate limit optimization

Auto refresh every 60 seconds

Weather alerts system

Export analytics reports

## 👨‍💻 Author

Mohammad Saif
Frontend Developer
