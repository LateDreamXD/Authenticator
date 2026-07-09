import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import defaultSettings from '@/others/default_settings.json';

export const useSettingsStore = defineStore('settings', () => {
	const settings = ref(defaultSettings);
	settings.value = JSON.parse(String(localStorage.getItem('LateDreamAuth:Settings'))) || defaultSettings;

	function reset(key?: keyof typeof defaultSettings) {
		// @ts-ignore
		if (key) settings.value[key] = defaultSettings[key];
		else settings.value = defaultSettings;
		save();
	}

	async function save() {
		localStorage.setItem('LateDreamAuth:Settings', JSON.stringify(settings.value));
	}

	function update(newSettings: typeof defaultSettings) {
		settings.value = newSettings;
		useI18n().locale.value = settings.value.language;
		save();
	}

	return {
		settings,
		reset,
		save,
		update
	};
});
