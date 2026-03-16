import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useI18nStore = defineStore('i18n', () => {
	const language = ref('');
	const translations = ref<Record<string, string>>({});

	const translation = (key: string) => translations.value[key];

	async function fetchTranslations() {
		const url = new URL(location.href);
		url.pathname += `locales/${language.value}.json`;
		const res = await fetch(url);
		if(res.status === 404) {
			logger.warn(`locale file of "${language.value}" does not exist, will use "zh-CN"`);
			return setLanguage('zh-CN');
		}
		const data = await res.json();
		translations.value = data;
	}

	async function setLanguage(lang: string) {
		language.value = lang;
		await fetchTranslations();
	}

	async function init(lang: string) {
		language.value = lang;
		document.documentElement.setAttribute('lang', lang);
		await fetchTranslations();
		logger.info('i18n initialized');
	}

	function t(key: string, placeholders?: Record<string, string> | string[]) {
		let result = translation(key) || key;
		if(placeholders) {
			if(Array.isArray(placeholders))
				placeholders.forEach((p, i) => {
					result = result.replace(new RegExp(`\%${i}`, 'g'), p);
				});
			else
				Object.keys(placeholders).forEach(k => {
					result = result.replace(new RegExp(`\%${k}\%`, 'g'), placeholders[k]!);
				});
		}
		return result;
	}

	return {
		language,
		translations,
		setLanguage,
		init,
		t
	};
});
