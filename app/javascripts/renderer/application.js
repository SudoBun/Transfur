import { ipcRenderer, remote, webFrame } from 'electron'

document.addEventListener('DOMContentLoaded', (event) => {
	webFrame.setVisualZoomLevelLimits(1, 1)
	webFrame.setLayoutZoomLevelLimits(0, 0)

	let closeEl = document.querySelector('.close')
	closeEl.addEventListener('click', () => {
		remote.getCurrentWindow().close()
	})

	let minimizeEl = document.querySelector('.minimize')
	minimizeEl.addEventListener('click', () => {
		remote.getCurrentWindow().minimize()
	})

	let authenticating = false
	let authEl = document.querySelector('.icon-empty')
	authEl.addEventListener('click', function () {
		if (!authenticating) {
			authenticating = true
			ipcRenderer.send('authenticate', this.getAttribute('type'))
			this.classList.remove('icon-empty')
			this.className += ' icon-loading'
		}
	})
	ipcRenderer.on('authenticate-complete', (event, arg) => {
		authenticating = false
		let authEl = document.querySelector('.option-icon[type='+arg+']')
		authEl.classList.remove('icon-loading')
		authEl.className += ' icon-empty'
	})
})