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

const request = require('request'),
	  cheerio = require('cheerio');

const [home,homePrev] = [
	'https://api.dongqiudi.com/app/global/2/iphone.json',
	'https://api.dongqiudi.com/app/global/2/iphone.json?mark=gif&version=576&from=msite_com',
];



module.exports = {
	getUrl(url,res){
		transation(url,res);
	},
	getHome(res){
		transation(home,res);
	},
	getNews(newId,res){
		let newUrl = `https://api.dongqiudi.com/app/tabs/iphone/${newId}.json?mark=gif&version=576`;
		transation(newUrl,res);
	},
	getScore(seasonId,res){
		let scoreUrl = `https://api.dongqiudi.com/data/v1/team_ranking/0?season_id=${seasonId}&version=0&refer=data_tab&type=total_ranking`;
		transation(scoreUrl,res);
	},
	getPlayer(seasonId,res){
		let playerUrl = `https://api.dongqiudi.com/data/v1/ranking_type/0?season_id=${seasonId}&version=0&refer=data_tab&type=person`;
		transation(playerUrl,res);
	},
	getPlayerData(type,seasonId,res){
		let playerDataUrl = `https://sport-data.dongqiudi.com/soccer/biz/data/person_ranking?app=dqd&version=0&platform=&type=${type}&season_id=${seasonId}`;
		transation(playerDataUrl,res);
	},
	getTeam(seasonId,res){
		let teamUrl = `https://api.dongqiudi.com/data/v1/ranking_type/0?season_id=${seasonId}&version=0&refer=data_tab&type=team`;
		transation(teamUrl,res);
	},
	getTeamData(type,seasonId,res){
		let teamDataUrl = `https://sport-data.dongqiudi.com/soccer/biz/data/team_ranking?app=dqd&version=0&platform=&type=${type}&season_id=${seasonId}`;
		transation(teamDataUrl,res);
	},
	getSchedule(seasonId,res){
		let scheduleUrl = `https://api.dongqiudi.com/data/v1/schedule/0?season_id=${seasonId}&version=0&refer=data_tab`;
		transation(scheduleUrl,res);
	},
	getMatch(league,time,res){
		let matchUrl = `https://api.dongqiudi.com/data/tab/league/new/${league}?start=${time}&version=576&init=1&from=msite_com`
		transation(matchUrl,res);
	},
	getSeason(competitionId,res){
		let seasonUrl = `https://api.dongqiudi.com/data/v1/tab/seasons/${competitionId}?version=0`;
		transation(seasonUrl,res);
	},
	getTemplate(url,res){
		getHTML(url,res);
	},
	getRound(params,res){
		let {gameweek,roundId,seasonId} = params;
		let roundUrl = `https://sport-data.dongqiudi.com/soccer/biz/data/schedule?season_id=${seasonId}&round_id=${roundId}&gameweek=${gameweek}&app=dqd&platform=&version=0`;
		transation(roundUrl,res);
	},

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

function getHTML(url,res){
	request(url,function(error,response,body){
		/*判断请求是否成功*/
		if (!error && response.statusCode == 200) {
			/*把字符串转换为json*/
			// var data = JSON.parse(body);
			/*渲染模板*/
			let $ = cheerio.load(body,{decodeEntities: false})
			// console.log($('body'))
			// res.json({html:$('body').remove('script').html()});
			let main = $('body'),
				css = [];
			main.find('script').remove();
			main.find('.column').remove();
			main.find('*').each(function(i){
				if($(this).attr('class')){
					let className = $(this).attr('class');
					$(this).removeAttr('class').attr('className',className)
				}
			})
			main.find('img').each(function(j){
				if($(this).attr('orig-src')){
					$(this).attr('src',$(this).attr('orig-src'));
				}
			})
			$('link').each(function(i){
				if($(this).attr('type') == 'text/css'){
					css.push($(this).attr('href'))
				}
			})
			// res.end(main.html())
			res.json({main:main.html(),css})
		}else{
			res.end('');
		}
	})
}