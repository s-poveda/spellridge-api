const AuthService = require('../services/AuthService');

function requireAuth(req, res, next) {
	const authToken = req.get('Authorization') || '';
	let bearerToken = null;
	if (!authToken.toLowerCase().startsWith('bearer ')) {
		return res.status(401).json({ error: 'Missing bearer token' });
	} else {
		bearerToken = authToken.slice(7, authToken.length);
	}
	Promise.all([
		AuthService.verifyJwt(bearerToken),
		AuthService.getPayload(bearerToken),
	])
	.then(([verified, payload]) => {
		req.__JWT_PAYLOAD = payload;
		next();
	})
	.catch( _ => res.status(401).json({ error: 'Unauthorized request' }));
}

module.exports = requireAuth;
