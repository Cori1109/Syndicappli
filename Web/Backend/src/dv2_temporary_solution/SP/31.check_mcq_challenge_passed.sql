DROP PROCEDURE IF EXISTS `check_mcq_challenge_passed`;

DELIMITER $$

CREATE PROCEDURE `check_mcq_challenge_passed` (
	IN userId INT(11),
    IN challengeId INT(11),
    IN passScore FLOAT(5, 2),
    OUT res TINYINT
)
BEGIN
    IF NOT EXISTS (
            SELECT chs.submit_id
            FROM dv2_challenge_submit chs
            WHERE chs.user_id = userId
                AND chs.challenge_id = challengeId
                AND total_score_by_problem >= FLOOR(passScore) -- currently need to pass pass_score number of problems set on dv2_condition
        )
    THEN SET res = 0;
    ELSE SET res = 1;
    END IF;
END$$

DELIMITER ;


-- call check_mcq_challenge_passed(158026, 7, 4, @res);
-- select @res;