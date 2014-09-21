/**
 * Created by Tal on 06/08/2014.
 */

var xmlbuilder = require('xmlbuilder');
var nativeElements = require('../resources/nativeElements.js');

exports.build_phonegap_xml = function(jsonFile) {
    var root = xmlbuilder.create('widget',
        {version: '1.0', encoding: 'UTF-8', standalone: true}
    );
    root.att('xmlns', 'http://www.w3.org/ns/widgets');
    root.att('xmlns:gap', 'http://phonegap.com/ns/1.0');
    root.att('id', jsonFile.app_uri);
    root.att('version', jsonFile.version);
    root.ele('name',jsonFile.app_name);
    root.ele('description',jsonFile.app_description);
    var author = root.ele('author',jsonFile.author);
    author.att('href', jsonFile.support_url);
    author.att('email', jsonFile.mail);
    var pref = jsonFile.app_preferences;
    for (var i=0; i<pref.length; i++) {
        var cur = root.ele('preference');
        cur.att('name', pref[i].name);
        cur.att('value', pref[i].value);
    }
    var plugins = jsonFile.plugins;
    for (var i=0; i<plugins.length; i++) {
        var cur = root.ele('gap:plugin');
        cur.att('name', plugins[i].name);
        if(plugins[i].version!==undefined)
        {
            cur.att('version', plugins[i].version);
        }
    }
    var features = jsonFile.app_features;
    for (var i=0; i<features.length; i++) {
        var cur = root.ele('feature');
        cur.att('name', features[i].name);
        var params = features[i].param;
        for (var i=0; i<params.length; i++) {
            var cur_param = cur.ele('param');
            cur_param.att('name', params[i].name);
            cur_param.att('value', params[i].value);
        }
    }

    //icons
    root.ele('icon')
        .att('src', 'icon.png');

    //android icons
    for(var i=0; i<nativeElements.android_icons.length; i++) {
        root.ele('icon')
            .att('src', nativeElements.android_icons[i].src)
            .att('gap:platform', 'android')
            .att('gap:density', nativeElements.android_icons[i].density);
    }

    //ios icons
    for(var i=0; i<nativeElements.ios_icons.length; i++) {
        root.ele('icon')
            .att('src', nativeElements.ios_icons[i].src)
            .att('gap:platform', 'ios')
            .att('height', nativeElements.ios_icons[i].height)
            .att('width', nativeElements.ios_icons[i].width);
    }

    // android splashes
    for(var i=0; i<nativeElements.android_splashes.length; i++) {
        root.ele('gap:splash')
            .att('src', nativeElements.android_splashes[i].src)
            .att('gap:platform', 'android')
            .att('gap:density', nativeElements.android_splashes[i].density);
    }

    // ios splashes
    for(var i=0; i<nativeElements.ios_splashes.length; i++) {
        root.ele('gap:splash')
            .att('src', nativeElements.ios_splashes[i].src)
            .att('gap:platform', 'ios')
            .att('height', nativeElements.ios_splashes[i].height)
            .att('width', nativeElements.ios_splashes[i].width);
    }
    root.ele('access').att('origin', '*');
    return root.toString({ pretty: true });
}
