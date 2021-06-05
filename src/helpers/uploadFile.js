const aws = require('aws-sdk');
const uuid = require('uuid').v1;
const { accessKeyId, secretAccessKey, bucket } = process.env;

exports.uploader = file => {
    return new Promise((resolve, reject) => {
        aws.config.update({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            bucket: bucket,
        });
        const fileKey = `${uuid()}.jpeg`;
        const s3 = new aws.S3({
            params: { Bucket: bucket, Key: fileKey, Body: file, ContentType: 'image/jpg' },
        });
        s3.upload().send(function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};
