/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			animation: {
				'sky-pan': 'skyPan 120s linear infinite',
			},
			keyframes: {
				'skyPan': {
					'0%': { backgroundPosition: '0 0' },
					'100%': { backgroundPosition: '1000px 0' },
				},
			},
			colors: {
				darkBg: '#0a0a0a',
				neonGreen: '#39FF14',
				neonPink: '#FF00FF',
				neonBlue: '#00FFFF',
				cyberPurple: '#9D00FF',
			},
			fontFamily: {
				mono: ['Orbitron', 'monospace'], // Cool futuristic font
			},
			blur: {
				'2xl': '40px',
				'3xl': '80px',
			},
		},
	},
	plugins: [],
};
