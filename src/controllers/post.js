const Post = require('../models/post');
const User = require('../models/user');

exports.createPost = async (req, res) => {
    try {
        const { description, title } = req.body;
        let data = { description, title };
        const { id } = await Post.create(data);
        const user = await User.findById(req.currentUser.id);
        user.posts.push(id);
        user.save();
        res.status(201).send('post created!');
    } catch (error) {
        res.status(500).send('server error');
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({});
        if (posts.lenght === 0) return res.status(404);
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send('something went wrong!');
    }
};

exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        res.status(200).send(post);
    } catch (error) {
        res.status(500).send('something went wrong!');
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) return res.sendStatus(404);
        if (req.currentUser.posts.includes(post._id)) {
            let deleted = await Post.deleteOne({ _id: id });
            return res.status(200).send(deleted);
        }
        res.status(400).send('only creator');
    } catch (error) {
        res.status(500).send('something went wrong!');
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const post = await Post.findById(id);
        if (!post) return res.sendStatus(404);
        if (req.currentUser.posts.includes(post._id)) {
            let updated = await Post.updateOne({ _id: id }, data);
            return res.status(200).send(updated);
        }
        res.status(400).send('only creator');
    } catch (error) {
        res.status(500).send('something went wrong!');
    }
};
