/**
 * Created by Tal on 06/08/2014.
 */
var mongoose = require( 'mongoose' );
var fs = require('fs');
var App_Object     = mongoose.model( 'App_Object' );
var jsonBuilder = require('../utils/xmlFileBuilder.js');
var DataStructureHelper = require('../utils/DataStructureHelper.js');
var constants = require('../resources/constants.js');
var s3 = require('../utils/s3.js');
var GitHub = require('../utils/GitHub.js');

exports.uploadAPP = function (req,res,next) {
    var id = req.params.id;
    App_Object.findById(id, function (err, doc){
        if(err) {
            res.send('Error - ID not exists');
            return;
        } else {
            var jsonContent = jsonBuilder.build_phonegap_xml(doc);
            GitHub.CreateRepo(id,function(){
                console.log('Repo Created!');
                GitHub.commitToRepo(id,doc.app_name+'/www/config.xml','inital commit',jsonContent);
            });
            fs.writeFile('config.xml', jsonContent, function (err) {
                if (err){
                    res.send(err);
                    return console.log(err);
                }
                else {
                    s3.uploadFile('config.xml','./config.xml',id,function(){
                        res.send('Config uploaded!');
                    });
                }
            });
        }
    });
}
exports.get = function( req, res, next ){
    var id = req.params.id;
    App_Object.findById(id, function (err, app){
        if(err) {
            console.log(err);
            res.send('Error: '+err);
        }
        else {
            res.jsonp(app);
        }
    });
}

exports.newApp = function ( req, res, next ){
    var post_param = req.body;
    new App_Object()
        .save(function(err, app, count){
            if(err) return next(err);
            res.jsonp(app);
        });
};

exports.uploadIcon = function ( req, res, next ){
    var id = req.params.id;
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        var fileLoc = './uploads/' + filename;
        //Path where image will be uploaded
        fstream = fs.createWriteStream(fileLoc);
        file.pipe(fstream);
        fstream.on('close', function () {
            console.log("Upload Finished of " + filename);
            s3.uploadFile(filename,fileLoc,id, function(){
                fs.unlink(fileLoc,function(){
                    console.log('removed locally');
                });
                var icon_object = {
                    icons: {
                        default_icon: s3.getFileUrlByAppID(filename,id)
                    }
                };
                App_Object.findByIdAndUpdate(id, icon_object, function(err, saved) {
                    if( err || !saved ) {
                        console.log("Post not updated: "+err);
                    } else {
                        console.log("Post updated: %s", saved);
                    }});
                res.send('uploaded to amazon!');
            });
        });
    });
};

exports.update = function ( req, res, next ){
    var id = req.params.id;
    var postedObject = req.body;
    var allowed_keys = constants.allowed_keys;
    if(DataStructureHelper.IsJsonString(postedObject)) {
        postedObject = JSON.parse(postedObject);
        for(var key in postedObject) {
            if(!DataStructureHelper.arrayContains(key,allowed_keys)) {
                delete postedObject.key;
            }
        }
        App_Object.findByIdAndUpdate(id, postedObject, function(err, saved) {
            if( err || !saved ) {
                console.log("Post not updated: "+err);
                res.send("Post not updated: "+err);
            } else {
                console.log("Post updated: %s", saved);
                res.send("Post updated: "+ saved);
            }});
    }
    else {
        res.send('Error in Json format!');
    }

};

exports.getJSON = function ( req, res, next ){
    var id = req.params.id;
    App_Object.findById(id, function (err, doc){
        if(err) {
            res.send('Error - ID not exists');
        } else {
            var jsonContent = jsonBuilder.build_phonegap_xml(doc);
            res.send(jsonContent);
        }
    });
};

exports.index = function ( req, res, next ){
        App_Object.
        findOne().
        exec( function ( err, app_json ){
            if( err ) return next( err );
            var jsonContent = jsonBuilder.build_phonegap_xml(app_json);
            res.send(jsonContent);
        });
};

exports.createAppJSON = function ( req, res, next ){
    var jsonContent = jsonBuilder.build_phonegap_xml({});
    res.send(jsonContent);
}

