DROP PROCEDURE IF EXISTS `checkProfileCompleted`;

DELIMITER $$

CREATE PROCEDURE `checkProfileCompleted` (
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
    -- if user personal info is not complete
    ELSEIF NOT EXISTS
            (SELECT user_list_v4.id
            FROM submit_list_v4
                LEFT JOIN user_list_v4 ON submit_list_v4.uid = user_list_v4.id
                LEFT JOIN developer_detail ON user_list_v4.id = developer_detail.user_id
            WHERE
                user_list_v4.id = userId
                AND developer_detail.resume IS NOT NULL
                AND user_list_v4.full_name IS NOT NULL
                AND user_list_v4.email IS NOT NULL)
        THEN
            SET result = FALSE;
    -- if one or more user skills is not found
    ELSEIF NOT EXISTS
            (SELECT developer_id
            FROM tpm_developer_skill
                JOIN base_all_skills_v4 ON tpm_developer_skill.skill_id = base_all_skills_v4.id
            WHERE
                developer_id = userId)
        THEN
            SET result = FALSE;
    -- if one or more user professional experiences is not found
    ELSEIF NOT EXISTS
            (SELECT developer_id
            FROM developer_experience
            WHERE developer_id = userId)
        THEN
            SET result = FALSE;
    -- if one or more user education is not found
    ELSEIF NOT EXISTS
            (SELECT developer_id
            FROM developer_education
            WHERE developer_id = userId)
        THEN
            SET result = FALSE;
    END IF;
    SELECT result;
END$$

DELIMITER ;


-- call checkProfileCompleted(158028, 1, null);