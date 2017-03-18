import path from 'path'
import fs from 'fs'
import { app, BrowserWindow, session } from 'electron'
import main from './main'
import alert from './alert'

app.on('ready', () => {
	let mainWindow = main()

	alert(mainWindow, "This is a test!")

	session.defaultSession.cookies.get({url: 'http://www.furaffinity.net'}, (error, cookies) => {
		console.log(error, cookies)
	})

//	let loginWindow = new BrowserWindow({ width: 322, height: 460, show: false, resizable: true, minimizable: false, maximizable: false, fullscreenable: false, title: 'Log In to FurAffinity', webPreferences: { nodeIntegration: false } });
//	loginWindow.loadURL('https://furaffinity.net/login');
//	loginWindow.once('ready-to-show', () => {
//		console.log("READY");
//		loginWindow.webContents.insertCSS(fs.readFileSync(path.join(__dirname, '..', '..', 'stylesheets', 'fa_login.css'), 'utf8'));
//		loginWindow.webContents.executeJavaScript(fs.readFileSync(path.join(__dirname, 'jquery.min.js'), 'utf8').replace(/(\r\n|\n|\r)/gm,""), true);
//		loginWindow.webContents.executeJavaScript(fs.readFileSync(path.join(__dirname, 'fa_login.js'), 'utf8').replace(/(\r\n|\n|\r)/gm,""), true);
//		setTimeout(function (){
//			loginWindow.show();
//		}, 100);
//		
//		loginWindow.webContents.once('will-navigate', (event, url) => {
//			console.log("LINK CLICKED");
//			loginWindow.hide();
//			
//			loginWindow.webContents.once('did-get-response-details', (event, status, newURL, originalURL, httpResponseCode, requestMethod, referrer, headers) => {
//				console.log("RESPONDED");
//				console.log(headers);
//				console.log(newURL);
//				session.defaultSession.cookies.get({url: 'http://www.furaffinity.net'}, (error, cookies) => {
//					console.log(error, cookies)
//				})
//			});
//		});
//	});

})