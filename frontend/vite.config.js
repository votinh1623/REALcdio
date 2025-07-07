import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: true,
		port: 5173,
		allowedHosts: "*",
		proxy: {
			"/api": {
				// target: "http://backend:5000", // Uncomment this line for Docker setup

				target: "http://localhost:5000", // Use the following line for local development without Docker
				changeOrigin: true,
				secure: false,
			},
		},
		// This will disable host check — required for some Ngrok subdomains
		hmr: {
			clientPort: 443, // required for HTTPS tunnels like ngrok
		},
		strictPort: true, // useful to avoid port auto-switching
	},
});
