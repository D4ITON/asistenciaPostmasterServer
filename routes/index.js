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
router.get('/api/users/:id', db.getOneCodigo);
router.post('/api/users', db.Create);
router.put('/api/users/:id', db.Edit);
router.delete('/api/users/:id', db.Delete);
router.delete('/api/users', db.TruncateTableUsuarios);
// Asistencias API REST
router.get('/api/asistencias', db.getAsistencias);
router.get('/api/obtieneasistentes', db.obtieneasistentes);
router.post('/api/marcaasistencia', db.marcaAsistencia);
router.delete('/api/asistencias', db.TruncateTableAsistencias);
// reporte asistencia
router.get('/api/reporteasistencias', db.listar_reporteasistencia);

module.exports = router;
