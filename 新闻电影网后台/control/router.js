var model = require("../model/model");
module.exports = function(app){
	
	//通过日期查找
	app.get('/byday',function(req,res){ 
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
		res.header("X-Powered-By",' 3.2.1')
		res.header("Content-Type", "application/json;charset=utf-8");
		var day = req.query.day;
		model.byDay(day,res);
	})
	
	
	//查看内容
	app.post('/details',function(req,res){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
		res.header("X-Powered-By",' 3.2.1')
		res.header("Content-Type", "application/json;charset=utf-8");
		var id = req.body.id;
		model.findDetails(id,res);
	})
	
	//最新消息
	app.get('/latest',function(req,res){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
		res.header("X-Powered-By",' 3.2.1')
		res.header("Content-Type", "application/json;charset=utf-8");
		model.findLatest(res);
	})
	
	//新闻额外内容
	app.post('/extra',function(req,res){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
		res.header("X-Powered-By",' 3.2.1')
		res.header("Content-Type", "application/json;charset=utf-8");
		var id = req.body.id;
		model.extra(id,res);
	})
	
	//新闻评论
	app.post('/comment',function(req,res){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
		res.header("X-Powered-By",' 3.2.1')
		res.header("Content-Type", "application/json;charset=utf-8");
		var [id,type] = [req.body.id,req.body.type];
		model.findCmt(id,type,res);
	})
	
	//热门消息
	app.get('/hot',function(req,res){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
		res.header("X-Powered-By",' 3.2.1')
		res.header("Content-Type", "application/json;charset=utf-8");
		model.findHot(res);
	})
	
	//栏目总览
	app.get('/sections',function(req,res){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
		res.header("X-Powered-By",' 3.2.1')
		res.header("Content-Type", "application/json;charset=utf-8");
		model.sections(res);
	})
	
	//栏目具体消息查看
	app.post('/section',function(req,res){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
		res.header("X-Powered-By",' 3.2.1')
		res.header("Content-Type", "application/json;charset=utf-8");
		var id = req.body.id;
		model.section(id,res);
	})
	
	//栏目之前的内容
	app.post('/beforesec',function(req,res){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
		res.header("X-Powered-By",' 3.2.1')
		res.header("Content-Type", "application/json;charset=utf-8");
		var [id,stamp] = [req.body.id,req.body.stamp];
		model.findBefore(id,stamp,res);
	})
	
	//豆瓣电影默认热映
	app.get('/defaulthot',function(req,res){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
		res.header("X-Powered-By",' 3.2.1')
		res.header("Content-Type", "application/json;charset=utf-8");
		model.findDefault(res);
	})
	
	//豆瓣电影热映
	app.post('/hotplay',function(req,res){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
		res.header("X-Powered-By",' 3.2.1')
		res.header("Content-Type", "application/json;charset=utf-8");
		var [city,start,count] = [req.body.city,req.body.start,req.body.count];
		model.hotplay(city,start,count,res);
	})
	
	//豆瓣电影top250
	app.post('/top250',function(req,res){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
		res.header("X-Powered-By",' 3.2.1')
		res.header("Content-Type", "application/json;charset=utf-8");
		var [start,count] = [req.body.start,req.body.count];
		model.top(start,count,res);
	})
	
	//豆瓣电影即将上映
	app.post('/coming',function(req,res){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
		res.header("X-Powered-By",' 3.2.1')
		res.header("Content-Type", "application/json;charset=utf-8");
		var [start,count] = [req.body.start,req.body.count];
		model.coming(start,count,res);
	})
	
	app.get('/defaultcoming',function(req,res){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
		res.header("X-Powered-By",' 3.2.1')
		res.header("Content-Type", "application/json;charset=utf-8");
		model.defaultcoming(res);
	})
	
	//豆瓣电影搜索
	app.post('/search',function(req,res){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
		res.header("X-Powered-By",' 3.2.1')
		res.header("Content-Type", "application/json;charset=utf-8");
		var [input,type,start,count] = [req.body.input,req.body.type,req.body.start,req.body.count];
		model.search(input,type,start,count,res);
	})
	
	//豆瓣电影详情
	app.post('/particulars',function(req,res){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
		res.header("X-Powered-By",' 3.2.1')
		res.header("Content-Type", "application/json;charset=utf-8");
		var id = req.body.id;
		model.particulars(id,res);
	})
}
	