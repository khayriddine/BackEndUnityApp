var http = require('http');
var fs = require('fs');
var express = require('express');


var app = express();
var server = http.Server(app);

var allClients = [];
var colors = ['blue','red','yellow','green','white','purple'];
app.get('/',function(req,res){
    fs.readFile('index.html','utf-8',function(err,content){
        res.writeHead(200,{ "content-type":"text/html" });
        res.end(content);
    });
});
var io = require('socket.io').listen(server);
//var nsp = io.of('/test');
//nsp.on('connection',function(socket){
io.sockets.on('connection',function(socket){   
    var CurrentPlayer;
    //socket.emit('message','Your are connected Now!!');
    socket.on('newClient',function(newClient){
       
        CurrentPlayer = newClient;
        socket.join(CurrentPlayer.color);

        CurrentPlayer.id = socket.id;
        console.log("new player " + CurrentPlayer.pseudo +" : "+ CurrentPlayer.id + " is connected !!" + "(" + (allClients.length+1)+")");
        allClients.forEach(element => {
            socket.emit('ancientClients',element);
        });
        allClients.push(CurrentPlayer);
        socket.broadcast.emit('new player connected',newClient);
    });
    socket.on('chat',function(data){
        var headMsg = data.msg.substring(0,2);
        
        
        if(headMsg == "/a"){
            var msg = "[ ALL ]"+CurrentPlayer.pseudo +" : " + data.msg.substring(2);
            data.msg = msg;
            console.log(msg);
            socket.broadcast.emit("broadcastMsg",data);
        }else if (headMsg[0] =="/"){
            colors.forEach(color => {
                if(color[1] == headMsg[1])
                {
                    var msg = "[ "+color+" ]" + CurrentPlayer.pseudo +" : " + data.msg.substring(2);
                    socket.to(color).emit("broadcastMsg",data);
                    socket.to(CurrentPlayer.color).emit("broadcastMsg",data);
                }
            });
            
        }else{
            var msg = CurrentPlayer.pseudo + " : " +data.msg;
            console.log(CurrentPlayer);
            socket.to(CurrentPlayer.color).emit("broadcastMsg",data);
            //io.to(CurrentPlayer.color).emit("broadcastMsg",data);
                
        }
    });
    socket.on('dis',function(){
        console.log("socket.id");
        //socket.broadcast.emit('userDisconnect',socket.id);
    });
    
    socket.on('disconnect', function() {
        
            for(var i=0;i<allClients.length;i++){
                if(allClients[i].id == CurrentPlayer.id){

                    //nsp.emit('userDisconnect', CurrentPlayer);
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