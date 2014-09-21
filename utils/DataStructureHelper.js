var fs = require('fs');
/**
 * Created by Tal on 12/08/2014.
 */
module.exports.IsJsonString = function (str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

module.exports.arrayContains = function (needle, arrhaystack){
    return (arrhaystack.indexOf(needle) > -1);
}

module.exports.deleteFolderRecursive = function(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        // fs.rmdirSync(path);
    }
};