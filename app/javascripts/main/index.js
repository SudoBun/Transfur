import { app, ipcMain } from 'electron'
import main from './main'
import auth from './fa-login'
import alert from './alert'

app.on('ready', () => {
	let mainWindow = main()
	
	ipcMain.on('authenticate', (event, arg) => {
		auth(mainWindow).then(credentials => {
			console.log(arg, credentials)
		}).catch(err => {
			if (err.complete) alert(mainWindow, "Login failed. Please try again.")
			event.sender.send('authenticate-complete', arg)
		})
	})
})