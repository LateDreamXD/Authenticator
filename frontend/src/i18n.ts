import { createI18n } from 'vue-i18n';

const zhCN = (await import('./locales/zh-CN.json')).default;

export default createI18n({
	legacy: false,
	locale: navigator.language || 'zh-CN',
	availableLocales: ['zh-CN'],
	fallbackLocale: {
		zh: ['zh-CN']
	},
	messages: {
		'zh-CN': zhCN
	}
});
