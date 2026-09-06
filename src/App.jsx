import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import WeatherMetrics from './components/WeatherMetrics';
import DailyForecast from './components/DailyForecast';
import HourlyForecast from './components/HourlyForecast';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorState from './components/ErrorState';
import InstallPwaModal from './components/InstallPwaModal';
import { useLanguage } from './context/LanguageContext';
import { fetchWeatherData } from './services/weatherApi';
import {
  getIpLocation,
  getPreciseLocation,
  getSavedLocation,
  DEFAULT_FALLBACK_LOCATION,
} from './services/locationService';

export default function App() {
  const { t } = useLanguage();
  const [location, setLocation] = useState(DEFAULT_FALLBACK_LOCATION);
  const [units, setUnits] = useState({
    temperature: 'celsius',
    windSpeed: 'kmh',
    precipitation: 'mm',
  });
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);

  // Initialize location: saved precise location -> GPS request -> IP fallback
  useEffect(() => {
    let isMounted = true;

    async function initUserLocation() {
      // 1. Check if user already has a saved precise location
      const saved = getSavedLocation();
      if (saved) {
        if (isMounted) setLocation(saved);
        return;
      }

      // 2. Request browser GPS permission for exact city
      try {
        const preciseLoc = await getPreciseLocation();
        if (isMounted && preciseLoc) {
          setLocation(preciseLoc);
          return;
        }
      } catch (err) {
        console.info('GPS not available yet, using IP fallback:', err.message);
      }

      // 3. Fallback to IP address location
      try {
        const ipLoc = await getIpLocation();
        if (isMounted && ipLoc) {
          setLocation(ipLoc);
        }
      } catch (err) {
        console.warn('IP geolocation failed:', err);
      }
    }

    initUserLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUseCurrentLocation = useCallback(async () => {
    try {
      const preciseLoc = await getPreciseLocation();
      setLocation(preciseLoc);
      setNoResults(false);
    } catch (err) {
      console.warn('GPS failed, attempting IP fallback:', err);
      const ipLoc = await getIpLocation();
      setLocation(ipLoc);
      setNoResults(false);
    }
  }, []);

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
      {/* Top unified container: 343px mobile, 720px tablet, 1216px desktop */}
      <div className="w-full max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-0 flex flex-col flex-1">
        {/* Top Navbar */}
        <Navbar units={units} setUnits={setUnits} />

        {/* Main Section */}
        <main className="flex-1 pb-16 flex flex-col">
          {/* Hero Section */}
          <section className="text-center pt-2 md:pt-4 pb-2 md:pb-4">
            <h1 className="max-w-[343px] md:max-w-[482px] lg:max-w-[731px] mx-auto text-[40px] md:text-[52px] font-bold font-heading text-neutral-0 tracking-tight leading-[1.15] md:leading-[1.2] my-8 md:my-12">
              {t('headline')}
            </h1>

            {/* Search Bar */}
            <SearchBar
              onSelectLocation={(loc) => {
                setNoResults(false);
                setLocation(loc);
              }}
              isSearching={loading}
              onNoResults={(empty) => setNoResults(empty)}
              onUseCurrentLocation={handleUseCurrentLocation}
            />
          </section>

          {/* Dynamic States: Error / No Results / Loading / Content */}
          {error ? (
            <ErrorState message={error} onRetry={loadWeather} />
          ) : noResults ? (
            <div className="py-16 text-center">
              <p className="text-xl sm:text-2xl font-bold font-heading text-neutral-0">
                {t('noResults')}
              </p>
            </div>
          ) : loading && !weather ? (
            <LoadingSkeleton />
          ) : weather ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4 sm:mt-6">
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
              <div className="lg:col-span-4 mt-8 lg:mt-0">
                <HourlyForecast
                  hourly={weather.hourly}
                  daily={weather.daily}
                />
              </div>
            </div>
          ) : null}
        </main>
      </div>
      <InstallPwaModal />
    </div>
  );
}
