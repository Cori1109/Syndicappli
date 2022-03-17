ALTER TABLE dv2_condition ADD COLUMN display_name VARCHAR(50) AFTER sp_or_js;
UPDATE dv2_condition SET display_name = REPLACE(LOWER(condition_name), '_', ' ');