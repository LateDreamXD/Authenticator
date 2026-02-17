const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ElectronAPI', {
	/**
	 *
	 * @param {import('electron').OpenDialogOptions} options
	 * @returns {Promise<import('electron').OpenDialogReturnValue>}
	 */
	pickUpFiles: (options) => ipcRenderer.invoke('pick-up-files', options),

	/**
	 *
	 * @param {import('electron').SaveDialogOptions} options
	 * @returns {Promise<import('electron').SaveDialogReturnValue>}
	 */
	exportFile: (options) => ipcRenderer.invoke('export-file', options),

	getConfig: () => ipcRenderer.sendSync('get-config'),
	saveConfig: (config) => ipcRenderer.invoke('save-config', config),

	/**
	 *
	 * @param {boolean} isPortableMode
	 * @returns {string} otp uris
	 */
	getOTPAccounts: (isPortableMode) => ipcRenderer.sendSync('get-otp-accounts', isPortableMode),

	saveOTPAccounts: (otpAccounts, isPortableMode) => ipcRenderer.invoke('save-otp-accounts', otpAccounts, isPortableMode),

	getPlatform: () => `electron-${process.platform}`,

	openDevTools: () => ipcRenderer.invoke('open-dev-tools'),

	/**
	 *
	 * @param {string} path
	 * @param {import('fs').ReadFileOptions} options
	 * @returns {string} file content
	 */
	readFileSync: (path, options) => ipcRenderer.sendSync('read-file-sync', path, options),
});
