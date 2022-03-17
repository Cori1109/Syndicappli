/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : turing_node

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2019-03-04 19:45:56
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for challenge_type_v4
-- ----------------------------
DROP TABLE IF EXISTS `challenge_type_v4`;
CREATE TABLE `challenge_type_v4` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `challenge_name` varchar(30) NOT NULL,
  `challenge_description` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of challenge_type_v4
-- ----------------------------
INSERT INTO `challenge_type_v4` VALUES ('1', 'Frontend', 'Front End Engineer Challenge');
INSERT INTO `challenge_type_v4` VALUES ('2', 'Full Stack', 'Full Stack Engineer Challenge');
INSERT INTO `challenge_type_v4` VALUES ('3', 'Backend', 'Backend Engineer Challenge');
INSERT INTO `challenge_type_v4` VALUES ('4', 'Devops', 'Devops Enginner Challenge');
INSERT INTO `challenge_type_v4` VALUES ('5', 'Mobile', 'Mobile Engineer Challenge');
INSERT INTO `challenge_type_v4` VALUES ('6', 'UI/UX', 'UI/UX Engineer Challenge');
