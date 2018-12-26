var http = require('http');
var fs = require('fs');
var express = require('express');


var app = express();
var server = http.Server(app);

var allClients = [];
app.get('/',function(req,res){
    fs.readFile('index.html','utf-8',function(err,content){
        res.writeHead(200,{ "content-type":"text/html" });
        res.end(content);
    });
});
var io = require('socket.io').listen(server);
io.sockets.on('connection',function(socket){
    //allClients.push(socket);
    
    //socket.emit('message','Your are connected Now!!');
    socket.on('newClient',function(newClient){
        socket.broadcast.emit('new player connected',newClient);
        console.log("new player " + newClient.pseudo + " is connected !!");
    });
/*

    socket.on('disconnect', function() {
		console.log('player disconnect');
		//socket.broadcast.emit('other player disconnected', currentPlayer);
		var i = allClients.indexOf(socket);
        allClients.splice(i, 1);
	});*/
});


server.listen(3000, function () {
    console.log("Express server listening on port 3000");
    });


//classes : game{map, players,time}
// map{spawning position, name}
//player{color, pseudo, health, money,skills,position,rotation,ammo,grenades}
//
//