import { app, ipcMain } from 'electron'
import main from './main'
import alert from './alert'
import auth from './fa-login'
import account from './fa-account'

app.on('ready', () => {
	let mainWindow = main()
	let accounts = { source: null, target: null }

	ipcMain.on('authenticate', (event, arg) => {
		auth(mainWindow).then(credentials => {
			console.log(arg, credentials)
			arg.success = true
			accounts[arg.type] = new Account(credentials)
			console.log(accounts)
			event.sender.send('authenticate-complete', arg)
		}).catch(err => {
			arg.success = false
			if (err.complete) {
				alert(mainWindow, "Login failed. Please try again.").then(() => {
					event.sender.send('authenticate-complete', arg)
				}).catch(err => {
					event.sender.send('authenticate-complete', arg)
				})
			} else {
				event.sender.send('authenticate-complete', arg)
			}
		})
	})
})