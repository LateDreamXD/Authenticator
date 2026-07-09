import { resolve } from 'node:path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

const cwd = process.cwd();

// https://vite.dev/config/
export default defineConfig({
	clearScreen: false, // prevent vite from clearing rust log
	base: './',
	define: {
		__VERSION__: JSON.stringify(process.env.npm_package_version)
	},
	plugins: [
		vue(),
		VueI18nPlugin({
			include: resolve(cwd, 'src/locales/**')
		}),
		tailwindcss()
	],
	resolve: {
		alias: {
			'@': resolve(cwd, './src'),
			'@go': resolve(cwd, './wailsjs/go'),
			'@runtime': resolve(cwd, './wailsjs/runtime')
		},
	},
	build: {
		rolldownOptions: {
			output: {
				codeSplitting: {
					groups: [
						{
							name: 'stores-bundle',
							test: /stores\/.*\.ts$/,
						},
						{
							name: 'vue-bundle',
							test: /node_modules\/vue|vue-router|pinia\/*/
						},
						{
							name: 'libs-bundle',
							test: /node_modules\/otpauth|ini-es\/*/
						}
					]
				}
			}
		}
	},
});
