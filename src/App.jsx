import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import WeatherMetrics from './components/WeatherMetrics';
import DailyForecast from './components/DailyForecast';
import HourlyForecast from './components/HourlyForecast';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorState from './components/ErrorState';
import { fetchWeatherData } from './services/weatherApi';

// Default initial location: Berlin, Germany (matches Figma default mockups)
const DEFAULT_LOCATION = {
  name: 'Berlin',
  country: 'Germany',
  latitude: 52.5244,
  longitude: 13.4105,
};

export default function App() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [units, setUnits] = useState({
    temperature: 'celsius',
    windSpeed: 'kmh',
    precipitation: 'mm',
  });
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);

  const loadWeather = useCallback(async () => {
    if (!location) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(location.latitude, location.longitude, units);
      setWeather(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to retrieve weather data');
    } finally {
      setLoading(false);
    }
  }, [location, units]);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-0 flex flex-col selection:bg-brand-blue selection:text-white">
      {/* Top Navbar */}
      <Navbar units={units} setUnits={setUnits} />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex flex-col">
        {/* Hero Section */}
        <section className="text-center pt-2 sm:pt-4 md:pt-6 pb-6 md:pb-8">
          <h1 className="max-w-[731px] mx-auto text-3xl sm:text-4xl md:text-[52px] font-bold font-heading text-neutral-0 tracking-tight leading-tight sm:leading-tight md:leading-[1.15] mb-6 sm:mb-8">
            How's the sky looking today?
          </h1>

          {/* Search Bar */}
          <SearchBar
            onSelectLocation={(loc) => {
              setNoResults(false);
              setLocation(loc);
            }}
            isSearching={loading}
            onNoResults={(empty) => setNoResults(empty)}
          />
        </section>

        {/* Dynamic States: Error / No Results / Loading / Content */}
        {error ? (
          <ErrorState message={error} onRetry={loadWeather} />
        ) : noResults ? (
          <div className="py-16 text-center">
            <p className="text-xl sm:text-2xl font-bold font-heading text-neutral-0">
              No search result found!
            </p>
          </div>
        ) : loading && !weather ? (
          <LoadingSkeleton />
        ) : weather ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-4 sm:mt-6">
            {/* Left Content (Current + Details + Daily) */}
            <div className="lg:col-span-8 flex flex-col">
              <CurrentWeather
                location={location}
                weather={weather}
                units={units}
              />

              <WeatherMetrics
                current={weather.current}
                units={units}
              />

              <DailyForecast
                daily={weather.daily}
              />
            </div>

            {/* Right Content (Hourly Forecast) */}
            <div className="lg:col-span-4 mt-6 lg:mt-0">
              <HourlyForecast
                hourly={weather.hourly}
                daily={weather.daily}
              />
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer / Attribution */}
      <footer className="py-6 text-center text-xs text-neutral-300/70 border-t border-neutral-800/80">
        <p>
          Challenge by{' '}
          <a
            href="https://www.frontendmentor.io?ref=challenge"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-200 hover:text-white underline transition-colors"
          >
            Frontend Mentor
          </a>
          . Coded by{' '}
          <a
            href="https://github.com/Eng-MohamedHosny"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-200 hover:text-white underline transition-colors font-medium"
          >
            Mohamed Hosny
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
