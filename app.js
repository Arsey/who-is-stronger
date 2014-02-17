var app=require('express')()
	,server=require('http').createServer(app)
	,io=require('socket.io').listen(server);

server.listen(8012);

app.get('/',function (req,res) {
	res.sendfile(__dirname+'/index.html');
});

var pointCost=25;
var pointsToWin=500/pointCost;
var usersPoints={};

io.sockets.on('connection', function (socket) {

  socket.emit('welcome', 'Welcome to Who Is Stronger Game!\r\nSet your nickname and ready to start!');

  socket.on('setNickname',function(nickname){
  	socket.set('nickname',nickname);
  });

  socket.on('tap',function () {
  	socket.get('nickname',function(err,name){

  		if(!usersPoints[name]){
  			usersPoints[name]=1;
  		}
  		
  		for(var i in usersPoints){
  			console.log(usersPoints);
			if(i===name&&usersPoints[i]+1<=pointsToWin){
				usersPoints[i]++;
			}else if(i!==name){
				if(usersPoints[i]>0){
					usersPoints[i]--;
				}
			}
  		}

  		io.sockets.emit('tapped',usersPoints);
  	});
  });

});