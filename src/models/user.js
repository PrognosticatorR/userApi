const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            max: 32,
            required: [true, "Name shouldn't be empty or should have at most 32 chars."],
        },
        email: {
            type: String,
            trim: true,
            required: [true, "Email shouldn't be empty"],
            unique: true,
            lowercase: true,
        },
        hashed_password: {
            type: String,
            required: true,
        },
        profile_pic: {
            type: String,
            trim: true,
            default: '',
        },
        posts: [{ type: ObjectId, ref: 'Post' }],
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.hashed_password;
            },
        },
        timestamps: false,
        versionKey: false,
    }
);

userSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

userSchema.methods = {
    authenticate: function (palinText) {
        return bcrypt.compareSync(palinText, this.hashed_password);
    },
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            let salt = bcrypt.genSaltSync(10);
            return bcrypt.hashSync(password, salt);
        } catch (error) {
            return '';
        }
    },
};

module.exports = mongoose.model('User', userSchema);
