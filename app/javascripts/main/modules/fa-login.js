import path from 'path'
import fs from 'fs'
import { BrowserWindow, session } from 'electron'

function auth (parentWindow) {
	return new Promise((resolve, reject) => {
		let loginWindow = new BrowserWindow({
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

		let contents = loginWindow.webContents
		let ses = loginWindow.webContents.session
		let credentials = { a: null, b: null}

		ses.clearStorageData([], () => {
			loginWindow.loadURL('https://furaffinity.net/login')
		})

		loginWindow.on('closed', () => {
			loginWindow = null
			reject({complete: false})
		})

		loginWindow.once('ready-to-show', () => {
			let p1 = contents.insertCSS(fs.readFileSync(path.join(__dirname, '..', '..', 'stylesheets', 'fa_login.css'), 'utf8'))
			let p2 = contents.executeJavaScript(fs.readFileSync(path.join(__dirname, 'jquery.min.js'), 'utf8').replace(/(\r\n|\n|\r)/gm,""), true)
			let p3 = contents.executeJavaScript(fs.readFileSync(path.join(__dirname, 'fa_login.js'), 'utf8').replace(/(\r\n|\n|\r)/gm,""), true)

			Promise.all([p1, p2, p3]).then(values => {
				setTimeout(() => {
					loginWindow.show()
				}, 50)
			}).catch(reason => { 
				reject({complete: false})
			})

			contents.once('will-navigate', (event, url) => {
				loginWindow.hide()

				contents.once('did-stop-loading', () => {
					ses.cookies.get({url: 'http://www.furaffinity.net'}, (error, cookies) => {
						for (let { name, value } of cookies) {
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