DROP PROCEDURE IF EXISTS `checkProjectPlanPassed`;

DELIMITER $$

CREATE PROCEDURE `checkProjectPlanPassed` (
	IN userId INT(11),
    IN challengeId INT(11),
    IN jobId INT(11)
)
BEGIN
    DECLARE result BOOLEAN DEFAULT TRUE;
    -- if user_id is null
    IF userId IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'user_id [arg1] cannot be null!';
    -- if challenge_id and job_id are both null
    ELSEIF challengeId IS NULL AND jobId IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'challenge_id [arg2] and job_id [arg3] cannot both be null!';
    -- if user has not submitted project plan
    ELSEIF NOT EXISTS
            (SELECT developer_id
            FROM developer_product_design
            WHERE developer_id = userId AND answer_file != '')
        THEN
            SET result = FALSE;
    END IF;
    SELECT result;
END$$

DELIMITER ;


-- call checkProjectPlanPassed(158028, 1, null);