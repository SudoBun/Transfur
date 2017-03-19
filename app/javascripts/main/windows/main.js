import path from 'path'
import url from 'url'
import { BrowserWindow } from 'electron'
import json from '../../package.json'

function init () {
	const mainWindow = new BrowserWindow({
		title: json.name,
		width: json.settings.width,
		height: json.settings.height,
		minWidth: 371,
		minHeight: 300,
		transparent: true,
		frame: false
	})

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, '..', '..', 'index.html'),
		protocol: 'file:',
		slashes: true
	}))

	mainWindow.webContents.on('did-finish-load', () => {
		mainWindow.webContents.send('loaded', {
			appName: json.name,
			electronVersion: process.versions.electron,
			nodeVersion: process.versions.node,
			chromiumVersion: process.versions.chrome
		})
	})

	mainWindow.on('closed', () => {
		mainWindow.destroy()
	})

	return mainWindow
}

export { init as default }