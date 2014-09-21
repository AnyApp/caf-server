/**
 * Created by Tal on 06/08/2014.
 */
var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var App_Object = new Schema ({
    // unique data for builder & caf
    // app_id: Schema.Types.objectId,
    version: { type: Number, default: 1.0 },
    last_update: { type: Date, default: Date.now },
    app_wrapper_object_id: {type: Schema.Types.ObjectId, ref: 'Caf_Object'},
    app_uri: String,
    // app production data
    app_name: String,
    app_description: String,
    author: String,
    keywords: String,
    website: String,
    mail: String,
    support_url: String,
    phone: String,
    policy: String,
    // phonegap preferences
    app_preferences: [{
        name : String,
        value : String
    }],
    // phonegap features
    app_features: [{
        name: String,
        param : [{
            name : String,
            value : String
        }]
    }],
    // phonegap plugins
    plugins: [{
        name: String,
        version: Number
    }],
    // icons
    icons: {
        default_icon: String,
        android_icon: String,
        ios_icon: String
    },
    splashes: {
        default_splash: String,
        android_splash: String,
        ios_splash: String
    }
});

mongoose.model('App_Object',App_Object);