class FaAccount {
	constructor (credentials) {
		this.credentials = credentials
		this.username = false
		this.avatar = false
		this.stats = {
			uploads: false,
			watches: false,
			favorites: false
		}
	}

	get cookie() {
		return [
			{
				url: 'https://furaffinity.net',
				name: 'a',
				value: this.credentials.a,
				path: '/',
				domain: '.furaffinity.net',
				httpOnly: true
			},
			{
				url: 'https://furaffinity.net',
				name: 'b',
				value: this.credentials.b,
				path: '/',
				domain: '.furaffinity.net',
				httpOnly: true
			}
		]
	}
}

export { FaAccount as default }