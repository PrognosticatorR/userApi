const AWS = require('aws-sdk');
const uuid = require('uuid').v1;
// const keys = require('../configs/dev');

// const region = keys.region;
// const accessKeyId = keys.accessKeyId;
// const secretAccessKey = keys.secretAccessKey;
// const bucket = keys.bucket;
// const apiVersion = keys.apiVersion;

const { region, accessKeyId, secretAccessKey, bucket, apiVersion } = process.env;

const s3 = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey,
    apiVersion,
    signatureVersion: 'v4',
});

exports.getSignedUrl = async (req, res) => {
    try {
        const key = `${req.user._id}/${uuid()}.jpeg`;
        const expireTime = 60 * 4;
        const url = await s3.getSignedUrl('putObject', {
            Bucket: bucket,
            Key: key,
            Expires: expireTime,
            ContentType: 'image/jpeg',
            ACL: 'bucket-owner-full-control',
        });
        return { key, url };
    } catch (error) {
        res.send(error);
    }
};
