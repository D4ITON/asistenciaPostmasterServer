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
			INSERT INTO asistencias (user_id, asistio) VALUES ((SELECT id FROM usuarios WHERE codigo=$1),1);
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