DROP PROCEDURE IF EXISTS `create_job`;

DELIMITER $$

CREATE PROCEDURE `create_job`(IN jobTitle VARCHAR(500), IN jobDescription TEXT, IN jobTypeId TINYINT, IN jobLengthId TINYINT, IN jobLevelId TINYINT, IN jobDeadline DATETIME, IN jobPostedBy INT, IN jobClientId INT, IN jobCategories VARCHAR(500), IN jobSkills VARCHAR(500), IN specialCondition TINYINT)
BEGIN
	INSERT INTO dv2_job(job_title, job_description, job_type_id, job_length_id, job_level_id, job_deadline, job_posted_by, job_client_id, job_categories, job_skills, special_condition)
    VALUES(jobTitle, jobDescription, jobTypeId, jobLengthId, jobLevelId, jobDeadline, jobPostedBy, jobClientId, jobCategories, jobSkills, specialCondition);
    SELECT LAST_INSERT_ID();
END$$

DELIMITER ;


DROP PROCEDURE IF EXISTS `update_job`;

DELIMITER $$

CREATE DEFINER=`root`@`%` PROCEDURE `update_job`(IN jobId INT, IN jobTitle VARCHAR(500), IN jobDescription TEXT, IN jobTypeId TINYINT, IN jobLengthId TINYINT, IN jobLevelId TINYINT, IN jobDeadline DATETIME, IN jobPostedBy INT, IN jobClientId INT, IN jobCategories VARCHAR(500), IN jobSkills VARCHAR(500), IN newactive TINYINT(1), IN specialCondition TINYINT)
BEGIN
	UPDATE dv2_job
    SET job_title = jobTitle, job_description = jobDescription, job_type_id = jobTypeId, job_length_id = jobLengthId,
    job_level_id = jobLevelId, job_deadline = jobDeadline, job_posted_by = jobPostedBy, job_client_id = jobClientId, job_categories = jobCategories, job_skills = jobSkills,
    active = newactive, special_condition = specialCondition
    WHERE job_id = jobId;

    SELECT jobId AS job_id;
END$$

DELIMITER ;