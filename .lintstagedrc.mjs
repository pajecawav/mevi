export default {
	"*.{vue,js,jsx,ts,tsx,cjs,cts,json,md,yml,css}": "prettier --write",
	"src/**/*.{vue,js,jsx,ts,tsx}": () => "pnpm lint:typecheck",
	"src/**/*.{vue,js,jsx,ts,tsx}": "eslint",
};
