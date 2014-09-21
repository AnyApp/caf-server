// db stuff
var mongoose = require( 'mongoose' );
var mongoUri = 'mongodb://heroku_app28159613:nhgi65iethh88cc5h52re963qr@dbh84.mongolab.com:27847/heroku_app28159613';
mongoose.connect(mongoUri);
require('./Schema/caf_object.js');
require('./Schema/app_object.js');

var express = require('express');
var bodyParser = require('body-parser');
var caf_object = require('./routes/employee');
var app_object = require('./routes/app_functionallity');
var icons_object = require('./routes/icons_manipulation');
var busboy = require('connect-busboy');


var app = express();

/*app.use(express.urlencoded());
app.use(express.json());*/

app.use(busboy());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.text());

app.get('/create', caf_object.create);
app.get('/remove/:id', caf_object.delete);
// App object functionallity
app.get('/newApp', app_object.newApp);
app.post('/update/:id', app_object.update);
app.post('/uploadIcon/:id', app_object.uploadIcon);
app.get('/uploadJSON/:id',app_object.uploadAPP);
app.get('/generateIcons/:id',icons_object.generateIcons);

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});

