import Nightmare from 'nightmare'
import Account from './fa-account'

class FaScraper {
	constructor (credentials) {
		this.account = new Account(credentials)
		this.nightmare = Nightmare({
			show: true,
			electronPath: require('electron-prebuilt')
		})
			
		this.nightmare.goto('https://furaffinity.net')
			.wait('body')
			.evaluate(function() {
				return STATIC_PATH
			})
			.end()
			.then(function (result) {
				console.log(result)
			})
			.catch(function (error) {
				console.error('Scrape failed:', error)
			})

//		this.nightmare.goto('https://duckduckgo.com')
//			.type('#search_form_input_homepage', 'github nightmare')
//			.click('#search_button_homepage')
//			.wait('#zero_click_wrapper .c-info__title a')
//			.evaluate(function () {
//				return document.querySelector('#zero_click_wrapper .c-info__title a').href
//			})
//			.end()
//			.then(function (result) {
//				console.log(result)
//			})
//			.catch(function (error) {
//				console.error('Search failed:', error)
//			})
	}
}

export { FaScraper as default }