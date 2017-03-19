import path from 'path'
import fs from 'fs'
import { BrowserWindow, session } from 'electron'

function auth (parentWindow) {
	return new Promise((resolve, reject) => {
		const loginWindow = new BrowserWindow({
			width: 322,
			height: 497,
			show: false,
			resizable: true,
			minimizable: false,
			maximizable: false,
			fullscreenable: false,
			alwaysOnTop: true,
			parent: parentWindow,
			modal: true,
			title: 'Log In to FurAffinity',
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				partition: 'fa_login'
			}
		})

		const contents = loginWindow.webContents
		const ses = loginWindow.webContents.session
		let credentials = {}

		ses.clearStorageData([], () => {
			loginWindow.loadURL('https://furaffinity.net/login')
		})

		loginWindow.on('closed', () => {
			loginWindow.destroy()
			reject({complete: false})
		})

		loginWindow.once('ready-to-show', () => {
			contents.insertCSS(fs.readFileSync(path.join(__dirname, '..', '..', 'stylesheets', 'fa_login.css'), 'utf8'))
			contents.executeJavaScript(fs.readFileSync(path.join(__dirname, 'jquery.min.js'), 'utf8').replace(/(\r\n|\n|\r)/gm,""), true)
			contents.executeJavaScript(fs.readFileSync(path.join(__dirname, 'fa_login.js'), 'utf8').replace(/(\r\n|\n|\r)/gm,""), true)

			setTimeout(function (){
				loginWindow.show()
			}, 100)

			contents.once('will-navigate', (event, url) => {
				loginWindow.hide()

				contents.once('did-stop-loading', () => {
					ses.cookies.get({url: 'http://www.furaffinity.net'}, (error, cookies) => {
						for (let { name, value } of cookies) {
							console.log(name, value);
							if (name == 'a') credentials.a = value
							else if (name == 'b') credentials.b = value
						}

						if (credentials.a && credentials.b) {
							resolve(credentials)
						} else {
							reject({complete: true})
						}

						loginWindow.destroy()
					})
				})
			})
		})
	})
}

export { auth as default }