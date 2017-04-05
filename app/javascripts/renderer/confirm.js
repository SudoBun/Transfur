import { ipcRenderer, remote, webFrame } from 'electron'

ipcRenderer.on('alert-data', (event, data) => {
	document.getElementById('alert-message').innerHTML = data.message
})

ipcRenderer.on('confirm-close', (event, data) => {
	remote.getCurrentWindow().close()
})

document.addEventListener('DOMContentLoaded', (event) => {
	webFrame.setVisualZoomLevelLimits(1, 1)
	webFrame.setLayoutZoomLevelLimits(0, 0)

	let cancelEl = document.querySelector('.cancel')
	cancelEl.addEventListener('click', () => {
		ipcRenderer.send('confirm-response', { option: 'cancel' })
	})
	let continueEl = document.querySelector('.continue')
	continueEl.addEventListener('click', () => {
		ipcRenderer.send('confirm-response', { option: 'continue' })
	})
})