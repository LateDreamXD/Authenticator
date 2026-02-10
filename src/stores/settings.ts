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
		switch (window.BUILD_INFO.platform) {
			case 'electron-win32':
			case 'electron-linux':
			case 'electron-darwin':
				rawConfig = ElectronAPI.getConfig();
				rawConfig && (settings.value = ini.parse(rawConfig));
				break;
			case 'niva-win32':
				rawConfig = await Niva.api.fs.read(
					[(await Niva.api.process.currentDir()), 'config.ini'].join(await Niva.api.os.sep())
				);
				rawConfig && (settings.value = ini.parse(rawConfig));
				break;
			default:
				rawConfig = localStorage.getItem('LateDreamAuth:Settings');
				rawConfig && (settings.value = JSON.parse(rawConfig));
				break;
		}
		logger.info('settings initialized');
	}

	function save() {
		if(window.ElectronAPI)
			window.ElectronAPI.saveConfig(ini.stringify(settings.value));
		else
			localStorage.setItem('LateDreamAuth:Settings', JSON.stringify(settings.value));
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
