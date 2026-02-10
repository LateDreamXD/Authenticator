import { ref } from 'vue';
import { defineStore } from 'pinia';
import * as otpauth from 'otpauth';
// import fs from '@/utils/fs';
// import os from '@/utils/os';
// import path from '@/utils/path';
import { useSettingsStore } from '@/stores/settings';

export const use2faStore = defineStore('2fa', () => {
	const settings = useSettingsStore();
	const accounts = ref<Record<string, (otpauth.HOTP | otpauth.TOTP)>>({});

	async function init() {
		let uris: string[] = [];
		switch (window.BUILD_INFO.platform) {
			case 'electron-win32':
			case 'electron-linux':
			case 'electron-darwin':
				uris = ElectronAPI?.getOTPAccounts(settings.settings.portable_mode)?.split('\n') || [];
				break;
			case 'niva-win32':
				uris = (await Niva.api.fs.read(
					[(await Niva.api.os.dirs()).data, 'Data', 'otp-accounts.txt'].join(await Niva.api.os.sep())
				))?.split('\n') || [];
				break;
			default:
				uris = localStorage.getItem('LateDreamAuth:Accounts')?.split('\n') || [];
				break;
		}

		uris.forEach((uri: string) => {
			const account = otpauth.URI.parse(uri.trim());
			accounts.value[`${account.issuer}:${account.label}`] = account;
		});

		logger.info('2fa store initialized');
	}

	async function save() {
		if(window.ElectronAPI) {
			await ElectronAPI.saveOTPAccounts(
				Object.keys(accounts.value).map((key) => otpauth.URI.stringify(accounts.value[key]!)).join('\n'),
				settings.settings.portable_mode
			);
			return;
		} else
			localStorage.setItem('LateDreamAuth:Accounts',
				Object.keys(accounts.value).map((key) => otpauth.URI.stringify(accounts.value[key]!)).join('\n')
			);
	}

	return { accounts, init, save };
});
