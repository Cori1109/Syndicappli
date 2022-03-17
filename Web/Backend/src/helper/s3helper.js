const dotenv = require('dotenv')
dotenv.config()
const s3buckets = require('../constants/s3buckets')
var md5 = require('md5');
var fs = require('fs')

var AWS = require('aws-sdk');
s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

s3_functions = {
    uploadS3:uploadS3,
    uploadLogoS3:uploadLogoS3
}

function uploadS3(files, bucket){
    return new Promise(function (resolve, reject) {
        filename_splits = files.avatar.name.split('.');
        fs.readFile(files.avatar.path, (err, data) => {
            if (err) {
                reject(err)
            } else {
                let params = {
                    Bucket: bucket,
                    Key: md5(Date.now()) + "." + filename_splits[filename_splits.length - 1],
                    Body: data,
                    ContentType: files.avatar.mimetype,
                    ACL: 'public-read'
                };

                s3.upload(params, function (error, response) {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(response)
                    }
                });
            }
        })
    })
}

function uploadLogoS3(file, bucket){
    return new Promise(function (resolve, reject) {
        filename_splits = file.originalname.split('.');
        fs.readFile(file.path, (err, data) => {
            if (err) {
                reject(err)
            } else {
                let params = {
                    Bucket: bucket,
                    Key: md5(Date.now()) + "." + filename_splits[filename_splits.length - 1],
                    Body: data,
                    ContentType: file.mimetype,
                    ACL: 'public-read'
                };

                s3.upload(params, function (error, response) {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(response)
                    }
                });
            }
        })
    })
}

module.exports = s3_functions