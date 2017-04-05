import { app, ipcMain } from 'electron'
import main from './main'
import alert from './alert'
import confirm from './confirm'
import auth from './fa-login'
import Scraper from './fa-scraper'

app.on('ready', () => {
	let mainWindow = main()
	let scrapers = { source: null, target: null }

	ipcMain.on('authenticate', (event, arg) => {

		// Login Bypass
		console.log('Creating scraper for '+arg.type)
		let credentials = { a: 'test1', b: 'test2' } // placeholder
		scrapers[arg.type] = new Scraper(credentials)
		scrapers[arg.type].init().then(result => {
			if (arg.type == 'source' && scrapers.target != null && scrapers.target.account.username == result.username || 
				arg.type == 'target' && scrapers.source != null && scrapers.source.account.username == result.username) {
				arg.success = false
				scrapers[arg.type] = null
				alert(mainWindow, 'You must choose two different accounts.').then(() => {
					event.sender.send('authenticate-complete', arg)
				}).catch(err => {
					event.sender.send('authenticate-complete', arg)
				})
			} else {
				arg.success = true
				Object.assign(arg, result)
				event.sender.send('authenticate-complete', arg)
			}
		}).catch(err => {
			arg.success = false
			alert(mainWindow, "There was an error accessing your account. Please switch to the FurAffinity Classic theme and try again.").then(() => {
				event.sender.send('authenticate-complete', arg)
			}).catch(err => {
				event.sender.send('authenticate-complete', arg)
			})
		})

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

	ipcMain.on('logout', (event, arg) => {
		confirm(mainWindow, "Are you sure you want to log out?").then(confirmed => {
			if (confirmed) {
				scrapers[arg.type] = null
				arg.success = true
				event.sender.send('logout-complete', arg)
			} else {
				arg.success = false
				event.sender.send('logout-complete', arg)
			}
		}).catch(err => {
			arg.success = false
			event.sender.send('logout-complete', arg)
		})
	})
})