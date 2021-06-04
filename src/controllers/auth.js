const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) return res.status(400).json({ error: 'Email is taken.' });
        await User.create({ name, email, password });
        return res.status(201).json({ message: 'Signup success! Please signin.' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User with this email does not exists, please signup first.' });
        }
        if (!user.authenticate(password)) {
            return res.status(400).json({ error: 'Email and password do not match' });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY, {
            expiresIn: '3d',
        });

        res.cookie('token', token, { expiresIn: '3d' });
        return res.json({ token, user });
    } catch (error) {
        return res.status(500).send('something went wrong!!');
    }
};

exports.signout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.send('successfully signedout!');
    } catch (error) {
        res.status(500);
    }
};
