DELIMITER $$
CREATE PROCEDURE `update_system_design_list_score`(
  IN systemId INT,
  IN systemScore decimal(10,1)
)
BEGIN
  UPDATE `developer_system_design`
  SET score = systemScore
  WHERE id = systemId;

  SELECT * FROM `developer_system_design`;
END$$
DELIMITER ;
