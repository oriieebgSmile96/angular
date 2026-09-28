// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const prettier = require("eslint-config-prettier");

module.exports = tseslint.config(
	{
		ignores: [".angular/**", "dist/**", "node_modules/**", "src/styles/_tokens.scss"],
	},
	{
		files: ["**/*.ts"],
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.recommended,
			...tseslint.configs.stylistic,
			...angular.configs.tsRecommended,
			prettier,
		],
		processor: angular.processInlineTemplates,
		rules: {
			"@angular-eslint/directive-selector": [
				"error",
				{ type: "attribute", prefix: "bq", style: "camelCase" },
			],
			"@angular-eslint/component-selector": [
				"error",
				{ type: "element", prefix: "bq", style: "kebab-case" },
			],
			"@angular-eslint/prefer-on-push-component-change-detection": "error",
			"@angular-eslint/prefer-standalone": "error",
			"@angular-eslint/prefer-signals": "error",
			"@angular-eslint/no-input-rename": "off",
			"@typescript-eslint/explicit-member-accessibility": [
				"error",
				{ accessibility: "no-public", overrides: { parameterProperties: "off" } },
			],
			"@typescript-eslint/consistent-type-definitions": ["error", "interface"],
			"no-console": ["warn", { allow: ["warn", "error"] }],
		},
	},
	{
		files: ["**/*.html"],
		extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility, prettier],
		rules: {
			"@angular-eslint/template/prefer-control-flow": "error",
			"@angular-eslint/template/prefer-self-closing-tags": "error",
		},
	},
);
