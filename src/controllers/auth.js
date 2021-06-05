const User = require('../models/user');
const jwt = require('jsonwebtoken');
const formidable = require('formidable');
const validator = require('validator');
const { uploader } = require('../helpers/uploadFile');
const fs = require('fs');

exports.signup = async (req, res) => {
    try {
        const form = formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Image could not upload',
                });
            }
            const { name, email, password } = fields;
            if (!validator.isLength(name, { min: 1, max: 32 }))
                return res.status(400).json({ error: 'name must be less then 32 chars' });
            if (!validator.isEmail(email)) return res.status(400).json({ error: 'invalid/null email address!' });
            if (!validator.isLength(password, { min: 8 }))
                return res.status(400).json({ error: 'password must be greater then 8 chars' });
            const file = files.image;
            if (file && file.type !== 'image/jpeg') return res.status(400).json({ error: 'only images are allowed' });
            let user = await User.findOne({ email: email.toLowerCase() });
            if (user) return res.status(400).json({ error: 'Email is taken.' });
            if (file && file.size > 1500000) {
                return res.status(400).json({
                    error: 'Image should not be bigger then 1.5 mb.',
                });
            }
            if (file) {
                const data = fs.readFileSync(file.path);
                await uploader(data)
                    .then(async resData => {
                        await User.create({ name, email, password, profile_pic: resData.Location });
                        return res.status(201).json({ message: 'signup success! please signin.' });
                    })
                    .catch(err => console.log(err));
            } else {
                await User.create({ name, email, password });
                return res.status(201).json({ message: 'signup success! please signin.' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
