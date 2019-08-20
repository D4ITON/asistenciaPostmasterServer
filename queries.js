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
	db.any("select * from usuarios")
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
function getOne(req, res, next){
	db.any("select * from usuarios where id='"+req.params.id+"'")
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
	db.none("insert into usuarios(nombre) values (${nombre})", req.body)
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

module.exports = {
	LoginCredentials: LoginCredentials,
	// usuarios
	getList: getList,
	getOne: getOne,
	Create: Create,
	Edit: Edit,
	Delete: Delete,
}