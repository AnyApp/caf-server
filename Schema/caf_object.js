/**
 * Created by Tal on 05/08/2014.
 */
var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var Caf_Object = new Schema({
    app_id	: Schema.Types.ObjectId,
    uname : String,
    version	: Number,
    platform : Number,
    extends : [String],
    logic: Schema.Types.Mixed,
    design: Schema.Types.Mixed,
    data: Schema.Types.Mixed
}, { strict: false });

mongoose.model('Caf_Object',Caf_Object);

