/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : turing_node

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2019-03-28 10:48:43
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for challenge_list_v4
-- ----------------------------
DROP TABLE IF EXISTS `challenge_list_v4`;
CREATE TABLE `challenge_list_v4` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `app_name` varchar(100) NOT NULL DEFAULT '',
  `challenge_type` int(5) NOT NULL,
  `challenge_name` varchar(20) NOT NULL DEFAULT '',
  `challenge_language` varchar(20) NOT NULL DEFAULT '',
  `source_type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0: frontend 1:backend 2: mobile',
  `source_code` varchar(100) NOT NULL DEFAULT '',
  `host_link` varchar(100) NOT NULL DEFAULT '',
  `process_id` varchar(50) NOT NULL DEFAULT '',
  `github_link` varchar(100) NOT NULL DEFAULT '',
  `estimated_time` int(5) DEFAULT NULL,
  `send_date` timestamp NULL DEFAULT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1269 DEFAULT CHARSET=utf8;
