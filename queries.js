var promise = require('bluebird');
var options = {
	promiseLib: promise
}
var pgp = require('pg-promise')(options)

var connectionString = 'postgres://postgres:123456@localhost:5432/asistenciapostmasterdb';
var db = pgp(connectionString);


/**
 * Comprueba que el usuario exista en la base de datos
 */
function LoginCredentials(req, res, next){

  	db.any("SELECT * FROM usuarios WHERE codigo = $1 AND contrasena = $2", [req.body.username, req.body.password])
  	.then(function(data){
  		if (Object.keys(data).length > 0) {
  			res.send({'success': true, 'message': data[0].codigo});
	  	}else{
	  		res.send({'success': false, 'message': 'User not found, please try again'});
	  	}
  	})
  	.catch(function(err){
		return next(err);
	})
}

function getList(req, res, next){
	db.any("SELECT * FROM usuarios")
	.then(function(data){
		res.status(200)
		.json({
			status: 'success',
			data: data,
			message: 'Retrived list'
		})
	})
	.catch(function(err){
		return next(err);
	})
}

// solicita un dato
function getOneCodigo(req, res, next){
	db.any("SELECT * FROM usuarios WHERE codigo='"+req.params.id+"'")
	.then(function(data){
		res.status(200)
		.json({
			status: 'success',
			data: data,
			message: 'Retrived list'
		})
	})
	.catch(function(err){
		return next(err);
	})
}

// POST inserta un nuevo usuario
function Create(req, res, next){
	db.none(
		"INSERT INTO usuarios(codigo, apellidos, nombres, contrasena, rol_id, inscrito) VALUES ($1, $2, $3, $4, $5, $6)",
		[ req.body.codigo, req.body.apellidos, req.body.nombres, req.body.contrasena, req.body.rol, req.body.inscrito])
	.then(function(data){
		res.status(200)
		.json({
			status: 'success',
			message: 'Add success a student'
		})
	})
	.catch(function(err){
		return next(err);
	})
}
function Edit(req, res, next){
	db.none("update usuarios set nombre = ${nombre} where id='"+req.params.id+"'", req.body)
	.then(function(data){
		res.status(200)
		.json({
			status: 'success',
			message: 'Updated success a student'
		})
	})
	.catch(function(err){
		return next(err);
	})
}
function Delete(req, res, next){
	db.none("delete from usuarios where id='"+req.params.id+"'")
	.then(function(data){
		res.status(200)
		.json({
			status: 'success',
			message: 'Deleted a student'
		})
	})
	.catch(function(err){
		return next(err);
	})
}

// truncate table usuarios and restar identity
function TruncateTableUsuarios(req, res, next){
	db.none("TRUNCATE usuarios RESTART IDENTITY")
	.then(function(data){
		res.status(200)
		.json({
			status: 'success',
			message: 'All data deleted'
		})
	})
	.catch(function(err){
		return next(err);
	})
}

/*
 * ASISTENCIAS API
 */

// obtiene todas las asistenciass
function getAsistencias(req, res, next){
	db.any("SELECT * FROM asistencias")
	.then(function(data){
		res.status(200)
		.json({
			status: 'success',
			data: data,
			message: 'Retrived list'
		})
	})
	.catch(function(err){
		return next(err);
	})
}

// truncate table asistencias and restar identity
function TruncateTableAsistencias(req, res, next){
	db.none("TRUNCATE asistencias RESTART IDENTITY")
	.then(function(data){
		res.status(200)
		.json({
			status: 'success',
			message: 'All data deleted'
		})
	})
	.catch(function(err){
		return next(err);
	})
}

// procedimiento almacenado marcar asistencia
function marcaAsistencia(req, res, next){
	db.func('marcaAsistencia', req.body.codigo)
    .then(function(data){
		res.status(200)
		.json({
			status: 'success',
			data: data[0],
			message: 'Operacion exitosa'
		})
	})
	.catch(function(err){
		return next(err);
	});
}

// vista que obtiene los datos de los asistentes
function obtieneasistentes(req, res, next){
	db.any("SELECT a.id, u.codigo, u.apellidos, u.nombres, to_char(a.hora, 'HH24:MI')AS hora FROM asistencias a INNER JOIN usuarios u ON a.user_id=u.id ORDER BY a.hora ASC")
	.then(function(data){
		res.status(200)
		.json({
			status: 'success',
			data: data,
			message: 'Obtiene asistentes'
		})
	})
	.catch(function(err){
		return next(err);
	});
}

module.exports = {
	LoginCredentials: LoginCredentials,
	// usuarios
	getList: getList,
	getOneCodigo: getOneCodigo,
	Create: Create,
	Edit: Edit,
	Delete: Delete,
	TruncateTableUsuarios: TruncateTableUsuarios,
	// asistencias
	getAsistencias: getAsistencias,
	TruncateTableAsistencias: TruncateTableAsistencias,
	marcaAsistencia: marcaAsistencia,
	obtieneasistentes: obtieneasistentes,
}