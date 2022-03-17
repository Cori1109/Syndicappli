DROP PROCEDURE IF EXISTS `get_submitted_challenge_with_info`;

DELIMITER $$

CREATE PROCEDURE `get_submitted_challenge_with_info` (
	IN submit_id INT(11)
)
BEGIN
    SELECT ch_sub.submit_time,
        ch_sub.total_score_by_problem,
        ch_sub.total_score_by_cases,
        ch_sub.total_time,
        prog_lang.language_name,
        prog_lang.monaco_map,
        prog_lang.compile_url,
        prob_sub_t.case_execution_time,
        prob_sub.content,
        prob_sub.answer,
        prob.type,
        ch.challenge_name,
        prob.problem_id,
        ch_sub.submit_id,
        ch_prob.challenge_problem_id,
        prob_sub.problem_submit_id,
        prob_sub_t.problem_submit_time_id,
        prog_lang.programming_language_id,
        prob.problem_id,
        ch.challenge_id,
        (SELECT
            CASE WHEN user.full_name IS NOT NULL THEN user.full_name ELSE user.email END
            FROM user_list_v4 user
            WHERE user.id = ch_sub.user_id
        ) AS dev_name
    FROM dv2_challenge_submit ch_sub
        JOIN dv2_challenge_problem ch_prob ON ch_sub.challenge_id = ch_prob.challenge_id
        JOIN dv2_problem_submit prob_sub ON ch_prob.problem_id = prob_sub.problem_id
        -- dv2_problem_submit_time shouldn't be null bcz each problem takes some time
        -- not sure if we are storing time in this table or dv2_challenge_submit / dv2_problem_submit
        LEFT JOIN dv2_problem_submit_time prob_sub_t ON prob_sub.problem_submit_id = prob_sub_t.problem_submit_id
        JOIN dv2_programming_language prog_lang ON prog_lang.programming_language_id = prob_sub.programming_language_id
        JOIN dv2_problem prob ON prob.problem_id = prob_sub.problem_id
        JOIN dv2_challenge ch ON ch.challenge_id = ch_prob.challenge_id
    WHERE ch_sub.submit_id = submit_id
        AND prob_sub.submit_id = submit_id
				AND prob_sub.content IS NOT NULL /* SOMETIMES THIS CONTENT CAN BE NULL */
    ORDER BY ch_prob.order ASC;
END$$

DELIMITER ;


-- call get_submitted_challenge_with_info(41);