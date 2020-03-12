-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema peercollab
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema peercollab
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `peercollab` DEFAULT CHARACTER SET utf8 ;
USE `peercollab` ;

-- -----------------------------------------------------
-- Table `peercollab`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `peercollab`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(32) NOT NULL,
  `email` VARCHAR(32) NOT NULL,
  `username` VARCHAR(32) NULL,
  `password` VARCHAR(64) NOT NULL,
  `icon` VARCHAR(32) NULL,
  `country` INT NULL,
  `timezone` VARCHAR(6) NOT NULL DEFAULT '00:00',
  `bio` TEXT NULL,
  `level` INT NOT NULL DEFAULT 0,
  `state` ENUM('NEW', 'VERIFIED', 'DISABLED') NOT NULL DEFAULT 'NEW',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `peercollab`.`course`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `peercollab`.`course` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(64) NOT NULL,
  `description` TEXT NOT NULL DEFAULT '',
  `icon` VARCHAR(32) NULL,
  `max_communities` INT NOT NULL DEFAULT 50,
  `max_students` INT NOT NULL DEFAULT 50,
  `state` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_course_user_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_course_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `peercollab`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `peercollab`.`community`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `peercollab`.`community` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(64) NOT NULL,
  `description` TEXT NOT NULL DEFAULT '',
  `type` ENUM('ANY', 'INVITATION') NOT NULL DEFAULT 'ANY',
  `state` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `course_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_community_course1_idx` (`course_id` ASC) VISIBLE,
  CONSTRAINT `fk_community_course1`
    FOREIGN KEY (`course_id`)
    REFERENCES `peercollab`.`course` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `peercollab`.`enrollment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `peercollab`.`enrollment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `level` INT NOT NULL DEFAULT 0,
  `time` INT NOT NULL DEFAULT 0,
  `state` ENUM('INVITED', 'REQUESTED', 'ENROLLED', 'REJECTED', 'BLOCKED', 'LEFT') NOT NULL DEFAULT 'ENROLLED',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `community_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_enrollment_community1_idx` (`community_id` ASC) VISIBLE,
  INDEX `fk_enrollment_user1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_enrollment_community1`
    FOREIGN KEY (`community_id`)
    REFERENCES `peercollab`.`community` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_enrollment_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `peercollab`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `peercollab`.`activity`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `peercollab`.`activity` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` ENUM('POST', 'COMMENT', 'EXPRESSION') NOT NULL DEFAULT 'POST',
  `text` TEXT NULL,
  `attachment` VARCHAR(64) NULL,
  `expression` ENUM('LIKE') NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `activity_ref_id` INT NULL,
  `community_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_activity_activity1_idx` (`activity_ref_id` ASC) VISIBLE,
  INDEX `fk_activity_community1_idx` (`community_id` ASC) VISIBLE,
  INDEX `fk_activity_user1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_activity_activity1`
    FOREIGN KEY (`activity_ref_id`)
    REFERENCES `peercollab`.`activity` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_activity_community1`
    FOREIGN KEY (`community_id`)
    REFERENCES `peercollab`.`community` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_activity_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `peercollab`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `peercollab`.`active_period`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `peercollab`.`active_period` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `start_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `time` INT NOT NULL DEFAULT 0,
  `user_id` INT NOT NULL,
  `community_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_activity_period_user1_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_activity_period_community1_idx` (`community_id` ASC) VISIBLE,
  CONSTRAINT `fk_activity_period_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `peercollab`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_activity_period_community1`
    FOREIGN KEY (`community_id`)
    REFERENCES `peercollab`.`community` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `peercollab`.`notification`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `peercollab`.`notification` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `text` VARCHAR(64) NOT NULL,
  `url` VARCHAR(64) NOT NULL,
  `ref_id` INT NULL,
  `type` INT NULL,
  `state` ENUM('NEW', 'SEEN', 'CLICKED') NOT NULL DEFAULT 'NEW',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_notification_user1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_notification_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `peercollab`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
