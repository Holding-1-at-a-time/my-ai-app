// Import the required modules
import tailwindcssAnimate from 'tailwindcss-animate';
import type { Config } from 'tailwindcss';

// Define the Tailwind CSS configuration
export default {
	// Specify the content files to scan for utility classes
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],

	// Define the theme configuration
	theme: {
		// Extend the default theme configuration
		extend: {
			// Define custom 
			textColor: {
				white: '#ffffff',
			},
			colors: {
				// Primary color
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					dark: 'hsl(var(--primary-dark))',
					background: 'hsl(var(--background))',
					card: {
						DEFAULT: 'hsl(var(--card))',
						foreground: 'hsl(var(--card-foreground))',
					},
					popover: {
						DEFAULT: 'hsl(var(--popover))',
						foreground: 'hsl(var(--popover-foreground))',
					},
					primaryDark: {
						DEFAULT: 'hsl(var(--primary))',
						foreground: 'hsl(var(--primary-foreground))',
					},
					secondary: {
						DEFAULT: 'hsl(var(--secondary))',
						foreground: 'hsl(var(--secondary-foreground))',
					},
					muted: {
						DEFAULT: 'hsl(var(--muted))',
						foreground: 'hsl(var(--muted-foreground))',
					},
					accent: {
						DEFAULT: 'hsl(var(--accent))',
						foreground: 'hsl(var(--accent-foreground))',
					},
					destructive: {
						DEFAULT: 'hsl(var(--destructive))',
						foreground: 'hsl(var(--destructive-foreground))',
					},
					border: 'hsl(var(--border))',
					input: 'hsl(var(--input))',
					ring: 'hsl(var(--ring))',
					chart: {
						1: 'hsl(var(--chart-1))',
						2: 'hsl(var(--chart-2))',
						3: 'hsl(var(--chart-3))',
						4: 'hsl(var(--chart-4))',
						5: 'hsl(var(--chart-5))',
					},
					sidebar: {
						DEFAULT: 'hsl(var(--sidebar-background))',
						foreground: 'hsl(var(--sidebar-foreground))',
						primary: 'hsl(var(--sidebar-primary))',
						'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
						accent: 'hsl(var(--sidebar-accent))',
						'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
						border: 'hsl(var(--sidebar-border))',
						ring: 'hsl(var(--sidebar-ring))',
					},
				},

				// Border radius
				borderRadius: {
					lg: 'var(--radius)',
					md: 'calc(var(--radius) - 2px)',
					sm: 'calc(var(--radius) - 4px)',
				},

				// Background image
				backgroundImage: {
					'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
					'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				},

				// Animation
				animation: {
					pulse: 'pulse 1s infinite',
					'pulse-slow': 'pulse 2s infinite',
					'pulse-fast': 'pulse 0.5s infinite',
					'pulse-reverse': 'pulse 1s infinite reverse',
					'pulse-slow-reverse': 'pulse 2s infinite reverse',
					'pulse-fast-reverse': 'pulse 0.5s infinite reverse',
					'pulse-smooth': 'pulse 1s ease-in-out infinite',
					'pulse-reverse-smooth': 'pulse 1s ease-in-out infinite reverse',
				},

				// Animation duration
				animationDuration: {
					DEFAULT: '0.5s',
					fast: '0.2s',
					slow: '1s',
					smooth: '0.5s ease-in-out',
				},

				// Animation timing function
				animationTimingFunction: {
					DEFAULT: 'ease-in-out',
					fast: 'ease-in',
					slow: 'ease-out',
					smooth: 'ease-in-out',
				},

				// Transform origin
				transformOrigin: {
					top: 'top',
					bottom: 'bottom',
					left: 'left',
					right: 'right',
					topLeft: 'top left',
					topRight: 'top right',
					bottomLeft: 'bottom left',
					bottomRight: 'bottom right',
				},

				// Animation effect
				animationEffect: {
					fillMode: 'auto',
					fill: 'forwards',
					ease: 'ease',
				},
			},
		},
	},

	// Add the animate plugin to the configuration
	plugins: [tailwindcssAnimate],
} satisfies Config;