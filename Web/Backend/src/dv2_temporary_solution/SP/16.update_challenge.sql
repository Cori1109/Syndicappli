CREATE PROCEDURE `update_challenge`(
	IN challengeId INT(11),
	IN challengeType TINYINT(4),
    IN challengeName  VARCHAR(255),
    IN challengeDescription TEXT,
    IN duration  INT(11),
    IN inOrder TINYINT(4),
    IN oneShot TINYINT(4),
    IN active TINYINT(4))
BEGIN
	UPDATE `dv2_challenge`
		SET
			challenge_type_id = challengeType,
            challenge_name = challengeName,
            challenge_description = challengeDescription,
            challenge_duration = duration,
            inOrder = inOrder,
            one_shot = oneShot,
            active = active
	WHERE challenge_id = challengeId;

    SELECT challengeId AS challenge_id;
END