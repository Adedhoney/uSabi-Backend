CREATE DATABASE IF NOT EXISTS `usabi`;

USE `usabi`;

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
        `languagePreference` VARCHAR(255) NULL,
        `learningStyle` VARCHAR(255) NULL,
	`aiResponse` VARCHAR(255) NULL,
	`learningDuration` VARCHAR(255) NULL,
        `avatar` TEXT NULL,
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

CREATE TABLE IF NOT EXISTS `flashcards` (
	`id` INT AUTO_INCREMENT,
	`flashcardId` VARCHAR(255) NOT NULL UNIQUE,
	`title` VARCHAR(255) NOT NULL,
	`category` VARCHAR(255) NOT NULL,
	`qas` JSON NOT NULL,
	`avatar` VARCHAR(255) NOT NULL,
	`difficulty` VARCHAR(255) NOT NULL,
	`numberOfQuestions` INT NOT NULL,
	`createdAt` BIGINT NOT NULL,
	`updatedAt` BIGINT NUll,
	UNIQUE (`id`),
	PRIMARY KEY(`flashcardId`)
);

CREATE TABLE IF NOT EXISTS `courses` (
	`courseId` VARCHAR(255) NOT NULL UNIQUE,
	`category` VARCHAR(255) NOT NULL,
	`topic` VARCHAR(255) NOT NULL,
	`description` VARCHAR(255) NULL,
	`createdAt` BIGINT NOT NULL,
	`updatedAt` BIGINT NULL,
	PRIMARY KEY(`courseId`)
);

CREATE TABLE IF NOT EXISTS `waitlist` (
	`userId` VARCHAR(255) NOT NULL UNIQUE,
	`firstName` VARCHAR(255) NULL,
	`lastName` VARCHAR(255) NULL,
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`emailVerified` TINYINT NULL,
	`createdAt` BIGINT NOT NULL,
	`updatedAt` BIGINT NULL,
	PRIMARY KEY(`userId`)
);

CREATE TABLE IF NOT EXISTS `quiz` (
	`qId` VARCHAR(255) NOT NULL UNIQUE,
	`chapterId` VARCHAR(255) NOT NULL UNIQUE,
	`qas` JSON NOT NULL,
	`createdAt` BIGINT NOT NULL,
	`updatedAt` BIGINT NULL,
	PRIMARY KEY(`qId`)
);
