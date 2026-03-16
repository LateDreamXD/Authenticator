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
		if(BUILD_INFO.isClient) {}
		else {
			uris = localStorage.getItem('LateDreamAuth:Accounts')?.split('\n') || [];
		}

		uris.forEach((uri: string) => {
			const account = otpauth.URI.parse(uri.trim());
			accounts.value[`${account.issuer}:${account.label}`] = account;
		});

		logger.info('2fa store initialized');
	}

	async function save() {
		if(BUILD_INFO.isClient) {}
		else {
			localStorage.setItem('LateDreamAuth:Accounts',
				Object.keys(accounts.value).map(
					(key) => otpauth.URI.stringify(accounts.value[key]!)
				).join('\n')
			);
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
