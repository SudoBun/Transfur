import path from 'path'
import url from 'url'
import { BrowserWindow } from 'electron'
import json from '../../package.json'

function init (parentWindow, message) {
	const alertWindow = new BrowserWindow({
		title: json.name,
		width: 450,
		height: 200,
		transparent: true,
		frame: false,
		resizable: false,
		minimizable: false,
		maximizable: false,
		fullscreenable: false,
		alwaysOnTop: true,
		parent: parentWindow,
		modal: true
	})

	alertWindow.loadURL(url.format({
		pathname: path.join(__dirname, '..', '..', 'alert.html'),
		protocol: 'file:',
		slashes: true
	}))

	alertWindow.webContents.on('did-finish-load', () => {
		alertWindow.webContents.send('alert-data', {
			message: message
		})
	})

	alertWindow.on('closed', () => {
		alertWindow.destroy()
	})

	return alertWindow
}

export { init as default }