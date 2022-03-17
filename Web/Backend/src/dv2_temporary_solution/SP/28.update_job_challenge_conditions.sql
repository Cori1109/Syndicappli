DROP PROCEDURE IF EXISTS `update_job_challenge_conditions`;

DELIMITER $$

CREATE PROCEDURE `update_job_challenge_conditions` (
	IN id INT(11),
    IN tbl_type VARCHAR(30),
    IN conditions VARCHAR(1000),
    IN total INT(250)
)
BEGIN
    DECLARE cur_ind INT(250) DEFAULT 0;
    DECLARE qry VARCHAR(500) DEFAULT '';
    DECLARE cur_ind_cnd VARCHAR(3);

    IF tbl_type = 'job' THEN
        DELETE FROM dv2_job_condition WHERE job_id = id;
        SET qry  =  'INSERT INTO dv2_job_condition (job_id, condition_id) VALUES ';
    ELSE
        DELETE FROM dv2_challenge_condition WHERE job_id = id;
        SET qry  =  'INSERT INTO dv2_challenge_condition (challenge_id, condition_id) VALUES ';
    END IF;

    WHILE cur_ind < total DO
        SET cur_ind_cnd = substring_index(substring_index(conditions, ',', cur_ind + 1), ',', -1);
        SET qry = CONCAT(qry, '(', id, ',', cur_ind_cnd, ')');
        IF cur_ind = total - 1 THEN
            SET qry = CONCAT(qry, ';');
        ELSE
            SET qry = CONCAT(qry, ',');
        END IF;
        SET cur_ind = cur_ind + 1;
    END WHILE;

    SET @qry = CONCAT(qry, '');
    PREPARE stmt FROM @qry;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;


-- call update_job_challenge_conditions(6, 'job', '6', 1);