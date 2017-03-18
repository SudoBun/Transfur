import { ipcRenderer, remote, webFrame } from 'electron'

ipcRenderer.on('alert-data', (event, data) => {
	document.getElementById('alert-message').innerHTML = data.message
})

document.addEventListener('DOMContentLoaded', (event) => {
	webFrame.setVisualZoomLevelLimits(1, 1)
	webFrame.setLayoutZoomLevelLimits(0, 0)

	let closeEl = document.querySelector('.close')
	closeEl.addEventListener('click', () => {
		remote.getCurrentWindow().close()
	})
})