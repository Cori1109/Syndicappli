/*
Navicat MySQL Data Transfer

Source Server         : node.turing.website
Source Server Version : 50724
Source Host           : 52.53.171.50:3306
Source Database       : turing_node

Target Server Type    : MYSQL
Target Server Version : 50724
File Encoding         : 65001

Date: 2018-11-08 13:31:23
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for linkedin_list_v4
-- ----------------------------
DROP TABLE IF EXISTS `linkedin_list_v4`;
CREATE TABLE `linkedin_list_v4` (
  `lid` int(11) NOT NULL AUTO_INCREMENT,
  `luid` int(11) NOT NULL COMMENT 'user_list_v4.id',
  `lfirst_name` varchar(50) NOT NULL DEFAULT '',
  `llast_name` varchar(50) NOT NULL DEFAULT '',
  `luser_id` varchar(50) NOT NULL DEFAULT '',
  `lemail` varchar(50) NOT NULL DEFAULT '',
  `lprofile_link` varchar(100) NOT NULL DEFAULT '',
  `lheadline` varchar(100) NOT NULL DEFAULT '',
  `lsummary` varchar(1000) NOT NULL,
  `llocation` varchar(50) NOT NULL DEFAULT '',
  `lcountry_code` varchar(50) NOT NULL DEFAULT '',
  `lindustry` varchar(50) NOT NULL DEFAULT '',
  `lconnections` varchar(50) NOT NULL DEFAULT '',
  `lcompany` varchar(50) NOT NULL DEFAULT '',
  `lrole` varchar(50) NOT NULL DEFAULT '',
  `lstart_date` varchar(50) NOT NULL DEFAULT '',
  `lavatar_url` varchar(300) NOT NULL DEFAULT '',
  `lerror_code` varchar(100) NOT NULL DEFAULT '',
  `lcreated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lupdated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`lid`),
  KEY `luid` (`luid`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
