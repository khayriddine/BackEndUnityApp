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
    
    var CurrentPlayer;
    //socket.emit('message','Your are connected Now!!');
    socket.on('newClient',function(newClient){
        CurrentPlayer = newClient;
        CurrentPlayer.id = socket.id;
        console.log("new player " + CurrentPlayer.pseudo +" : "+ CurrentPlayer.id + " is connected !!" + "(" + (allClients.length+1)+")");
        allClients.forEach(element => {
            socket.emit('ancientClients',element);
        });
        allClients.push(CurrentPlayer);
        socket.broadcast.emit('new player connected',newClient);
    });
    socket.on('dis',function(){
        console.log("socket.id");
        //socket.broadcast.emit('userDisconnect',socket.id);
    });
    
    socket.on('disconnect', function() {
        
            for(var i=0;i<allClients.length;i++){
                if(allClients[i].id == CurrentPlayer.id){

                    io.emit('userDisconnect', CurrentPlayer);
                    
                    console.log(allClients[i].id + " disconnected !!");
                    allClients.splice(i, 1);
                    
                   
                }
            }
            
        
        
    });


    
});


server.listen(3000, function () {
    console.log("Express server listening on port 3000");
    });


//classes : game{map, players,time}
// map{spawning position, name}
//player{color, pseudo, health, money,skills,position,rotation,ammo,grenades}
//
//