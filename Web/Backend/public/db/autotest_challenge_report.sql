---
--- Create table for report
---

CREATE TABLE `autotest_challenge_reports`
(
 `id`         int NOT NULL AUTO_INCREMENT ,
 `user_id`     int NOT NULL ,
 `challenge_type_id` int NOT NULL ,
 `frontend_zip_url` varchar(256),
 `frontend_hosted_url` varchar(256),
 `backend_zip_url` varchar(256),
 `api_hosted_url` varchar(256),
 `report`         JSON  NOT NULL,
 `score`             decimal(10, 1) NOT NULL ,
 `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`id`),
FOREIGN KEY `fk_challenge_type` (`challenge_type_id`)
REFERENCES `challenge_type_v4`(`id`),
FOREIGN KEY `fk_user` (`user_id`)
REFERENCES `submit_list_v4`(`uid`)
) ENGINE=InnoDB;