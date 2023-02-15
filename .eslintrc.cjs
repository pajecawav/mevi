/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
	env: {
		node: true,
	},
	extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/eslint-config-typescript"],
	parserOptions: {
		ecmaVersion: "latest",
	},
	rules: {
		"vue/multi-word-component-names": "off",
	},
};
