CREATE PROCEDURE `checkCompletedChallenge`(
	IN userId INT(11),
    IN challengeIdList VARCHAR(100),
    IN passScore FLOAT(5, 2),
    IN total INT(50)
)
BEGIN
    DECLARE cur_ind INT(50) DEFAULT 0;
    DECLARE cur_chl_id VARCHAR(3);
    DECLARE failing_chls VARCHAR(100) DEFAULT '';
    DECLARE qry VARCHAR(500) DEFAULT '';
    DECLARE sp_res TINYINT;
	DECLARE challengeType TINYINT;

    -- if user_id is null
    IF userId IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'user_id [arg1] cannot be null!';
    ELSE
        WHILE cur_ind < total DO
            SET cur_chl_id = substring_index(substring_index(challengeIdList, ',', cur_ind + 1), ',', -1);

            IF (SELECT all_choices FROM dv2_challenge WHERE challenge_id = cur_chl_id) = 0
            THEN
				SELECT challenge_type_id FROM dv2_challenge WHERE challenge_id = cur_chl_id INTO challengeType;
				IF challengeType = 3 THEN
					CALL checkTakeHomeChallengePassedWithOutRes(userId, cur_chl_id, @res);
                ELSE
					CALL check_coding_challenge_passed(userId, cur_chl_id, passScore, @res);   -- sp for checking coding challenge pass condition
                END IF;
            ELSE CALL check_mcq_challenge_passed(userId, cur_chl_id, passScore, @res);      -- sp for checking mcq challenge pass condition
            END IF;                                                                         -- add more conditions as needed

            SELECT @res INTO sp_res;                                                        -- should return 1 if passed, 0 if failed

            IF challengeType != 3 AND NOT EXISTS
                    (SELECT submit_id
                    FROM dv2_challenge_submit chs
                    WHERE chs.user_id = userId
                        AND chs.challenge_id = cur_chl_id
                        AND sp_res = 1)
                THEN
                    SET failing_chls = CONCAT(failing_chls, cur_chl_id);
                    IF cur_ind != total - 1 THEN
                        SET failing_chls = CONCAT(failing_chls, ',');
                    END IF;
            END IF;

            SET cur_ind = cur_ind + 1;
        END WHILE;
    END IF;

    IF failing_chls = '' THEN
        SELECT FALSE AS result;
    ELSE
        SET @qry = CONCAT('SELECT GROUP_CONCAT(challenge_name SEPARATOR ", ") AS result FROM dv2_challenge WHERE challenge_id IN', '(', failing_chls, ')');

        PREPARE stmt FROM @qry;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END