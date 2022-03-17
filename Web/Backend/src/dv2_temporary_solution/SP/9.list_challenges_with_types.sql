CREATE PROCEDURE `list_challenges_with_types`(
	IN filterType TINYINT,
    IN filterInOrder TINYINT,
    IN filterActive TINYINT,
    IN filterOneShot TINYINT
)
BEGIN
	SELECT * FROM dv2_challenge_type JOIN dv2_challenge ON dv2_challenge.challenge_type_id = dv2_challenge_type.challenge_type_id
    	WHERE
		(filterType IS NULL OR dv2_challenge.challenge_type_id = filterType) AND
        (filterInOrder IS NULL OR inOrder = filterInOrder) AND
        (filterActive IS NULL OR active = filterActive) AND
		(filterOneShot IS NULL OR one_shot = filterOneShot);
END