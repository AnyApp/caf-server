/**
 * Created by Tal on 14/08/2014.
 */
var fs = require('fs');
var github = require('octonode');
var constants = require('../resources/constants.js');

var client = github.client(constants.GIT_SECRET);
var ghme        = client.me();

module.exports.CreateRepo = function(appID,callback) {
    var repoExists = false;
    var repoName = getRepoName(appID);
    listRepo(function(repos){
        for(var i=0; i<repos.length;i++) {
            if(repoName==repos[i].name) {
                repoExists=true;
            }
        }
            if(!repoExists) {
                CreateRepo(repoName,'CAF-Client',callback);
            }
    });
}

module.exports.commitToRepo = function(appID, filePath, commitMessage, fileContent, callback) {
    var ghrepo = client.repo('codletech/'+getRepoName(appID));
    ghrepo.createContents(filePath, commitMessage, fileContent, 'master',
        function(err, data, headers) {
            if(err) {
                console.log('error when trying to commit filepath: '+filePath +err);
                console.log(err);
            }
            else {
                console.log('uploaded file: '+filePath+' into git!');
                if(typeof(callback) == "function"){
                    callback();
                }
            }
    });
}

module.exports.updateFile = function(appID, filePath, commitMessage, fileContent, sha, callback) {
    var ghrepo = client.repo('codletech/'+getRepoName(appID));
    ghrepo.updateContents(filePath, commitMessage, fileContent, sha,
        function(err, data, headers) {
            if(err) {
                console.log('error when trying to update filepath: '+filePath +err);
                console.log(err);
            }
            else {
                console.log('file: '+filePath+' updated!');
                if(typeof(callback) == "function"){
                    callback();
                }
            }
        });
}

module.exports.getFileDetails = function(appID, filePath, callback) {
    var ghrepo = client.repo('codletech/'+getRepoName(appID));
    var sha;
    ghrepo.contents(filePath,
        function(err, data, headers) {
            if(data && data.sha) {
                sha=data.sha;
            }
            else {
                console.log('no SHA');
            }
            if(typeof(callback) == "function"){
                callback(sha);
            }
        });
}


module.exports.commitFileToRepo = function(appID, filePath, commitMessage, filePath, callback) {
    var ghrepo = client.repo('codletech/'+getRepoName(appID)),
        fileContent;
    fs.readFile(filePath, function (err, data) {
        if(err) { throw err; }
        fileContent = data;
        ghrepo.createContents(filePath, commitMessage, fileContent, 'master',
            function(err, data, headers) {
                if(err) {
                    console.log('error when trying to commit filepath: '+filePath +err);
                    console.log(err);
                }
                else {
                    console.log('uploaded file: '+filePath+' into git!');
                    if(typeof(callback) == "function"){
                        callback();
                    }
                }
            });
    });

}

function getRepoName(appID) {
    return 'codletech-CAF-'+appID;
}

function listRepo(callback){
    ghme.repos(function(err, data, headers) {
        if(err) { console.log('Error in ListRepo!'); }
        else {
            callback(data);
        }
    });
}

function CreateRepo(repoName, repoDesc,callback) {
    ghme.repo(
        {
            "name": repoName,
            "description": repoDesc
        },
        function(err, data, headers) {
            if(err) { console.log('Error in Create Repo!'); }
            else {
                callback();
                console.log('created repo!');
            }
        });
}