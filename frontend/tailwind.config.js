/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A7C59', // Xanh lá mạ non
          dark: '#2F4F3A',    // Xanh tre già / rêu phong
          light: '#6B9D7A',
          subtle: '#EAF2EC',
        },
        secondary: {
          DEFAULT: '#D9A441', // Vàng rơm / Lúa chín
          dark: '#B58328',
          light: '#ECC576',
          subtle: '#FAF4E6',
        },
        accent: {
          DEFAULT: '#8B5E3C', // Nâu đất phù sa / Gốm mộc
          dark: '#6B4426',
          light: '#AC7B56',
          subtle: '#F5ECE6',
        },
        paper: {
          DEFAULT: '#FBF6EC', // Nền kem giấy dó
          dark: '#F3EAD9',
          light: '#FDFAF4',
        },
        surface: {
          DEFAULT: '#FFFDF7', // Màu ngà ngọc thanh nhã
        },
        ink: {
          DEFAULT: '#2B2118', // Nâu than đậm
          muted: '#6B5E51',   // Nâu vừa
          light: '#9C8F80',   // Nâu nhạt
        },
        warmBorder: '#E6DAC7', // Viền gốm / viền giấy dó
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
        serif: ['"Be Vietnam Pro"', 'serif'],
      },
      boxShadow: {
        warm: '0 4px 20px -2px rgba(74, 124, 89, 0.08), 0 2px 6px -1px rgba(139, 94, 60, 0.06)',
        warmHover: '0 10px 25px -3px rgba(74, 124, 89, 0.12), 0 4px 10px -2px rgba(139, 94, 60, 0.1)',
        warmCard: '0 2px 10px rgba(43, 33, 24, 0.04)',
      },
      borderRadius: {
        soft: '14px',
        card: '16px',
      },
    },
  },
  plugins: [],
}
