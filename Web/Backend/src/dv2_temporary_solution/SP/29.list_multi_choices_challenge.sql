ALTER TABLE dv2_challenge ADD COLUMN all_choices INTEGER DEFAULT 0;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `list_multi_choices_challenge`(IN startFrom INT, IN numberOfRows INT)
BEGIN
	SELECT challenge_id, challenge_name, challenge_duration, one_shot, all_choices FROM dv2_challenge
	WHERE 
		all_choices = 1 AND active = 1
  LIMIT startFrom, numberOfRows;
  SELECT COUNT(*) as total FROM dv2_challenge WHERE all_choices = 1 AND active = 1;
END$$
DELIMITER ;