const jwt = require('jsonwebtoken');
exports.authProtection = async (req, res, next) => {
    const { token } = req.cookies;
    try {
        await jwt.verify(token, process.env.JWT_KEY);
        next();
    } catch (e) {
        res.status(401).send('not authenticated!!');
    }
};
