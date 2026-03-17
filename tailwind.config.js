/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Red accent colors (replaced pink)
        pink: {
          DEFAULT: "#E53935",
          dark: "#B71C1C",
          light: "#FF5252",
          muted: "#FF8A80",
        },
        red: {
          DEFAULT: "#E53935",
          dark: "#B71C1C",
          light: "#FF5252",
          muted: "#FF8A80",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Proficiency level colors
        proficiency: {
          high: "#4CAF50",
          medium: "#FF9800",
          low: "#9E9E9E",
        },
      },
      fontFamily: {
        display: ['Montserrat', 'Kanit', 'sans-serif'],
        body: ['Open Sans', 'Noto Sans Thai', 'sans-serif'],
        thai: ['Noto Sans Thai', 'Kanit', 'sans-serif'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        pink: "0 0 40px rgba(229, 57, 53, 0.4)",
        "pink-lg": "0 0 60px rgba(229, 57, 53, 0.6)",
        red: "0 0 40px rgba(229, 57, 53, 0.4)",
        "red-lg": "0 0 60px rgba(229, 57, 53, 0.6)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "pulse-pink": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "pulse-red": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "breathe": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "flip-in": {
          from: { 
            opacity: "0",
            transform: "rotateX(90deg) translateY(-100px)"
          },
          to: { 
            opacity: "1",
            transform: "rotateX(0) translateY(0)"
          },
        },
        "slide-up": {
          from: { 
            opacity: "0",
            transform: "translateY(60px)"
          },
          to: { 
            opacity: "1",
            transform: "translateY(0)"
          },
        },
        "grid-line-draw": {
          from: { strokeDashoffset: "100%" },
          to: { strokeDashoffset: "0%" },
        },
        "glow-red": {
          "0%, 100%": { boxShadow: "0 0 5px #E53935, 0 0 10px #E53935" },
          "50%": { boxShadow: "0 0 20px #E53935, 0 0 30px #E53935" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "pulse-pink": "pulse-pink 4s ease-in-out infinite",
        "pulse-red": "pulse-red 4s ease-in-out infinite",
        "breathe": "breathe 10s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "flip-in": "flip-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up": "slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "grid-line-draw": "grid-line-draw 1s ease-out forwards",
        "glow-red": "glow-red 2s ease-in-out infinite",
      },
      transitionTimingFunction: {
        "custom-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "elastic-snap": "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
