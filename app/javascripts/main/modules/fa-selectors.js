export default {
	classic: {
		theme: 'classic',
		username: '#my-username',
		avatar: 'img.avatar',
		stats: '[title="Once per user per 24 hours"]',
		favoritesCountEstimate: '.userpage-favorites figure',
		watchesCount: 'td[align="left"] .maintable .cat',
	},
	beta: {
		theme: 'beta',
		username: '#my-username > *',
		avatar: 'img.avatar',
		stats: '.user-profile-stats',
		favoritesCountEstimate: '#user-gallery figure',
		watchesCount: '.userpage-section-left .section-footer span',
	}
}