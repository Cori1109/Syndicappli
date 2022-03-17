DROP PROCEDURE IF EXISTS `retrieve_challenge_job_conditions`;

DELIMITER $$

CREATE PROCEDURE `retrieve_challenge_job_conditions` (
    IN challengeId INT(11),
    IN jobId INT(11)
)
BEGIN
    IF challengeId IS NOT NULL THEN
        SELECT cnd.*, j_cnd.additional_parameters
        FROM dv2_challenge_condition j_cnd
            JOIN dv2_condition cnd ON j_cnd.condition_id = cnd.condition_id
        WHERE j_cnd.challenge_id = challengeId;
    ELSEIF jobId IS NOT NULL THEN
        SELECT cnd.*, j_cnd.additional_parameters
        FROM dv2_job_condition j_cnd
            JOIN dv2_condition cnd ON j_cnd.condition_id = cnd.condition_id
            JOIN dv2_job j ON j.job_id = j_cnd.job_id
        WHERE j_cnd.job_id = jobId
            AND j.special_condition = 1;
    END IF;
END$$

DELIMITER ;
