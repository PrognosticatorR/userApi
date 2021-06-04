const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.getAuthUserInfo = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findOne({ email: decodedToken.email });
        req.currentUser = user;
        next();
    } catch (error) {
        res.status(500).send(error.message);
    }
};
