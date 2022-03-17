DELIMITER $$
CREATE PROCEDURE `update_product_design_list_score`(
  IN productId INT,
  IN productScore decimal(10,1)
)
BEGIN
  UPDATE `developer_product_design`
  SET score = productScore
  WHERE id = productId;

  SELECT * FROM `developer_product_design`;
END$$
DELIMITER ;
