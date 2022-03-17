ALTER TABLE `dv2_challenge_submit` ADD COLUMN grade decimal(10, 1) DEFAULT 0;

DROP PROCEDURE IF EXISTS `update_challenge_grade`;

DELIMITER $$

CREATE PROCEDURE `update_challenge_grade` (
    IN submitId INT,
    IN developerGrade decimal(10, 1)
)
BEGIN
    UPDATE `dv2_challenge_submit`
    SET grade = developerGrade
    WHERE submit_id = submitId;

    SELECT submitId AS submit_id;
END$$

DELIMITER ;