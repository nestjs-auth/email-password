CREATE TABLE refresh_tokens (
	`id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`user_id` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL
)
