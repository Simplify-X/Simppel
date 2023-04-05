/*
SQLyog Ultimate v12.09 (64 bit)
MySQL - 5.7.33 : Database - x
*********************************************************************
*/


/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`x` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `x`;

/*Table structure for table `advertisement` */

DROP TABLE IF EXISTS `advertisement`;

CREATE TABLE `advertisement` (
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `account_id` varchar(36) DEFAULT NULL,
  `target_audience` varchar(255) DEFAULT NULL,
  `advertisement_location` varchar(255) DEFAULT NULL,
  `advertisement_type` varchar(255) DEFAULT NULL,
  `advertisement_mood` varchar(255) DEFAULT NULL,
  `product_type` varchar(255) DEFAULT NULL,
  `advertisement_length` varchar(255) DEFAULT NULL,
  `language_text` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `advertisement` */

/*Table structure for table `hibernate_sequence` */

DROP TABLE IF EXISTS `hibernate_sequence`;

CREATE TABLE `hibernate_sequence` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `hibernate_sequence` */

insert  into `hibernate_sequence`(`next_val`) values (69);

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `role` tinyint(1) DEFAULT '0',
  `user_id` varchar(36) NOT NULL,
  `account_id` varchar(36) NOT NULL DEFAULT 'Null',
  `user_active` tinyint(1) DEFAULT '0',
  `advertisement_enabled` tinyint(1) DEFAULT '1',
  `is_image_upload_feature_enabled` tinyint(1) DEFAULT '1',
  `is_advertisement_import_enabled` tinyint(1) DEFAULT '0',
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `users` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
