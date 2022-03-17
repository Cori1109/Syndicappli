DROP PROCEDURE IF EXISTS `set_additional_parameters_for_condition`;

DELIMITER $$

CREATE PROCEDURE `set_additional_parameters_for_condition` (
	IN forType VARCHAR(25), 
	IN id INT(11),
	IN conditionId INT(11), 
	IN additional_params VARCHAR(100)
)
BEGIN
	IF forType = 'challenge' THEN
		UPDATE dv2_challenge_condition SET additional_parameters = additional_params WHERE challenge_id = id AND condition_id = conditionId;
	ELSE
		UPDATE dv2_job_condition SET additional_parameters = additional_params WHERE job_id = id AND condition_id = conditionId;
	END IF;
END$$

DELIMITER ;

-- call set_additional_parameters_for_condition('challenge', 1, 6, '2,7');