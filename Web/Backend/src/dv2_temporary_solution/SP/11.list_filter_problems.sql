CREATE PROCEDURE `list_problems`(
	IN filterType INT,
    IN filterArea VARCHAR(255),
    IN filterCompanyUse VARCHAR(255),
    IN filterDifficulty INT
)
BEGIN
	SELECT *, SUBSTRING(content, 1, 500) AS excontent FROM dv2_problem
	WHERE
		(filterType IS NULL OR type = filterType) AND
        (filterArea IS NULL OR find_in_set(filterArea, areas) <> 0) AND
        (filterCompanyUse IS NULL OR find_in_set(filterCompanyUse, company_use) <> 0) AND
		(filterDifficulty IS NULL OR difficulty_id = filterDifficulty);
END