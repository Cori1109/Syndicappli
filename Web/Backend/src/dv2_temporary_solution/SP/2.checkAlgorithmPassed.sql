DROP PROCEDURE IF EXISTS `checkAlgorithmPassed`;

DELIMITER $$

CREATE PROCEDURE `checkAlgorithmPassed` (
		IN userId INT(11),
    IN challengeId INT(11),
    IN jobId INT(11),
    IN passScore FLOAT(5, 2)
)
BEGIN
    DECLARE result BOOLEAN DEFAULT TRUE;
    -- if user_id is null
    IF userId IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'user_id [arg1] cannot be null!';
		-- no need to check for challenge_id, fixed = 1, and no need job_id
		-- keep the parameters the same across all SP for easier to implement
    ELSE IF NOT EXISTS
            (SELECT submit_id
            FROM dv2_challenge_submit ch_s
            WHERE ch_s.user_id = userId
						AND ch_s.challenge_id = 1 /* Fix. We can esily change this because its in DB */
            AND ch_s.total_score_by_cases > 0) /* Only need one test case passed, also can easily change */
        THEN
            SET result = FALSE;
    		END IF;
		END IF;

    SELECT result;
END$$

DELIMITER ;