import { remote, webFrame } from 'electron'

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
})