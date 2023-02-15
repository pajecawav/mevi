import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		outDir: "build/dist",
	},
	clearScreen: false,
	server: {
		proxy: {
			"/media": "http://127.0.0.1:8000",
			"/api": "http://127.0.0.1:8000",
		},
	},

	plugins: [vue()],
});
