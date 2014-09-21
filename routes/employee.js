var mongoose = require( 'mongoose' );
var Caf_Object     = mongoose.model( 'Caf_Object' );

exports.create = function ( req, res, next ){
    var post_param = req.body;
    new Caf_Object({
        uname    : 'levi',
        version    : 11,
        platform : 13,
        extends : ['a', 'b'],
        logic : {
            onclick: 'caf-to-page',
            onmouseout: 'caf-out'
        }
    })
    .save(function(err, todo, count){
            if(err) return next(err);
            res.redirect( '/' );
    });
};

exports.index = function ( req, res, next ){
    Caf_Object.
        find().
        exec( function ( err, todos ){
            if( err ) return next( err );
            console.log(todos);
            res.jsonp(todos);
        });
};

exports.delete = function ( req, res, next ){
    var id = req.params.id;
    Caf_Object.findById(id, function ( err, todo ){
        todo.remove( function ( err, todo ){
            if( err ) return next( err );
            res.redirect( '/' );
        });
    });
};

exports.post = function (req, res, next) {
    console.log(req.body);
    res.send('sababa');
}