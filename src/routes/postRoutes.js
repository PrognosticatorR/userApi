const express = require('express');
const postRouter = express.Router();
const {
    createPost,
    getAllPosts,
    getPostById,
    deletePost,
    updatePost,
    getPostsByUserId,
} = require('../controllers/post');

const { authProtection } = require('../middlewares/authProtection');
const { getAuthUserInfo } = require('../middlewares/getAuthUserInfo');

postRouter.post('/api/posts', authProtection, getAuthUserInfo, createPost);
postRouter.get('/api/posts', authProtection, getAllPosts);
postRouter.get('/api/posts/:id', authProtection, getPostById);
postRouter.delete('/api/posts/:id', authProtection, getAuthUserInfo, deletePost);
postRouter.put('/api/posts/:id', authProtection, getAuthUserInfo, updatePost);
postRouter.get('/api/posts/user/:id', authProtection, getPostsByUserId);

module.exports = postRouter;
