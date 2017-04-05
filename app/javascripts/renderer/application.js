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
	let authenticated = { source: false, target: false }
	let authEls = document.querySelectorAll('.option-icon')
	authEls.forEach(function(authEl) {
		authEl.addEventListener('click', function (e) {
			console.log(e)
			if (!authenticating) {
				authenticating = true
				if (e.target.classList.contains('icon-empty')) {
					ipcRenderer.send('authenticate', { type: this.getAttribute('type') })
					this.classList.remove('icon-empty')
					this.classList.add('icon-loading')
				} else if (e.target.classList.contains('icon-full')) {
					ipcRenderer.send('logout', { type: this.getAttribute('type') })
					this.classList.remove('icon-full')
					this.classList.add('icon-loading')
				}
			}
		})
	})
	ipcRenderer.on('authenticate-complete', (event, arg) => {
		authenticating = false

		let authEl = document.querySelector('#pane-'+arg.type+' .option-icon')
		authEl.classList.remove('icon-loading')
		if (arg.success) {
			authenticated[arg.type] = true
			authEl.classList.add('icon-full')
		} else {
			authEl.classList.add('icon-empty')
		}
		if (arg.avatar) authEl.style.backgroundImage = `url(${arg.avatar})`
		else authEl.style.backgroundImage = ''

		let authTitleEl = document.querySelector('#pane-'+arg.type+' .option-title')
		if (arg.username) authTitleEl.innerHTML = arg.username
		else authTitleEl.innerHTML = arg.type
		
		if (arg.type == 'source' && arg.stats) {
			let statsEl = document.querySelector('.option-stats')
			let stats = {
				uploads: arg.stats.uploads,
				watches: arg.stats.watches,
				favorites: arg.stats.favorites,
			}
			for (var property in stats) {
				if (stats.hasOwnProperty(property)) {
					let node = document.createElement('p')
					let textnode = document.createTextNode(stats[property]+' '+property)
					node.appendChild(textnode)
					statsEl.appendChild(node)
				}
			}
			$('#pane-source .option-stats').slideDown()
			if (authenticated.target) {
				$('#pane-target .option-stats, #option-transfur').slideDown()
			}
		}
		if (arg.type == 'target' && authenticated.source) {
			$('#pane-target .option-stats, #option-transfur').slideDown()
		}
	})
	ipcRenderer.on('logout-complete', (event, arg) => {
		authenticating = false

		let authEl = document.querySelector('#pane-'+arg.type+' .option-icon')
		authEl.classList.remove('icon-loading')
		if (arg.success) {
			authenticated[arg.type] = false
			let slideUpSelector
			if (arg.type == 'source') {
				if (authenticated.target) $('#pane-target .option-stats, #option-transfur').slideUp()
				slideUpSelector = $('#pane-source .option-stats')
			} else {
				slideUpSelector = $('#pane-target .option-stats, #option-transfur')
			}
			slideUpSelector.slideUp(null, () => {
				authEl.classList.add('icon-empty')
				authEl.style.backgroundImage = ''
				let authTitleEl = document.querySelector('#pane-'+arg.type+' .option-title')
				authTitleEl.innerHTML = arg.type
				
				if (arg.type == 'source') {
					let statsEl = document.querySelector('#pane-source .option-stats')
					statsEl.innerHTML = ''
				}
			})
		} else {
			authEl.classList.add('icon-full')
		}
	})
})