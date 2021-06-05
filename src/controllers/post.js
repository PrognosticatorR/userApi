const formidable = require('formidable');
const Post = require('../models/post');
const User = require('../models/user');
const validator = require('validator');
const fs = require('fs');
const { uploader } = require('../helpers/uploadFile');

exports.createPost = async (req, res) => {
    try {
        const form = formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Image could not upload',
                });
            }
            const { description, title } = fields;
            if (!validator.isLength(title, { min: 3, max: 40 }))
                return res.status(400).json({ error: 'name must be less then 32 chars' });
            if (!validator.isLength(description, { min: 100 }))
                return res.status(400).json({ error: 'password must be greater then 100 chars' });
            const post = await Post.findOne({ title });
            if (post) return res.status(400).json({ error: 'post already exists' });
            const file = files.image;
            if (file) {
                if (!['image/jpeg', 'image/png'].includes(file.type))
                    return res.status(400).json({ error: 'only images are allowed' });
                if (file.size > 1500000) {
                    return res.status(400).json({
                        error: 'Image should not be bigger then 1.5 mb.',
                    });
                }
                const data = fs.readFileSync(file.path);
                await uploader(data)
                    .then(async resData => {
                        const { id } = await Post.create({ description, title, photo_url: resData.Location });
                        const user = await User.findById(req.currentUser.id);
                        user.posts.push(id);
                        user.save();
                        return res.status(201).json({ message: 'post created!' });
                    })
                    .catch(err => console.log(err));
            } else {
                const { id } = await Post.create({ description, title });
                const user = await User.findById(req.currentUser.id);
                user.posts.push(id);
                user.save();
                return res.status(201).json({ message: 'post created!' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({});
        if (posts.lenght === 0) return res.status(404);
        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) return res.sendStatus(404);
        if (!req.currentUser.posts.includes(post._id)) res.status(400).json({ message: 'only creator' });
        let deleted = await Post.deleteOne({ _id: id });
        return res.status(200).send(deleted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const form = formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Image could not upload',
                });
            }
            const { description, title } = fields;
            if (title && !validator.isLength(title, { min: 3, max: 40 }))
                return res.status(400).json({ error: 'name must be less then 32 chars' });
            if (description && !validator.isLength(description, { min: 100 }))
                return res.status(400).json({ error: 'password must be greater then 100 chars' });
            const file = files.image;
            const post = await Post.findById(id);
            if (!post) return res.sendStatus(404);
            if (!req.currentUser.posts.includes(post._id)) res.status(400).json({ message: 'only creator' });
            if (file) {
                if (!['image/jpeg', 'image/png'].includes(file.type))
                    return res.status(400).json({ error: 'only images are allowed' });
                if (file.size > 1500000) {
                    return res.status(400).json({
                        error: 'Image should not be bigger then 1.5 mb.',
                    });
                }
                const data = fs.readFileSync(file.path);
                await uploader(data)
                    .then(async resData => {
                        const updated = await Post.updateOne({ _id: id }, { ...fields, photo_url: resData.Location });
                        return res.status(200).json({ updated });
                    })
                    .catch(err => console.log(err));
            } else {
                await Post.updateOne({ _id: id }, fields);
                return res.status(200).json({ message: 'successfully updated' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPostsByUserId = async (req, res) => {
    try {
        const user = await User.find({ _id: req.params.id }).populate({ path: 'posts', select: 'title photo_url' });
        res.status(200).json({ userdata: user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
