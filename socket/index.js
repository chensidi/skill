var express = require('express');
var router = require('./router/index.js');
var body = require('body-parser').urlencoded({extended:false})

var app = express();
app.use(body);
app.listen(3000,()=>{
	console.log('success!')
})

router(app);

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8080 });

let userGroup = {},connectid = 0,count = 0;

wss.on('connection', function(ws) {
	ws.connectid = connectid;
	count ++;
	

	// ws.send(`welcom !you are the ${count} bit`);

	// for(let item in userGroup){
	// 	if(userGroup[item]){
	// 		userGroup[item].send(`welcom the ${count} bit`);
	// 	}
	// }

	userGroup[connectid ++] = ws;

	ws.on('message', function(message) {
	    // console.log('received: %s', message);
	    message = JSON.parse(message);
	    switch (message.type){
	    	case 'connect':
	    		userGroup[this.connectid]['cid'] = message.cid;
	    		userGroup[this.connectid]['username'] = message.username;
	    		userGroup[this.connectid]['avatar'] = message.avatar;
	    		break;
	    	case 'single':
	    		let from = message.mine.id,
	    			to = message.to.id,
	    			content = message.mine.content;

	    		for(let item in userGroup){
					if(userGroup[item]){
						if(userGroup[item]['cid'] == to){
							let res = {
				    			username: message.mine.username //消息来源用户名
								  ,avatar: message.mine.avatar //消息来源用户头像
								  ,id: from //消息的来源ID（如果是私聊，则是用户id，如果是群聊，则是群组id）
								  ,type: "friend" //聊天窗口来源类型，从发送消息传递的to里面获取
								  ,content: content //消息内容
								  ,mine: false //是否我发送的消息，如果为true，则会显示在右方
								  ,fromid: from //消息的发送者id（比如群组中的某个消息发送者），可用于自动解决浏览器多窗口时的一些问题
								  ,timestamp: new Date().getTime() //服务端时间戳毫秒数。注意：如果你返回的是标准的 unix 时间戳，记得要 *1000
				    		}
							userGroup[item].send(JSON.stringify(res));
						}
					}
				}

	    		
	    }
		
	});

	ws.on('close',function(){
		delete userGroup[this.connectid];
		count --;
	})
});
