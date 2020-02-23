var express = require('express');
var router = require('./control/router.js');
var body = require('body-parser').urlencoded({extended:false})

var app = express();
app.use(body);
app.listen(3000,()=>{
	console.log('success!')
})

router(app);


