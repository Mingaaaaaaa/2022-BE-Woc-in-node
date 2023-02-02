var express = require('express');
var router = express.Router();
const controller = require('.././controller')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/a', function (req, res, next) {
  res.send(" a sucessfully!")
});

router.post('/login', controller.login);

module.exports = router;
