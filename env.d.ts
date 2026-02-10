/// <reference types="vite/client" />
/// <reference types="@latedream/niva-types/next" />

declare global {
	interface Window {
		readonly BUILD_INFO: {
			commit: string | null;
			version: string;
			platform: 'web-any' | 'electron-win32' | 'electron-linux' | 'electron-darwin' | 'niva-win32';
			date: string;
		}
		readonly ElectronAPI: {
			pickUpFiles: (options: import('electron').OpenDialogOptions) => Promise<import('electron').OpenDialogReturnValue>;
			exportFile: (options: import('electron').SaveDialogOptions) => Promise<string | null>;
			getConfig: () => string;
			saveConfig: (config: string) => Promise<void>;
			getOTPAccounts: (isPortableMode: boolean) => string;
			saveOTPAccounts: (otpAccounts: string, isPortableMode: boolean) => Promise<void>;
			getPlatform: () => 'electron-win32' | 'electron-linux' | 'electron-darwin';
			openDevTools: () => Promise<void>;
			readFileSync: (path: string, options: import('fs').ReadFileOptions) => string;
		};
	}
	const BUILD_INFO: Window['BUILD_INFO'];
	const ElectronAPI: Window['ElectronAPI'];
}

export {};
