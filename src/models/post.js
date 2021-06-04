const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            max: 40,
            unique: true,
            required: [true, "title shouldn't be empty or should have at most 40 chars."],
        },
        description: {
            type: String,
            trim: true,
            min: 100,
            required: [true, "description shouldn't be empty or should have at min 100 chars."],
        },
        photo_url: {
            type: String,
            trim: true,
            lowercase: true,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
        timestamps: false,
        versionKey: false,
    }
);

module.exports = mongoose.model('Post', postSchema);
