var path = require('path');
var https = require('https');
var http = require('http');
var fs = require('fs');
var Boom = require('boom')
var Hapi = require('hapi');
var async = require('async');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    port: 8001
});



server.state('data', {
    ttl: 24 * 60 * 60 * 1000,
    isSecure: false,
    isHttpOnly: true,
    encoding: 'base64json',
    clearInvalid: false, // remove invalid cookies
    strictHeader: true // don't allow violations of RFC 6265
});

server.register(require('inert'), (err) => {
    if (err) {
        throw err;
    }

	
	server.route({
	    method: 'GET',
	    path: '/{param*}',
	    handler: {
	        directory: {
	            path: 'www'
	        }
	    }
	});



	server.route({method:'POST',
		path:'/upload/',
		handler: function(request,reply) {


			//console.log(request);
			var body = request.payload.img;
		    base64Data = body.replace(/^data:image\/png;base64,/,""),
		    binaryData = new Buffer(base64Data, 'base64').toString('binary');

			console.log(base64Data);
			var newFilename = "www/images/out_"+new Date().getTime()+".png";
		  require("fs").writeFile(newFilename, binaryData, "binary", function(err) {
		    console.log(err); // writes out file without error, but it's not a valid image
		    reply("{'url':'http://104.236.169.147/"+newFilename+"'}");
		 });
		
		
		  
		
		}
	});
	
    server.start((err) => {

        if (err) {
            throw err;
        }

        console.log('Server running at:', server.info.uri);
    });
});





