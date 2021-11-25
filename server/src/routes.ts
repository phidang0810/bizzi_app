var express = require('express')
var router = express.Router()
var homeController = require('./controllers/HomeController');


router.post("/refresh_token", homeController.refreshToken);
module.exports = router