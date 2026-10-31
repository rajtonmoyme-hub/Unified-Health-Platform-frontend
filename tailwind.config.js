const withOklchOpacity = (cssVar) => ({ opacityValue }) => {
  if (opacityValue === undefined) {
    return `var(${cssVar})`;
  }
  return `color-mix(in oklch, var(${cssVar}) calc(${opacityValue} * 100%), transparent)`;
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: withOklchOpacity('--border'),
        input: withOklchOpacity('--input'),
        ring: withOklchOpacity('--ring'),
        background: withOklchOpacity('--background'),
        foreground: withOklchOpacity('--foreground'),
        primary: {
          DEFAULT: withOklchOpacity('--primary'),
          foreground: withOklchOpacity('--primary-foreground'),
        },
        secondary: {
          DEFAULT: withOklchOpacity('--secondary'),
          foreground: withOklchOpacity('--secondary-foreground'),
        },
        destructive: {
          DEFAULT: withOklchOpacity('--destructive'),
          foreground: withOklchOpacity('--destructive-foreground'),
        },
        muted: {
          DEFAULT: withOklchOpacity('--muted'),
          foreground: withOklchOpacity('--muted-foreground'),
        },
        accent: {
          DEFAULT: withOklchOpacity('--accent'),
          foreground: withOklchOpacity('--accent-foreground'),
        },
        popover: {
          DEFAULT: withOklchOpacity('--popover'),
          foreground: withOklchOpacity('--popover-foreground'),
        },
        card: {
          DEFAULT: withOklchOpacity('--card'),
          foreground: withOklchOpacity('--card-foreground'),
        },
        'flag-green': {
          DEFAULT: withOklchOpacity('--flag-green'),
          deep: withOklchOpacity('--flag-green-deep'),
        },
        'flag-red': {
          DEFAULT: withOklchOpacity('--flag-red'),
          soft: withOklchOpacity('--flag-red-soft'),
          foreground: withOklchOpacity('--flag-red-foreground'),
        },
        sidebar: {
          DEFAULT: withOklchOpacity('--sidebar'),
          foreground: withOklchOpacity('--sidebar-foreground'),
          primary: withOklchOpacity('--sidebar-primary'),
          'primary-foreground': withOklchOpacity('--sidebar-primary-foreground'),
          accent: withOklchOpacity('--sidebar-accent'),
          'accent-foreground': withOklchOpacity('--sidebar-accent-foreground'),
          border: withOklchOpacity('--sidebar-border'),
          ring: withOklchOpacity('--sidebar-ring'),
        },
        chart: {
          1: withOklchOpacity('--chart-1'),
          2: withOklchOpacity('--chart-2'),
          3: withOklchOpacity('--chart-3'),
          4: withOklchOpacity('--chart-4'),
          5: withOklchOpacity('--chart-5'),
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'sans-serif'],
        serif: ['var(--font-serif)', 'Merriweather', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'Source Code Pro', 'monospace'],
      },
      fontSize: {
        h1: ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '700' }],
        h2: ['1.375rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
        h3: ['1.0625rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '700' }],
        body: ['0.9375rem', { lineHeight: '1.6' }],
        ui: ['0.84375rem', { lineHeight: '1.45' }],
        badge: ['0.75rem', { lineHeight: '1.35', fontWeight: '600' }],
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        '2xs': 'var(--shadow-2xs)',
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
