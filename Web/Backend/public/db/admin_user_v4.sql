/*
Navicat MySQL Data Transfer

Source Server         : Local
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : turing_node

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2018-12-05 14:44:30
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for admin_user_v4
-- ----------------------------
DROP TABLE IF EXISTS `admin_user_v4`;
CREATE TABLE `admin_user_v4` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(20) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of admin_user_v4
-- ----------------------------
INSERT INTO `admin_user_v4` VALUES ('1', 'admin', '$2a$10$ST09Uk40reTI2kf8Aw0FEeqlT88v2LR1IoJUGVHK4qn88GkACk0/m', '2018-12-05 12:31:57', '2018-12-05 14:41:47');
