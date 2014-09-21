/**
 * Created by Tal on 14/08/2014.
 */
var constants = require('../resources/constants.js');
var fs = require('fs');
var aws = require('aws-sdk');
aws.config.loadFromPath('./utils/AwsConfig.json');

//constants
var BUCKET_NAME = constants.BUCKET_NAME;
var UPLOAD_PATH = constants.UPLOAD_PATH;

var s3 = new aws.S3();

module.exports.getFileUrlByAppID = function(filename,AppID){
    return 'https://s3-us-west-2.amazonaws.com/codletechtest/Codletech/Approducer/'+AppID+'/'+filename;
}

module.exports.getFileList = function (path) {
    var i, fileInfo, filesFound;
    var fileList = [];

    filesFound = fs.readdirSync(path);
    for (i = 0; i < filesFound.length; i++) {
        fileInfo = fs.lstatSync(path + filesFound[i]);
        if (fileInfo.isFile()) fileList.push(filesFound[i]);
    }

    return fileList;
}


module.exports.uploadFile = function (remoteFilename, fileName, appID, callback) {
    var fileBuffer = fs.readFileSync(fileName);
    var metaData = getContentTypeByFile(fileName);
    remoteFilename = fixFileName(remoteFilename,appID);
    console.log(remoteFilename);
    s3.putObject({
        ACL: 'public-read',
        Bucket: BUCKET_NAME,
        Key: remoteFilename,
        Body: fileBuffer,
        ContentType: metaData
    }, function(error, response) {
        callback();
        console.log('uploaded file[' + fileName + '] to [' + remoteFilename + '] as [' + metaData + ']');
        console.log(arguments);
    });
}

function fixFileName(remoteFilename,appID) {
    var result = UPLOAD_PATH;
    if (typeof appID !== 'undefined') {
        result+='/'+appID;
    }
    result+='/'+remoteFilename;
    return result;
}


function getContentTypeByFile(fileName) {
    var rc = 'application/octet-stream';
    var fileNameLowerCase = fileName.toLowerCase();

    if (fileNameLowerCase.indexOf('.html') >= 0) rc = 'text/html';
    else if (fileNameLowerCase.indexOf('.css') >= 0) rc = 'text/css';
    else if (fileNameLowerCase.indexOf('.json') >= 0) rc = 'application/json';
    else if (fileNameLowerCase.indexOf('.js') >= 0) rc = 'application/x-javascript';
    else if (fileNameLowerCase.indexOf('.png') >= 0) rc = 'image/png';
    else if (fileNameLowerCase.indexOf('.jpg') >= 0) rc = 'image/jpg';

    return rc;
}


function createBucket(bucketName) {
    s3.createBucket({Bucket: bucketName}, function() {
        console.log('created the bucket[' + bucketName + ']')
        console.log(arguments);
    });
}
