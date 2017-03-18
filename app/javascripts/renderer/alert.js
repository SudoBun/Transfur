import { ipcRenderer, remote, webFrame } from 'electron'

ipcRenderer.on('alert-data', function (event, data) {
	document.getElementById('alert-message').innerHTML = data.message
})

document.addEventListener('DOMContentLoaded', (event) => {
	webFrame.setVisualZoomLevelLimits(1, 1)
	webFrame.setLayoutZoomLevelLimits(0, 0)

	var closeEl = document.querySelector('.close')
	closeEl.addEventListener('click', function () {
		remote.getCurrentWindow().close()
	})
})