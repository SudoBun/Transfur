import { app, ipcMain } from 'electron'
import main from './main'
import alert from './alert'
import auth from './fa-login'
import Scraper from './fa-scraper'

app.on('ready', () => {
	let mainWindow = main()
	let scrapers = { source: null, target: null }

	ipcMain.on('authenticate', (event, arg) => {

		// Login Bypass
		console.log('Creating scraper for '+arg.type)
		let credentials = {a:'test1', b:'test2'}
		scrapers[arg.type] = new Scraper(credentials)
		event.sender.send('authenticate-complete', arg)

//		auth(mainWindow).then(credentials => {
//			arg.success = true
//			scrapers[arg.type] = new Scraper(credentials)
//			event.sender.send('authenticate-complete', arg)
//		}).catch(err => {
//			arg.success = false
//			if (err.complete) {
//				alert(mainWindow, "Login failed. Please try again.").then(() => {
//					event.sender.send('authenticate-complete', arg)
//				}).catch(err => {
//					event.sender.send('authenticate-complete', arg)
//				})
//			} else {
//				event.sender.send('authenticate-complete', arg)
//			}
//		})
	})
})