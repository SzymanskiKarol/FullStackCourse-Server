const { verify } = require('jsonwebtoken')

const validateToken = (req, res, next) => {
    // odbiera token z headerów
    const accessToken = req.header('accessToken');

    if (!accessToken) return res.json({ error: 'User not logged' })

    try {
        const validToken = verify(accessToken, 'secret');
        req.user = validToken
        if (validToken) {
            return next();
        }
    } catch (err) {
        return res.json({ error: err })
    }
}

module.exports = { validateToken }