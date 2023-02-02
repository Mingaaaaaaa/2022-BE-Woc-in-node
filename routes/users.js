var express = require('express');
const controller = require('.././controller')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource  //');
});

router.post('/add', controller.add);

router.post('/delete',  controller.Delete);

router.post('/update', controller.update);

router.get('/find',  controller.find);

router.get('/logout', controller.logout);

module.exports = router;
