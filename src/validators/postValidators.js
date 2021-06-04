const { check } = require('express-validator');

exports.createPostValidator = [
    check('description')
        .isLength({ min: 100 })
        .withMessage('description must be  atleast 100 character long !'),
    check('title').notEmpty().isLength({ max: 40 }).withMessage('title is longer then 40 chars!'),
];
