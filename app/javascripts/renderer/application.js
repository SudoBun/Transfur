import { remote, webFrame } from 'electron'

document.addEventListener('DOMContentLoaded', (event) => {
	webFrame.setVisualZoomLevelLimits(1, 1)
	webFrame.setLayoutZoomLevelLimits(0, 0)

	var closeEl = document.querySelector('.close')
	closeEl.addEventListener('click', function () {
		remote.getCurrentWindow().close()
	})

	var minimizeEl = document.querySelector('.minimize')
	minimizeEl.addEventListener('click', function () {
		remote.getCurrentWindow().minimize()
	})
})