/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : turing_node

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2018-12-12 12:11:07
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for listmax_test_list_v4
-- ----------------------------
DROP TABLE IF EXISTS `listmax_test_list_v4`;
CREATE TABLE `listmax_test_list_v4` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `test_language` varchar(15) NOT NULL DEFAULT '',
  `test_user_score` int(10) DEFAULT NULL,
  `test_system_score` int(10) DEFAULT NULL,
  `test_source` varchar(50) NOT NULL DEFAULT '',
  `test_time` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;
