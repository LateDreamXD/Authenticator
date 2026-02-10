import { ref } from 'vue';
import { defineStore } from 'pinia';
import * as otpauth from 'otpauth';
// import fs from '@/utils/fs';
// import os from '@/utils/os';
// import path from '@/utils/path';
import { useSettingsStore } from '@/stores/settings';

export type TOTP = {
	issuer: string;
	label: string;
	/** @default true */
	issuerInLabel?: boolean;
	secret: string | import('otpauth').Secret;
	/** @default 'SHA1' */
	algorithm?: string;
	/** @default 6 */
	digits?: number;
	/** @default 30 */
	period?: number;
	hmac?: ((algorithm: string, key: Uint8Array, message: Uint8Array) => Uint8Array);
}

export type HOTP = {
	issuer: string;
	label: string;
	/** @default true */
	issuerInLabel?: boolean;
	secret: string | import('otpauth').Secret;
	/** @default 'SHA1' */
	algorithm?: string;
	/** @default 6 */
	digits?: number;
	/** @default 0 */
	counter?: number;
	hmac?: ((algorithm: string, key: Uint8Array, message: Uint8Array) => Uint8Array);
}

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
		switch (window.BUILD_INFO.platform) {
			case 'electron-win32':
			case 'electron-linux':
			case 'electron-darwin':
				await ElectronAPI.saveOTPAccounts(
					Object.keys(accounts.value).map((key) => otpauth.URI.stringify(accounts.value[key]!)).join('\n'),
					settings.settings.portable_mode
				);
				break;
			case 'niva-win32':
				await Niva.api.fs.write(
					[(await Niva.api.os.dirs()).data, 'Data', 'otp-accounts.txt'].join(await Niva.api.os.sep()),
					Object.keys(accounts.value).map((key) => otpauth.URI.stringify(accounts.value[key]!)).join('\n')
				);
				break;
			default:
				localStorage.setItem('LateDreamAuth:Accounts',
					Object.keys(accounts.value).map((key) => otpauth.URI.stringify(accounts.value[key]!)).join('\n')
				);
				break;
		}
	}

	function add(acc: string | TOTP | HOTP, type?: 'TOTP' | 'HOTP') {
		let account: otpauth.HOTP | otpauth.TOTP;
		if (typeof acc === 'string')
			account = otpauth.URI.parse(acc);
		else {
			if (!type) throw new Error('type is required when `acc` is not a string');
			account = new otpauth[type](acc);
		}
		accounts.value[`${account.issuer}:${account.label}`] = account;
		save();
	}

	function remove(name: string) {
		delete accounts.value[name];
		save();
	}

	return { accounts, init, save, add, remove };
});
