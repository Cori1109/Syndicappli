SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for dv2_condition
-- ----------------------------
DROP TABLE IF EXISTS `dv2_condition`;
CREATE TABLE `dv2_condition` (
  `condition_id` int(11) NOT NULL AUTO_INCREMENT,
  `condition_name` varchar(100) NOT NULL,
  `check_function` varchar(150) NOT NULL,
  `sp_or_js` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`condition_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dv2_condition
-- ----------------------------
INSERT INTO `dv2_condition` (`condition_name`, `check_function`, `sp_or_js`) VALUES 
('COMPLETE_PROFILE', 'checkProfileCompleted', 0),
('ALGORITHM_CHALLENGE', 'checkAlgorithmPassed', 0),
('SYSTEM_DESIGN', 'checkSystemDesignPassed', 0),
('PROJECT_PLANNING', 'checkProjectPlanPassed', 0),
('TAKE_HOME_CHALLENGE', 'checkTakeHomeChallengePassed', 0);