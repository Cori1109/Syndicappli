INSERT INTO dv2_condition (condition_name, check_function, sp_or_js, display_name) VALUES
    ('NEED_COMPLETED_CHALLENGE', 'checkCompletedChallenge', 0, 'Complete the challenge ?');

ALTER TABLE dv2_challenge_condition ADD COLUMN additional_parameters VARCHAR(100) AFTER condition_id;
ALTER TABLE dv2_job_condition ADD COLUMN additional_parameters VARCHAR(100) AFTER condition_id;

ALTER TABLE dv2_challenge_condition ADD COLUMN pass_score FLOAT(5,2) DEFAULT 0.7 AFTER additional_parameters;
ALTER TABLE dv2_job_condition ADD COLUMN pass_score FLOAT(5,2) DEFAULT 0.7 AFTER additional_parameters;