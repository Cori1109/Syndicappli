/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : turing_node

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2018-11-27 18:40:09
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for test_list_v4
-- ----------------------------
DROP TABLE IF EXISTS `test_list_v4`;
CREATE TABLE `test_list_v4` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT 'user_list_v4.id',
  `test_language` varchar(15) NOT NULL DEFAULT '',
  `test_user_score_palindrome` int(10) DEFAULT NULL,
  `test_system_score_palindrome` int(10) DEFAULT NULL,
  `test_time_palindrome` int(10) DEFAULT NULL,
  `test_source_palindrome` varchar(50) NOT NULL DEFAULT '',
  `test_user_score_hackland` int(10) DEFAULT NULL,
  `test_system_score_hackland` int(10) DEFAULT NULL,
  `test_time_hackland` int(10) DEFAULT NULL,
  `test_source_hackland` varchar(50) NOT NULL DEFAULT '',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;
