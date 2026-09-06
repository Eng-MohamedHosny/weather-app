# Frontend Mentor - Weather App Solution

This is a pixel-perfect solution to the [Weather App challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/weather-app-K1FhddVm49). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

---

## 🚀 Live Demo & Links

- **Live Site URL:** [https://weather-app-kappa-puce-36.vercel.app](https://weather-app-kappa-puce-36.vercel.app)
- **GitHub Repository:** [https://github.com/Eng-MohamedHosny/weather-app](https://github.com/Eng-MohamedHosny/weather-app)
- **Frontend Mentor Challenge:** [Build a Weather App](https://www.frontendmentor.io/challenges/weather-app-K1FhddVm49)

---

## 📸 Preview

![Solution Preview](./preview.jpg)

---

## ✨ Features & Highlights

- 🎯 **Pixel-Perfect Execution:** Built directly from the official Figma design files with exact color tokens, typography scales, box shadows, and spacing.
- 📱 **Multi-Device Responsiveness:** Fully responsive layouts across Mobile (`375px`), Tablet (`768px`), and Desktop (`1440px`).
- 🔍 **Live Location Search:** Debounced autocomplete search utilizing the Open-Meteo Geocoding API.
- 🌤️ **Real-Time Weather Conditions:** Temperature, weather condition graphics, location name, and localized formatted date.
- 📊 **Comprehensive Weather Metrics:** Current Feels Like temperature, Humidity percentage, Wind Speed, and Precipitation.
- 📅 **7-Day Daily Forecast:** Overview cards showing daily condition icons and high/low temperature ranges.
- ⏰ **Hourly Forecast with Day Selector:** Interactive day dropdown allowing users to inspect the 24-hour weather curve for any day of the week.
- 🔄 **Metric & Imperial System Toggle:** Seamless switching between Celsius (°C) / Fahrenheit (°F), km/h / mph, and millimeters (mm) / inches (in).
- ⚡ **Interactive States:** Loading skeletons with pulse animations, search in-progress indicators, "no results found" feedback, and API error states with retry functionality.

---

## 🛠️ Built With

- **[React 18](https://react.dev/)** - UI Component Architecture
- **[Vite](https://vitejs.dev/)** - Fast Build Tool & Development Server
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS Framework configured with Figma tokens
- **[Open-Meteo API](https://open-meteo.com/)** - Free weather forecasting & geocoding data without rate limits
- **[Google Fonts](https://fonts.google.com/)** - *DM Sans* & *Bricolage Grotesque*

---

## 💡 What I Learned

Integrating external real-time data while preserving strict fidelity to a professional design system requires clean separation of concerns:
- Custom hook-like state handling for debounced geocoding search queries.
- Modular unit switching logic that recalculates units without causing unwanted layout shifts.
- Responsive CSS Grid and Flexbox orchestration to switch seamlessly between desktop 2-column view and mobile stacked card view.

---

## 👤 Author

- Frontend Mentor - [@Eng-MohamedHosny](https://www.frontendmentor.io/profile/Eng-MohamedHosny)
- GitHub - [@Eng-MohamedHosny](https://github.com/Eng-MohamedHosny)
