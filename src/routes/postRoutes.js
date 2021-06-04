const express = require('express');
const postRouter = express.Router();
const { createPost, getAllPosts, getPostById, deletePost, updatePost } = require('../controllers/post');

const { runValidation } = require('../validators');
const { createPostValidator } = require('../validators/postValidators');
const { authProtection } = require('../middlewares/authProtection');
const { getAuthUserInfo } = require('../middlewares/getAuthUserInfo');

postRouter.post('/api/posts', createPostValidator, authProtection, getAuthUserInfo, runValidation, createPost);
postRouter.get('/api/posts', authProtection, getAllPosts);
postRouter.get('/api/posts/:id', authProtection, getPostById);
postRouter.delete('/api/posts/:id', authProtection, getAuthUserInfo, deletePost);
postRouter.put('/api/posts/:id', authProtection, getAuthUserInfo, updatePost);

module.exports = postRouter;
