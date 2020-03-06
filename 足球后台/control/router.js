var model = require("../model/model");

function headCross(res){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",' 3.2.1')
	res.header("Content-Type", "application/json;charset=utf-8");
}

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

	//无参数url
	app.get('/noparams',(req,res)=>{
		headCross(res)
		let url = req.query.url;
		model.getUrl(url,res);
	})

	//
	app.get('/template',(req,res)=>{
		headCross(res)
		let url = req.query.url;
		model.getTemplate(url,res);
	})
	//首页内容
	app.get('/home',(req,res)=>{
		headCross(res)
		model.getHome(res);
	})

	//新闻
	app.get('/news',(req,res)=>{
		headCross(res)
		let newId = req.query.id;
		model.getNews(newId,res);
	})

	//积分
	app.get('/score',(req,res)=>{
		headCross(res);
		let seasonId = req.query.id;
		model.getScore(seasonId,res);
	})

	//球员榜
	app.get('/player',(req,res)=>{
		headCross(res);
		let seasonId = req.query.id;
		model.getPlayer(seasonId,res);
	})

	//球员数据榜
	app.get('/playerdata',(req,res)=>{
		headCross(res);
		let [type,seasonId] = [req.query.type,req.query.id];
		model.getPlayerData(type,seasonId,res);
	})

	//球队榜
	app.get('/team',(req,res)=>{
		headCross(res);
		let seasonId = req.query.id;
		model.getTeam(seasonId,res);
	})

	//球队数据榜
	app.get('/teamData',(req,res)=>{
		headCross(res);
		let [type,seasonId] = [req.query.type,req.query.id];
		model.getTeamData(type,seasonId,res);
	})

	//赛程
	app.get('/schedule',(req,res)=>{
		headCross(res);
		let seasonId = req.query.id;
		model.getSchedule(seasonId,res);
	})

	//近期比赛
	app.get('/match',(req,res)=>{
		headCross(res);
		let [league,time] = [req.query.league,req.query.time];
		model.getMatch(league,time,res);
	})

	//赛季查询
	app.get('/season',(req,res)=>{
		headCross(res);
		let competitionId = req.query.competitionId;
		model.getSeason(competitionId,res);
	})

	//轮数查询
	app.get('/round',(req,res)=>{
		headCross(res);
		let gameweek = req.query.gameweek,
			roundId = req.query.roundId,
			seasonId = req.query.seasonId;
		model.getRound({gameweek,roundId,seasonId},res);
	})
}
	