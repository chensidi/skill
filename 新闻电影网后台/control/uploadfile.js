var  multer=require('multer');
var md = require('../model/model')
var storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
    destination: function (req, file, cb) {
        cb(null, './static/upload')
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
    	console.log(111);
        var fileFormat = (file.originalname).split(".");//按.分割原来文件名 目的是要文件后缀名
        var reg = /(jpg)|(png)|(gif)|(jpeg)|(webp)/ig;
        if(reg.test(fileFormat[fileFormat.length - 1])){//保持文件到服务器
        	var  name = file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1];
        	cb(null, name);
        	req.session.user.tximg = name;
        	md.updateTx(req,name)

    	}else{
    		cb(new Error('1'));//创建错误信息
    	}
    }
});



var upload = multer({
    storage: storage
});

module.exports = upload;