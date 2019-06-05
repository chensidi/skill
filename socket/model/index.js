var request = require('request'),
    apiaddr = 'https://api.dongqiudi.com/',
    homeurl = 'https://api.dongqiudi.com/app/global/2/iphone.json?mark=gif&version=576&from=msite_com',
    head = 'https://api.dongqiudi.com/app/tabs/iphone/1.json?mark=gif&version=576&from=msite_com',
    match_obj = {
        important : 'https://api.dongqiudi.com/data/tab/new/important',
        zc : 'https://api.dongqiudi.com/data/tab/league/new/43',
        yc : 'https://api.dongqiudi.com/data/tab/league/new/4',
        xj : 'https://api.dongqiudi.com/data/tab/league/new/3',
        yj : 'https://api.dongqiudi.com/data/tab/league/new/9',
        og : 'https://api.dongqiudi.com/data/tab/league/new/6',
        dj : 'https://api.dongqiudi.com/data/tab/league/new/5',
        fj : 'https://api.dongqiudi.com/data/tab/league/new/12'
    },
    season = {
        zc: 10219,
        yc: 10267,
        xj: 10332,
        yj: 10297,
        dj: 10294,
        og: 10265,
        ol: 10266,
        yg: 10172,
        fj: 10255,
        zzb: 10329,
        gwb: 10339,
        dgb: 10261,
        ylb: 9257,
        ydlb: 9316,
        sjb: 1800,
        ozb: 1530
    },
    highLight = 'https://www.dongqiudi.com/mobile/match/highlights',
    analysis = 'https://www.dongqiudi.com/mobile/match/analysis',
    lineup = 'https://www.dongqiudi.com/mobile/match/lineup',
    situation = 'https://www.dongqiudi.com/mobile/match/situation',
    rcmtUrl = 'https://api.dongqiudi.com/articles/recommend_comments',
    cmtUrl = 'https://api.dongqiudi.com/articles/comments',
    cheerio = require('cheerio'),
	fs = require('fs'),
    iconv = require('iconv-lite'),
    https = require('https');

    'https://api.dongqiudi.com/data/v1/ranking_type/0?season_id=10219&version=0&refer=data_tab&type=team'
    
module.exports = {
    getHomeJson(res,isJson){
        if(isJson){
            transation(homeurl,res);
        }
    },
    getHomeHead(res,isJSON){
        if(isJSON){
            transation(head,res);
        }
    },
    getArticleDts(res,url,isJSON){
        if(!isJSON){
            https.get(url,(ress)=>{
                var buffers = [],len = 0;
                // ress.setEncoding('utf-8');
                ress.on('data',(chunk)=>{
                    // dtstr += chunk;
                    buffers.push(chunk);
                    len += chunk.length;
                })
                ress.on('end',()=>{
                    var newdtstr = Buffer.concat(buffers,len);
                    var change_data = iconv.decode(newdtstr,'utf-8');
                    // console.log(change_data.toString())
                    filterArticle(change_data,res);
                })
            })
        }
    },
    getMatch(res,type,isJSON){
        if(isJSON){
            transation(match_obj[type],res);
        }
    },
    getMatchMore(res,type,flagData,isJSON){
        if(isJSON){
            transation(match_obj[type]+'?start='+flagData,res);
        }
    },
    getHighLight(res,match_id,isJSON){
        if(isJSON){
            transation(highLight+'/'+match_id,res);
        }
    },
    getAnalysis(res,match_id,isJSON){
        if(isJSON){
            transation(analysis+'/'+match_id,res);
        }
    },
    getLineup(res,match_id,isJSON){
        if(isJSON){
            transation(lineup+'/'+match_id,res);
        }
    },
    getSituation(res,match_id,isJSON){
        if(isJSON){
            transation(situation+'/'+match_id,res);
        }
    },
    getRanking(res,league_id,isJSON){
        if(isJSON){
            transation(`https://api.dongqiudi.com/data/v1/team_ranking/0?season_id=${season[league_id]}&version=0&refer=data_tab&type=total_ranking`,res);
        }
    },
    getPersonRanking(res,league_id,isJSON){
        if(isJSON){
            transation(`https://api.dongqiudi.com/data/v1/ranking_type/0?season_id=${season[league_id]}&version=0&refer=data_tab&type=person`,res);
        }
    },
    getDataRanking(res,url,isJSON){
        if(isJSON){
            transation(url,res);
        }
    },
    getTeamRanking(res,league_id,isJSON){
        if(isJSON){
            transation(`https://api.dongqiudi.com/data/v1/ranking_type/0?season_id=${season[league_id]}&version=0&refer=data_tab&type=team`,res);
        }
    },
    getSchedule(res,league_id,isJSON){
        if(isJSON){
            transation(`https://api.dongqiudi.com/data/v1/schedule/0?season_id=${season[league_id]}&version=0&refer=data_tab`,res)
        }
    },
    getrCmt(res,id,isJSON){
        if(isJSON){
            transation(`${rcmtUrl}/${id}`,res);
        }
    },
    getCmt(res,id,size,isJSON){
        if(isJSON){
            transation(`${cmtUrl}/${id}?size=${size}`,res);
        }
    }
}



function transation(url,res){
	request(url,function(error,response,body){
	/*判断请求是否成功*/
		if (!error && response.statusCode == 200) {
			/*把字符串转换为json*/
			// var data = JSON.parse(body);
			// /*渲染模板*/
            // res.json(data)
            res.json({result:body,code:200}) 
		}else{
			res.json({code:404});
		}
	})
}

function filterArticle(html,res){
    if(html){
        var $ = cheerio.load(html,{decodeEntities:false});
        var link = $('link'),
            h1 = $('header h1').text(),
            h2 = $('header h2 a').text(),
            time = $('header time').text(),
            con = [];
        $('.con p').each(function(){
            if($(this).find('img').length!=0){
                con.push({img:$(this).find('img').attr('data-src')})
            }else{
                con.push({text:$(this).text()})
            }
        })
        var css = [];
        link.each(function(obj){
            css.push($(this).prop('href'));
        })
        res.json({css,h1,h2,time,con,code:200})
    }else{
        res.json({code:404});
    }
    
}