
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Playfair Display', 'serif'],
        luxury: ['Montserrat', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        luxury: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        gold: {
          50: '#fffcf0',
          100: '#fff7d6',
          200: '#ffedac',
          300: '#ffe077',
          400: '#ffcf3a',
          500: '#ffb700',
          600: '#e29600',
          700: '#bc7202',
          800: '#985808',
          900: '#7c480b',
          950: '#482600',
        },
        greentrail: {
          50: '#f5f9f5',
          100: '#e6f2e6',
          200: '#cce5cc',
          300: '#a2cfa2',
          400: '#70b570',
          500: '#4a9c4a',
          600: '#3a7e3a',
          700: '#306630',
          800: '#2b522b',
          900: '#254425',
          950: '#0f220f',
        },
        earth: {
          50: '#f9f7f4',
          100: '#f0ebe2',
          200: '#e2d5c4',
          300: '#d3bfa4',
          400: '#c1a47e',
          500: '#b08c63',
          600: '#a47957',
          700: '#8b6548',
          800: '#72533d',
          900: '#5d4534',
          950: '#302219',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #0c0a09 0%, #1c1917 100%)',
        'gold-gradient': 'linear-gradient(135deg, #ffb700 0%, #e29600 100%)',
        'hero-gradient': 'linear-gradient(135deg, rgba(12,10,9,0.8) 0%, rgba(28,25,23,0.6) 100%)',
      },
      backdropBlur: {
        'luxury': '20px',
      },
      boxShadow: {
        'luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'luxury-lg': '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
        'gold': '0 10px 25px -5px rgba(255, 183, 0, 0.2)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-in-scale': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)'
          }
        },
        'luxury-pulse': {
          '0%, 100%': {
            opacity: '0.7'
          },
          '50%': {
            opacity: '1'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.8s ease-out',
        'fade-in-scale': 'fade-in-scale 0.6s ease-out',
        'luxury-pulse': 'luxury-pulse 3s ease-in-out infinite',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
