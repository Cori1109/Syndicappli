/*
Navicat MySQL Data Transfer

Source Server         : Local
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : turing_node

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2018-11-16 18:36:36
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for mail_dashboard_v4
-- ----------------------------
DROP TABLE IF EXISTS `mail_dashboard_v4`;
CREATE TABLE `mail_dashboard_v4` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `country` varchar(50) NOT NULL DEFAULT '',
  `first_name` varchar(50) NOT NULL DEFAULT '',
  `last_name` varchar(50) NOT NULL DEFAULT '',
  `email` varchar(100) NOT NULL DEFAULT '',
  `language` varchar(50) NOT NULL DEFAULT '',
  `date` varchar(30) NOT NULL,
  `sent_date` datetime NOT NULL,
  `sent_status` tinyint(1) NOT NULL DEFAULT '0',
  `is_tester` tinyint(1) NOT NULL DEFAULT '0',
  `is_validated` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0: undefined, 1: real 2: fake',
  `is_disposable_address` tinyint(1) DEFAULT NULL,
  `is_role_address` tinyint(1) DEFAULT NULL,
  `mailbox_verification` varchar(10) DEFAULT NULL,
  `is_valid` tinyint(1) DEFAULT NULL,
  `uploaded_date` datetime NOT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1794 DEFAULT CHARSET=utf8;
