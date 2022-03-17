CREATE PROCEDURE `checkTakeHomeChallengePassedWithOutRes`(
	IN userId INT(11),
    IN challengeId INT(11),
	OUT res TINYINT
)
BEGIN
    DECLARE result BOOLEAN DEFAULT TRUE;
    IF NOT EXISTS
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

    SET res = result;
END