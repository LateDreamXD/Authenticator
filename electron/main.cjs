const { app, dialog, BrowserWindow, ipcMain, Menu } = require('electron');
const fs = require('fs');
const path = require('path');

const paths = {
	config: path.resolve(app.getAppPath(), 'config.ini'),
	data: path.resolve(app.getPath('userData'), 'Data'),
	data_portable: path.resolve(app.getAppPath(), 'Data')
};

try {
	fs.mkdirSync(paths.data, { recursive: true });
	fs.mkdirSync(paths.data_portable, { recursive: true });
} catch {}

const createWindow = () => {
	Menu.setApplicationMenu(null);
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		title: 'LateDream Authenticator',
		show: false,
		icon: path.join(__dirname, '../public/icon.png'),
		webPreferences: {
			devTools: true,
			preload: path.join(__dirname, 'preload.cjs'),
			webSecurity: false,
		},
	});
	win.on('page-title-updated', (e) => e.preventDefault());

	if(process.env.NODE_ENV === 'development')
		win.loadURL('http://localhost:5173');
	else
		win.loadFile(path.join(__dirname, '../dist/index.html'));

	win.openDevTools();
	return win;
}

app.whenReady().then(() => {
	const win = createWindow();
	win.on('ready-to-show', () => win.show());
	ipcMain.handle('open-dev-tools', () => {
		BrowserWindow.getFocusedWindow().webContents.openDevTools();
	});
	ipcMain.on('read-file-sync', (event, path, options) => event.returnValue = fs.readFileSync(path, options));
	ipcMain.handle('pick-up-files', (event, options) => dialog.showOpenDialog(options));
	ipcMain.handle('export-file', (event, options) => dialog.showSaveDialog(options));

	ipcMain.on('get-config', (event) => {
		if(!fs.existsSync(path.join(paths.config))) return event.returnValue = '';
		const config = fs.readFileSync(path.join(paths.config), 'utf-8');
		event.returnValue = config;
	});
	ipcMain.handle('save-config', (event, config) => {
		fs.writeFileSync(paths.config, config);
	});
	ipcMain.on('get-otp-accounts', (event, isPortableMode) => {
		const filepath = path.join(
			isPortableMode? paths.data_portable: paths.data,
			'otp-accounts.txt'
		);
		const otpAccounts = fs.existsSync(filepath)? fs.readFileSync(filepath, 'utf-8'): '';
		event.returnValue = otpAccounts;
	});
	ipcMain.handle('save-otp-accounts', (event, otpAccounts, isPortableMode) => {
		const filepath = path.join(
			isPortableMode? paths.data_portable: paths.data,
			'otp-accounts.txt'
		);
		fs.writeFileSync(filepath, otpAccounts);
	});
});
