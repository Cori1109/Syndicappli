/*
Navicat MySQL Data Transfer

Source Server         : node.turing.website
Source Server Version : 50724
Source Host           : 52.53.171.50:3306
Source Database       : turing_node

Target Server Type    : MYSQL
Target Server Version : 50724
File Encoding         : 65001

Date: 2018-11-08 02:20:40
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for submit_notification_v4
-- ----------------------------
DROP TABLE IF EXISTS `submit_notification_v4`;
CREATE TABLE `submit_notification_v4` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT 'user_list_v4.id',
  `after_15mins` datetime NOT NULL,
  `after_3days` datetime NOT NULL,
  `after_6days` datetime NOT NULL,
  `after_9days` datetime NOT NULL,
  `sent_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0: init,  1: sent email after 15 mins, 2: sent email after 3 days 3: sent email after 6days, 4: sent email after 9days, 5: supressions',
  `unsubscribed` tinyint(1) NOT NULL DEFAULT '0',
  `supressions` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0: not failed , 1: failed',
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `unsubscribed` (`unsubscribed`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;
