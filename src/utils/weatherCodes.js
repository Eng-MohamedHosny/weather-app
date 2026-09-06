export function getWeatherInfo(code, lang = 'en') {
  const isAr = lang === 'ar';
  switch (code) {
    case 0:
      return { label: isAr ? 'مشمس' : 'Sunny', icon: '/assets/images/icon-sunny.webp' };
    case 1:
      return { label: isAr ? 'صافٍ غالباً' : 'Mainly Clear', icon: '/assets/images/icon-partly-cloudy.webp' };
    case 2:
      return { label: isAr ? 'غائم جزئياً' : 'Partly Cloudy', icon: '/assets/images/icon-partly-cloudy.webp' };
    case 3:
      return { label: isAr ? 'غائم' : 'Overcast', icon: '/assets/images/icon-overcast.webp' };
    case 45:
    case 48:
      return { label: isAr ? 'ضباب' : 'Fog', icon: '/assets/images/icon-fog.webp' };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return { label: isAr ? 'رذاذ' : 'Drizzle', icon: '/assets/images/icon-drizzle.webp' };
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return { label: isAr ? 'مطر' : 'Rain', icon: '/assets/images/icon-rain.webp' };
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return { label: isAr ? 'ثلج' : 'Snow', icon: '/assets/images/icon-snow.webp' };
    case 95:
    case 96:
    case 99:
      return { label: isAr ? 'عاصفة رعدية' : 'Thunderstorm', icon: '/assets/images/icon-storm.webp' };
    default:
      return { label: isAr ? 'صافٍ' : 'Clear', icon: '/assets/images/icon-sunny.webp' };
  }
}

export function formatDayName(dateString, isShort = true, lang = 'en') {
  const date = new Date(dateString);
  if (lang === 'ar') {
    const daysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return daysAr[date.getDay()];
  }
  return date.toLocaleDateString('en-US', { weekday: isShort ? 'short' : 'long' });
}

export function formatFullDate(dateString, lang = 'en') {
  const date = new Date(dateString);
  if (lang === 'ar') {
    const arabicMonths = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    const daysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const dayName = daysAr[date.getDay()];
    const dayNum = date.getDate();
    const monthName = arabicMonths[date.getMonth()];
    const year = date.getFullYear();
    return `${dayName}، ${dayNum} ${monthName} ${year}`;
  }
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatHour(isoString, lang = 'en') {
  const date = new Date(isoString);
  if (lang === 'ar') {
    let hours = date.getHours();
    const period = hours >= 12 ? 'م' : 'ص';
    hours = hours % 12 || 12;
    return `${hours} ${period}`;
  }
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
  });
}
