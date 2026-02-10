import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import tailwindcss from '@tailwindcss/vite';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const shared: import('vite').UserConfig = {
		base: './',
		define: {
			BUILD_INFO: `({
				commit: null,
				version: ${JSON.stringify(process.env.npm_package_version)},
				platform: 'web-any',
				date: ${JSON.stringify(new Date().toISOString())},
			})`
		},
		plugins: [
			vue(),
			Components(),
			tailwindcss()
		],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url))
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
		}
	};
	switch (mode) {
		case 'development':
			return {
				...shared,
				plugins: [
					...shared.plugins!,
					vueDevTools(),
				],
			}
		case 'production':
			return shared;
		default:
			throw new Error(`Unknown mode ${mode}`)
	}
});
