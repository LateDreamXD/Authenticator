import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
// import fs from '@/utils/fs';
// import path from '@/utils/path';
import * as ini from 'ini-es';
import defaultSettings from '@/others/default_settings.json';

export const useSettingsStore = defineStore('settings', () => {
	const settings = ref(defaultSettings);

	/** @deprecated use `settings.value` instead */
	const getAll = () => settings.value;

	function reset(key?: keyof typeof defaultSettings) {
		// @ts-ignore
		if (key) settings.value[key] = defaultSettings[key];
		else settings.value = defaultSettings;
		save();
	}

	async function init() {
		let rawConfig: string | null;
		if(BUILD_INFO.isClient) {}
		else {
			rawConfig = localStorage.getItem('LateDreamAuth:Settings');
			rawConfig && (settings.value = JSON.parse(rawConfig));
		}
		logger.info('settings initialized');
	}

	async function save() {
		if(BUILD_INFO.isClient) {}
		else localStorage.setItem('LateDreamAuth:Settings', JSON.stringify(settings.value));
	}

	function update(newSettings: typeof defaultSettings) {
		settings.value = newSettings;
		save();
	}

	return {
		settings,
		getAll,
		reset,
		init,
		save,
		update
	};
});
