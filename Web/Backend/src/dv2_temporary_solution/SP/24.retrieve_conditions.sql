DROP PROCEDURE IF EXISTS `retrieve_conditions`;

DELIMITER $$

CREATE PROCEDURE `retrieve_conditions` ()
BEGIN
    SELECT * FROM dv2_condition;
END$$

DELIMITER ;
