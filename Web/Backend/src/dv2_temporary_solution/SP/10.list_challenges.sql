DROP PROCEDURE IF EXISTS `list_challenges`;

DELIMITER $$

CREATE PROCEDURE `list_challenges`(
	IN filterType TINYINT,
    IN filterInOrder TINYINT,
    IN filterActive TINYINT,
    IN filterOneShot TINYINT,
    IN startFrom INT,
    IN numberOfRows INT
)
BEGIN
    DECLARE total INT;
    DECLARE l1 INT;
    DECLARE l2 INT;

    SELECT COUNT(*) INTO total FROM dv2_challenge;
    SELECT CASE WHEN startFrom IS NOT NULL THEN startFrom ELSE 0 END INTO l1;
    SELECT CASE WHEN numberOfRows IS NOT NULL THEN numberOfRows ELSE total END INTO l2;

	SELECT *, SUBSTRING(challenge_description, 1, 500) AS excontent FROM dv2_challenge
	WHERE
		(filterType IS NULL OR challenge_type_id = filterType) AND
        (filterInOrder IS NULL OR inOrder = filterInOrder) AND
        (filterActive IS NULL OR active = filterActive) AND
		(filterOneShot IS NULL OR one_shot = filterOneShot)
    LIMIT l1, l2;

    SELECT total;
END$$

DELIMITER ;

-- call list_challenges(null,null,null,null,1,2);
