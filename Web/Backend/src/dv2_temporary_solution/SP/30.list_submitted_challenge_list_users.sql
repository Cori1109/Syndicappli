CREATE DEFINER=`root`@`%` PROCEDURE `list_submitted_challenge_list_users`(
    IN startFrom INT,
    IN numberOfRows INT,
    IN challenge_id INT,
    IN orderby varchar(255)
)
BEGIN
	SET @ROW_NUMBER = 1;

    CREATE TEMPORARY TABLE cte
    SELECT DISTINCT user.id, user.email, CASE WHEN user.full_name IS NOT NULL THEN user.full_name ELSE user.email END as name,
		ch.*,
        (@ROW_NUMBER :=
			CASE
				WHEN @USER_ID = user.id THEN @ROW_NUMBER + 1
			ELSE 1
            END
		) AS rn,
        @USER_ID := user.id AS partition_user_id

        FROM (SELECT * FROM dv2_challenge_submit ORDER BY user_id,
			CASE WHEN orderby = 'top-challenge-score' THEN total_score_by_problem
				 WHEN orderby = 'top-test-cases-score' THEN total_score_by_cases
                 ELSE submit_time END DESC) AS ch

        JOIN user_list_v4 user ON user.id = ch.user_id

        WHERE challenge_id IS NULL OR ch.challenge_id =  challenge_id;

    SET @STMT =
    CASE WHEN orderby = 'top-challenge-score' THEN
			'SELECT * FROM cte WHERE rn = 1 ORDER BY total_score_by_problem DESC LIMIT ?,?'
		 WHEN orderby = 'top-test-cases-score' THEN
			'SELECT * FROM cte WHERE rn = 1 ORDER BY total_score_by_cases DESC LIMIT ?,?'
		 ELSE
			'SELECT * FROM cte WHERE rn = 1 ORDER BY submit_time DESC LIMIT ?,?'
	END;

    PREPARE runStmt FROM @STMT;

    SET @start = startFrom;
    SET @num = numberOfRows;
    EXECUTE runStmt USING @start, @num;

    SELECT COUNT(DISTINCT user.id) AS total
    FROM dv2_challenge_submit ch LEFT JOIN user_list_v4 user
    ON user.id = ch.user_id;

    DEALLOCATE PREPARE runStmt;
    DROP TEMPORARY TABLE cte;
END