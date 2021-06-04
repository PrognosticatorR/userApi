require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined!');
    }
    if (!process.env.MONGO_REMOTE_URI) {
        throw new Error('Mongo uri must be defined.');
    }
    try {
        mongoose
            .connect(process.env.MONGO_REMOTE_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            })
            .then(() => console.log('connected to mongodb..'));
    } catch (error) {
        console.error(error);
    }
    app.listen(port, () => {
        console.log('listening on port 3000!!!');
    });
};

start();
