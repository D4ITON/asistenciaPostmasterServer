-- --------------------------------------------------------
-- --------------------------------------------------------
-- Host:                         localhost
-- Versión del servidor:         PostgreSQL 11.4
-- Autor:						 D4ITON
-- Created:						 21/08/2019
-- --------------------------------------------------------
-- --------------------------------------------------------

/** 
 *  Funcion que marca asistencia
 *  @param {Integer} codigo - codigo universitario ej: 2015119001
 *  @returns {Varchar} nombre - nombre usuario
 */

CREATE OR REPLACE FUNCTION marcaAsistencia(Integer)
	RETURNS Varchar AS
$body$
DECLARE
	nombre Varchar;
BEGIN
	nombre := (SELECT CONCAT(nombres,' ',apellidos) FROM usuarios WHERE codigo=$1);
	IF EXISTS (SELECT codigo from usuarios WHERE codigo=$1) THEN
		RAISE NOTICE 'Usuario existe';
		IF NOT EXISTS (select asistio from asistencias where user_id=(select id from usuarios where codigo=$1)) THEN
			-- marca asistencia
			INSERT INTO asistencias (user_id, asistio, hora) VALUES ((SELECT id FROM usuarios WHERE codigo=$1),true,NOW());
			RAISE NOTICE 'Asistencia marcada';
			RETURN nombre;
		ELSE
			RAISE NOTICE 'Usuario ya marco asistencia';
			RETURN CONCAT(nombre,' ya marco asistencia');
		END IF;
	ELSE
		RAISE NOTICE 'Usuario no registrado';
		RETURN 'Usuario no registrado';
	END IF;
END;
$body$
LANGUAGE 'plpgsql';

-- Ejecutar funcion de esta manera:
SELECT marcaAsistencia(2015119063);

/** 
 *  Vista que muestra a los asistentes
 *  @returns {smallint} id - codigo de asistencia
 *  @returns {integer} codigo - codigo de usuario
 *  @returns {Varchar} apellidos - apellidos de usuario
 *  @returns {Varchar} nombres - nombres de usuario
 */

CREATE OR REPLACE VIEW obtieneasistentes AS
SELECT a.id, u.codigo, u.apellidos, u.nombres, to_char(a.hora, 'HH24:MI')AS hora FROM asistencias a INNER JOIN usuarios u ON a.user_id=u.id ORDER BY a.hora ASC;

/** 
 *  Crea contraint unique al codigo de usuarios
 */
alter table usuarios
   add constraint UQ_usuarios_codigo
   unique (codigo);


/** 
 *  Crea funcion para mostrar reportes (pantalla inicio)
 */
CREATE OR REPLACE FUNCTION listar_reporteasistencia()
RETURNS SETOF bigint AS
$BODY$
BEGIN
    RETURN QUERY (SELECT  count(asistio) as asistentes FROM asistencias);
	RETURN QUERY (SELECT count(inscrito) as inscritos FROM usuarios);
	RETURN QUERY (SELECT count(id) as estudiantes FROM usuarios);
	
END
$BODY$ LANGUAGE 'plpgsql'


select listar_reporteasistencia()