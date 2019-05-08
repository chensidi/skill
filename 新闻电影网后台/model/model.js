// var regName = /^\w{6,}$/i;
// var regPwd = /^\d{6}/i;
// var regEmail = /^\w+@\w+(\.com)$/i;
// var mysql = require("mysql");//引入MySQL模块
// var connection = mysql.createConnection({//创建连接数据库/表
// 	host : 'localhost',
// 	user : 'root',
// 	password : 'root',//root
// 	database : 'jc'
// })
// connection.connect();//连接数据库

var request = require('request');
var beforeURL = 'https://news-at.zhihu.com/api/4/news/before/',
	detailsURL = 'https://news-at.zhihu.com/api/4/news/',
	latestURL = 'https://news-at.zhihu.com/api/4/news/latest',
	extraURL = 'https://news-at.zhihu.com/api/4/story-extra/',
	cmtURL = 'https://news-at.zhihu.com/api/4/story/',
	hotURL = 'https://news-at.zhihu.com/api/3/news/hot',
	sectionsURL = 'https://news-at.zhihu.com/api/3/sections',
	sectionURL = 'https://news-at.zhihu.com/api/3/section/',
	beforeSecURL = 'https://news-at.zhihu.com/api/4/section/';
	
var hotplayURL = 'https://api.douban.com/v2/movie/in_theaters',
	topURL = 'https://api.douban.com/v2/movie/top250',
	comingURL = 'https://api.douban.com/v2/movie/coming_soon',
	searchURL = 'https://api.douban.com/v2/movie/search?',
	particularsURL = 'https://api.douban.com/v2/movie/subject/';
module.exports = {
	byDay(day,res){ 
		transation(beforeURL+day,res);
	},
	
	findDetails(id,res){
		transation(detailsURL+id,res)
	},
	
	findLatest(res){
		transation(latestURL,res);
	},
	
	extra(id,res){
		transation(extraURL+id,res);
	},
	
	findCmt(id,type,res){
		transation(cmtURL+id+'/'+type,res);
	},
	
	findHot(res){
		transation(hotURL,res);
	},
	
	sections(res){
		transation(sectionsURL,res);
	},
	
	section(id,res){
		transation(sectionURL+id,res);
	},
	
	findBefore(id,stamp,res){
		transation(beforeSecURL+id+'/before/'+stamp,res);
	},
	
	findDefault(res){
		transation(hotplayURL,res);
	},
	
	hotplay(city,start,count,res){
		transation(hotplayURL+'?'+'city='+city+'&start='+start+'&count='+count,res);
	},
	
	top(start,count,res){
		if(start==undefined&&count==undefined){
			transation(topURL,res);
		}else{
			transation(topURL+'?'+'start='+start+'&count='+count,res);
		}
	},
	
	coming(start,count,res){
		transation(comingURL+'?'+'start='+start+'&count='+count,res);
	},
	
	defaultcoming(res){
		transation(comingURL,res);
	},
	
	search(input,type,start,count,res){
		transation(searchURL+type+'='+input+'&start='+start+'&count='+count,res);
	},
	
	particulars(id,res){
		transation(particularsURL+id,res);
	}
}	


function transation(url,res){
	request(url,function(error,response,body){
	/*判断请求是否成功*/
		if (!error && response.statusCode == 200) {
			/*把字符串转换为json*/
			var data = JSON.parse(body);
			/*渲染模板*/
			res.json(data);
		}else{
			res.end('');
		}
	})
}