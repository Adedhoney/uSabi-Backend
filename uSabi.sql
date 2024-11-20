CREATE DATABASE IF NOT EXISTS `usabi`;


CREATE TABLE IF NOT EXISTS `usabi`.`users` (
	`id` INT AUTO_INCREMENT,
	`userId` VARCHAR(255) NOT NULL,
	`email` VARCHAR(255) NOT NULL,
	`firstName` VARCHAR(255) NOT NULL,
	`lastName` VARCHAR(255) NOT NULL,
	`status` TINYINT NOT NULL,
	`password` VARCHAR(255) NULL,
	`emailVerified` TINYINT NOT NULL,
	`createdOn` BIGINT NULL,
  	`lastModifiedOn` BIGINT NULL,
  	`createdBy` VARCHAR(255) NULL,
  	`modifiedBy` VARCHAR(255) NULL,
	UNIQUE (`id`),
	UNIQUE (`email`),
	PRIMARY KEY(`userId`)
);

CREATE TABLE IF NOT EXISTS `usabi`.`otps` (
	`id` INT AUTO_INCREMENT,
	`email` VARCHAR(255) NOT NULL,
	`otp` VARCHAR(255) NOT NULL,
	`expiresAt` BIGINT NOT NULL,
	`wrongTrials` TINYINT NOT NULL,
	`status` SMALLINT NOT NULL,
	UNIQUE (`id`),
	PRIMARY KEY (`email`)
);
