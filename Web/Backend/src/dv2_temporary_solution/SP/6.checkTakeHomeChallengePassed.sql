CREATE PROCEDURE `checkTakeHomeChallengePassed`(
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
    -- if user has not submitted take home challenge that has a build status of true
    ELSEIF NOT EXISTS
            (SELECT cl4.id
            FROM challenge_list_v4 cl4
            WHERE cl4.uid = userId AND
                cl4.app_name != '' AND
                cl4.source_code != '' AND
                (challengeId IS NULL OR cl4.challenge_type = challengeId)
                /*AND
                cl4.host_link != '' AND
                cl4.build_status = 1*/)
        THEN
            SET result = FALSE;
    END IF;
    SELECT result;
END