export function getWeatherInfo(code) {
  switch (code) {
    case 0:
      return { label: 'Sunny', icon: '/assets/images/icon-sunny.webp' };
    case 1:
      return { label: 'Mainly Clear', icon: '/assets/images/icon-partly-cloudy.webp' };
    case 2:
      return { label: 'Partly Cloudy', icon: '/assets/images/icon-partly-cloudy.webp' };
    case 3:
      return { label: 'Overcast', icon: '/assets/images/icon-overcast.webp' };
    case 45:
    case 48:
      return { label: 'Fog', icon: '/assets/images/icon-fog.webp' };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return { label: 'Drizzle', icon: '/assets/images/icon-drizzle.webp' };
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return { label: 'Rain', icon: '/assets/images/icon-rain.webp' };
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return { label: 'Snow', icon: '/assets/images/icon-snow.webp' };
    case 95:
    case 96:
    case 99:
      return { label: 'Thunderstorm', icon: '/assets/images/icon-storm.webp' };
    default:
      return { label: 'Clear', icon: '/assets/images/icon-sunny.webp' };
  }
}

export function formatDayName(dateString, isShort = true) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: isShort ? 'short' : 'long' });
}

export function formatFullDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatHour(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
  });
}
