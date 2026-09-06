/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          900: 'hsl(243, 96%, 9%)', // #02012c
          800: 'hsl(243, 27%, 20%)', // #262540
          700: 'hsl(243, 23%, 24%)', // #302f4a
          600: 'hsl(243, 23%, 30%)',
          300: 'hsl(240, 6%, 70%)',  // #acacb7
          200: 'hsl(250, 6%, 84%)',  // #d4d3d9
          100: '#f6f5f1',
          0: '#ffffff',
        },
        brand: {
          orange: 'hsl(28, 100%, 52%)', // #ff820a
          blue: 'hsl(233, 67%, 56%)',   // #4658d9
          blueHover: 'hsl(248, 70%, 36%)', // #2b1b9c
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        heading: ['"Bricolage Grotesque"', 'sans-serif'],
      },
      borderRadius: {
        'card': '20px',
        'subcard': '12px',
        'pill': '9999px',
      },
      boxShadow: {
        'card': '0 8px 24px rgba(0, 0, 0, 0.25)',
        'dropdown': '0 12px 32px rgba(2, 1, 44, 0.45)',
      }
    },
  },
  plugins: [],
};
