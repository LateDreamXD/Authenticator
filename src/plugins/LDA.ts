import { createPinia } from 'pinia';
import { watch } from 'vue';
import { useColorMode } from '@vueuse/core';
import router from '@/router';

import { use2faStore } from '@/stores/2fa';
import { useI18nStore } from '@/stores/i18n';
import { useSettingsStore } from '@/stores/settings';

const logger = {
	log: (...args: any[]) => console.log('[LateDreamAuth]', ...args),
	info: (...args: any[]) => console.info('\x1b[34m[LateDreamAuth]\x1b[0m', ...args),
	warn: (...args: any[]) => console.warn('\x1b[33m[LateDreamAuth]\x1b[0m', ...args),
	error: (...args: any[]) => console.error('\x1b[31m[LateDreamAuth]\x1b[0m', ...args)
};

window.logger = logger;

declare global {
	interface Window {
		logger: typeof logger;
	}
	const logger: {
		log: (...args: any[]) => void;
		info: (...args: any[]) => void;
		warn: (...args: any[]) => void;
		error: (...args: any[]) => void;
	};
}

export default {
	install(app: import('vue').App) {
		const pinia = createPinia();
		app.use(pinia).use(router);
		const twoFaStore = use2faStore();
		const i18nStore = useI18nStore();
		const settingsStore = useSettingsStore();
		const { t } = i18nStore;
		app.config.globalProperties.$t = t;

		app.config.globalProperties.$2fa = twoFaStore;
		app.config.globalProperties.$i18n = i18nStore;
		app.config.globalProperties.$settings = settingsStore;

		(async() => {
			twoFaStore.init();
			settingsStore.init();
			if(settingsStore.settings.language && settingsStore.settings.language !== 'system')
				await i18nStore.init(settingsStore.settings.language as string);
			else
				await i18nStore.init(navigator.language);
		})().then(() => {
			app.mount('#app').$nextTick(() => {
				logger.info('app mounted');
			});
			const colorMode = useColorMode();
			watch(settingsStore, (newSettings) => {
				switch (newSettings.settings.appearance.theme) {
					case 'system':
						colorMode.value = 'auto';
						break;
					default:
						colorMode.value = newSettings.settings.appearance.theme as 'dark';
						break;
				}
			});
			watch(() => app.config.globalProperties.$route.name, name => {
				document.title = `${t(`title.${name?.toString()}`, [t(`title.${app.config.globalProperties.$route.params.type?.toString()}`)])} | ${t('title.app')}`;
				document.head.querySelector('meta[name="description"]')?.setAttribute(
					'content', t(`title.${name?.toString()}.description`)
				);
			});
		});
	}
}

declare module 'vue' {
	export interface ComponentCustomProperties {
		$t: (key: string, placeholders?: Record<string, string> | string[]) => string;
		$2fa: ReturnType<typeof use2faStore>;
		$i18n: ReturnType<typeof useI18nStore>;
		$settings: ReturnType<typeof useSettingsStore>;
	}
}
