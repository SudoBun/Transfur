import path from 'path'
import Nightmare from 'nightmare'
import Account from './fa-account'
import selectors from './fa-selectors'
require('nightmare-load-filter')(Nightmare)

function nm(cookie = {}, images = false) {
	return Nightmare({
		show: false,
		electronPath: require('electron-prebuilt'),
		webPreferences: {
			images: images
		}
	})
	.goto('about:blank')
	.cookies.set(cookie)
	.filter({}, (details, cb) => {
		if (details.url.includes('www.furaffinity.net') || details.url.includes('facdn.net')) return cb({ cancel: false })
		else return cb({ cancel: true })
	})
}

class FaScraper {
	constructor (credentials) {
		this.account = new Account(credentials)
		this.theme = false
	}

	init() {
		return new Promise((resolve, reject) => {
			nm(this.account.cookie)
				.goto('https://www.furaffinity.net')
				.wait('body')
				.inject('js', path.join(__dirname, 'jquery.min.js'))
				.evaluate(selectors => {
					return new Promise((resolve, reject) => {
						try {
							let theme = STATIC_PATH.replace('/themes/', '')
							let username = $(selectors[theme].username).html().substr(1)
							resolve ({ theme, username })
						} catch(e) {
							reject(e)
						}
					})
				}, selectors)
				.end()
				.then(result => {
					if (!result.theme || result.theme != 'classic') result.theme = 'beta'
					if (!result.username) reject()
					this.theme = result.theme
					this.account.username = result.username
					nm(this.account.cookie)
						.goto('https://www.furaffinity.net/user/'+this.account.username)
						.wait('body')
						.inject('js', path.join(__dirname, 'jquery.min.js'))
						.evaluate(themeSelectors => {
							return new Promise((resolve, reject) => {
								try {
									let avatar = $(themeSelectors.avatar)[0].src
									let stats, uploads, watches, favorites
									if (themeSelectors.theme == 'classic') {
										stats = $(themeSelectors.stats).parent().text().trim().split('\n').filter(function(str) { return /\S/.test(str) })
										uploads = stats[1].trim().split(': ').pop()
										watches = $(themeSelectors.watchesCount).last().text().split('(').pop().slice(0,-1)
										favorites = $(themeSelectors.favoritesCountEstimate).length
									} else {
										stats = $(themeSelectors.stats).text().trim().split('\n').filter(function(str) { return /\S/.test(str) })
										uploads = stats[1].trim().split(' ')[0]
										watches = $(themeSelectors.watchesCount).text()
										favorites = $(themeSelectors.favoritesCountEstimate).length
									}
									if (favorites == 20) favorites = '20+'
									resolve ({ avatar, uploads, watches, favorites })
								} catch(e) {
									reject(e)
								}
							})
						}, selectors[this.theme])
						.end()
						.then(result => {
							console.log('success:', result)
							this.account.avatar = result.avatar
							this.account.stats = {
								uploads: result.uploads,
								watches: result.watches,
								favorites: result.favorites
							}
							resolve({ username:this.account.username, avatar:this.account.avatar, stats:this.account.stats })
						})
						.catch(error => {
							console.log('error:', error)
							reject()
						})
				})
				.catch(error => {
					console.log('error:', error)
					reject()
				})
		})
	}
}

export { FaScraper as default }