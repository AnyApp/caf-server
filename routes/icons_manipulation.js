/**
 * Created by Tal on 17/08/2014.
 */
var https = require('https'),
    fs = require('fs');
    mongoose = require( 'mongoose' ),
    App_Object     = mongoose.model( 'App_Object'),
    jsonBuilder = require('../utils/xmlFileBuilder.js'),
    DataStructureHelper = require('../utils/DataStructureHelper.js'),
    nativeElements = require('../resources/nativeElements.js'),
    GitHub = require('../utils/GitHub.js'),
    gm = require('gm')
    , imageMagick = gm.subClass({ imageMagick: true }),
    im = require('imagemagick-stream'),
    _ = require('underscore'),
    q = require('Q'),
    Promise = require('promise');



var sync = require('synchronize'),
    fiber = sync.fiber,
    await = sync.await,
    defer = sync.defer;


function resizeToAllSizesAndUploadToGitHub(buf,id,doc){
    var sizes = nativeElements.android_icons.concat(nativeElements.ios_icons);
    imageMagick(buf)
        .resize(100,100)
        .write('out.jpg', function (err) {
            if (err) return handle(err);
            console.log(buf);
        });
}

exports.generateIcons = function (req, res, next){
    var id = req.params.id;
    App_Object.findById(id, function (err, doc){
        if(err || !doc) {
            res.send('Error - ID does not exist');
            return;
        }
//        var defIcon = getHttpsImage(doc.icons.default_icon);
        var iconBuffer = new Buffer('');
        https.get('https://encrypted.google.com/', function(httpsRes) {
            httpsRes.on('data', function(d) {
                iconBuffer = Buffer.concat([iconBuffer,d]);
            });
            httpsRes.on('end',function(err){
                if(err){
                    console.log(err);
                    next(err);
                }
                resizeToAllSizesAndUploadToGitHub(iconBuffer,id,doc)
            });
        }).on('error', function(e) {
            console.error(e);
        });
    });
}



function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

function resizeImage(src, dst, width, height, callback) {
    imageMagick(src)
        .resize(height, width)
        .noProfile()
        .write(dst, function (err) {
            if(err) {
                return console.error('error saving icon' + dst + err);
            }
            else {
                var data ='';
                fs.readFile(dst, 'utf8', function (err,data) {
                    if (err) {
                        return console.log(err);
                    }
                    if(typeof(callback) == "function"){
                        callback(data);
                    }
                });
            }
        });
}
