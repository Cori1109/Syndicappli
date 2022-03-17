-- ----------------------------
-- Table structure for dv2_challenge_condition
-- ----------------------------
DROP TABLE IF EXISTS `dv2_challenge_condition`;
CREATE TABLE `dv2_challenge_condition` (
  `cc_id` int(11) NOT NULL AUTO_INCREMENT,
  `challenge_id` int(11) NOT NULL COMMENT 'dv2_challenge.challenge_id',
  `condition_id` int(11) NOT NULL COMMENT 'dv2_condition.condition_id',
  PRIMARY KEY (`cc_id`),
  UNIQUE(`challenge_id`, `condition_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dv2_challenge_condition
-- ----------------------------
INSERT INTO `dv2_challenge_condition` (`challenge_id`, `condition_id`) VALUES 
(1 , 1);