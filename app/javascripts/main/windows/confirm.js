import path from 'path'
import url from 'url'
import { BrowserWindow, ipcMain } from 'electron'
import json from '../../package.json'

function init (parentWindow, message) {
	return new Promise((resolve, reject) => {
		let alertWindow = new BrowserWindow({
			title: json.name,
			width: 450,
			height: 200,
			show: false,
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
		
		let confirmed = false

		alertWindow.loadURL(url.format({
			pathname: path.join(__dirname, '..', '..', 'confirm.html'),
			protocol: 'file:',
			slashes: true
		}))

		alertWindow.once('ready-to-show', () => {
			alertWindow.webContents.send('alert-data', {
				message: message
			})

			alertWindow.show()
		})

		ipcMain.on('confirm-response', (event, arg) => {
			if (arg.option == 'continue') confirmed = true
			event.sender.send('confirm-close', arg)
		})

		alertWindow.on('closed', () => {
			alertWindow = null
			resolve(confirmed)
		})
	})
}

export { init as default }