var express = require('express');
var router = express.Router();
var db = require('../queries');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'WebApi basic with PGSQL' });
});

// Login endpoint
router.post('/login', db.LoginCredentials);

// Users API REST
router.get('/api/users', db.getList);
router.get('/api/users/:id', db.getOne);
router.post('/api/users', db.Create);
router.put('/api/users/:id', db.Edit);
router.delete('/api/users/:id', db.Delete);

module.exports = router;
