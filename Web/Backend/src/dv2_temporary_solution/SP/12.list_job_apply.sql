CREATE PROCEDURE `list_job_apply`(IN keyword VARCHAR(250), IN skillId SMALLINT, IN startFrom INT, IN numberOfRows INT)
BEGIN
	DECLARE kwLength TINYINT;
    
	IF keyword IS NULL THEN
        SELECT dj.job_title, dj.job_id, da.apply_date, u.id, u.full_name, u.email, dj.job_skills FROM dv2_job_apply da JOIN user_list_v4 u ON da.user_id = u.id JOIN dv2_job dj ON dj.job_id = da.job_id
        WHERE (skillId IS NULL OR (FIND_IN_SET(skillId, job_skills) <> 0)) AND active = 1
        ORDER BY da.apply_date DESC
        LIMIT startFrom, numberOfRows;
        
        SELECT COUNT(*) AS total FROM dv2_job
        WHERE (skillId IS NULL OR (FIND_IN_SET(skillId, job_skills) <> 0)) AND active = 1;
	ELSE
		SET kwLength = LENGTH(keyword);
        IF kwLength >= 5 THEN
			SELECT dj.job_title, dj.job_id, da.apply_date, u.id, u.full_name, u.email, dj.job_skills FROM dv2_job_apply da JOIN user_list_v4 u ON da.user_id = u.id JOIN dv2_job dj ON dj.job_id = da.job_id
			WHERE (job_title LIKE CONCAT('%', keyword, '%')
            OR MATCH(job_description) AGAINST (keyword IN NATURAL LANGUAGE MODE))
            AND (skillId IS NULL OR (FIND_IN_SET(skillId, job_skills) <> 0)) AND active = 1
            ORDER BY da.apply_date DESC
			LIMIT startFrom, numberOfRows;
            
            
			SELECT COUNT(*) AS total  FROM dv2_job_apply da JOIN user_list_v4 u ON da.user_id = u.id JOIN dv2_job dj ON dj.job_id = da.job_id
			WHERE (job_title LIKE CONCAT('%', keyword, '%')
            OR MATCH(job_description) AGAINST (keyword IN NATURAL LANGUAGE MODE))
            AND (skillId IS NULL OR (FIND_IN_SET(skillId, job_skills) <> 0)) AND active = 1;
        ELSE
			SELECT dj.job_title, dj.job_id, da.apply_date, u.id, u.full_name, u.email, dj.job_skills FROM dv2_job_apply da JOIN user_list_v4 u ON da.user_id = u.id JOIN dv2_job dj ON dj.job_id = da.job_id
			WHERE job_title LIKE CONCAT('%', keyword, '%')
            AND (skillId IS NULL OR (FIND_IN_SET(skillId, job_skills) <> 0)) AND active = 1
            ORDER BY da.apply_date DESC
			LIMIT startFrom, numberOfRows;
            
			SELECT COUNT(*) AS total  FROM dv2_job_apply da JOIN user_list_v4 u ON da.user_id = u.id JOIN dv2_job dj ON dj.job_id = da.job_id
			WHERE job_title LIKE CONCAT('%', keyword, '%')
            AND (skillId IS NULL OR (FIND_IN_SET(skillId, job_skills) <> 0)) AND active = 1;
        END IF;       
		
    END IF;
END