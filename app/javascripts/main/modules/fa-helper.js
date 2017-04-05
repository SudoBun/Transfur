export default {
	none: {
		__noSuchMethod__(id, args) {
			return new Promise((resolve, reject) => {
				reject()
			})
		}
	},
	classic: {
		
	},
	beta: {
		
	}
}