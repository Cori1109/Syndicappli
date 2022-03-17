CREATE PROCEDURE `list_job_with_count`(IN keyword VARCHAR(250), IN skillId SMALLINT, IN startFrom INT, IN numberOfRows INT)
BEGIN
	DECLARE kwLength TINYINT;

	IF keyword IS NULL THEN
		SELECT *, SUBSTRING(job_description, 1, 500) AS excontent FROM dv2_job
        WHERE (skillId IS NULL OR (FIND_IN_SET(skillId, job_skills) <> 0)) AND active = 1
        ORDER BY job_posted_date DESC
        LIMIT startFrom, numberOfRows;

        SELECT COUNT(*) AS total FROM dv2_job
        WHERE (skillId IS NULL OR (FIND_IN_SET(skillId, job_skills) <> 0)) AND active = 1;
	ELSE
		SET kwLength = LENGTH(keyword);
        IF kwLength >= 5 THEN
			SELECT *, SUBSTRING(job_description, 1, 500) AS excontent  FROM dv2_job
			WHERE (job_title LIKE CONCAT('%', keyword, '%')
            OR MATCH(job_description) AGAINST (keyword IN NATURAL LANGUAGE MODE))
            AND (skillId IS NULL OR (FIND_IN_SET(skillId, job_skills) <> 0)) AND active = 1
            ORDER BY job_posted_date DESC
			LIMIT startFrom, numberOfRows;

            SELECT COUNT(*) AS total FROM dv2_job
			WHERE (job_title LIKE CONCAT('%', keyword, '%')
            OR MATCH(job_description) AGAINST (keyword IN NATURAL LANGUAGE MODE))
            AND (skillId IS NULL OR (FIND_IN_SET(skillId, job_skills) <> 0)) AND active = 1;
        ELSE
			SELECT *, SUBSTRING(job_description, 1, 500) AS excontent  FROM dv2_job
			WHERE job_title LIKE CONCAT('%', keyword, '%')
            AND (skillId IS NULL OR (FIND_IN_SET(skillId, job_skills) <> 0)) AND active = 1
            ORDER BY job_posted_date DESC
			LIMIT startFrom, numberOfRows;

            SELECT COUNT(*) AS total FROM dv2_job
			WHERE job_title LIKE CONCAT('%', keyword, '%')
            AND (skillId IS NULL OR (FIND_IN_SET(skillId, job_skills) <> 0)) AND active = 1;
        END IF;

    END IF;
END