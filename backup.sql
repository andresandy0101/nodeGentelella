-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.1.36-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win32
-- HeidiSQL Versión:             9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Volcando estructura de base de datos para gantelella
CREATE DATABASE IF NOT EXISTS `gantelella` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `gantelella`;

-- Volcando estructura para tabla gantelella.g01_users
CREATE TABLE IF NOT EXISTS `g01_users` (
  `g01_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `g01_user` text NOT NULL COMMENT 'User name',
  `g01_password` text NOT NULL COMMENT 'Password',
  `g01_email` text NOT NULL COMMENT 'Email',
  PRIMARY KEY (`g01_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla gantelella.g02_profile
CREATE TABLE IF NOT EXISTS `g02_profile` (
  `g02_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `g01_id` int(11) NOT NULL COMMENT 'User',
  `g02_name` text COMMENT 'Name',
  `g02_image` text COMMENT 'Img',
  PRIMARY KEY (`g02_id`),
  KEY `FK1_g02_g01` (`g01_id`),
  CONSTRAINT `FK1_g02_g01` FOREIGN KEY (`g01_id`) REFERENCES `g01_users` (`g01_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla gantelella.t01_general
CREATE TABLE IF NOT EXISTS `t01_general` (
  `t01_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `t01_text` text COMMENT 'Texto',
  `t01_area` text COMMENT 'Area',
  `t01_number` int(11) DEFAULT NULL COMMENT 'Numerico',
  `t01_password` text COMMENT 'Contraseña',
  `t01_email` text COMMENT 'Correo electronico',
  `t01_date` date DEFAULT NULL COMMENT 'Date',
  `t01_time` time DEFAULT NULL COMMENT 'Time',
  `t01_timestamp` timestamp NULL DEFAULT NULL COMMENT 'Full date',
  PRIMARY KEY (`t01_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
