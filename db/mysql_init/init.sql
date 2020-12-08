ALTER USER api identified by 'password';
grant all PRIVILEGES ON *.* TO 'api'@'%';
FLUSH PRIVILEGES;

-- MySQL Workbench Forward Engineering
Drop schema `survey`;
-- -----------------------------------------------------
-- Schema survey
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `survey` DEFAULT CHARACTER SET utf8 ;
USE `survey` ;

-- -----------------------------------------------------
-- Table `survey`.`publisher`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `survey`.`publisher` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT current_timestamp,
  `updated_at` DATETIME NOT NULL DEFAULT current_timestamp on update current_timestamp,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `survey`.`survey`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `survey`.`survey` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `publisher_id` INT NOT NULL,
  `is_deleted` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `fk_surveys_publishers_idx` (`publisher_id` ASC) VISIBLE,
  CONSTRAINT `fk_surveys_publishers`
    FOREIGN KEY (`publisher_id`)
    REFERENCES `survey`.`publisher` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `survey`.`survey_history`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `survey`.`survey_history` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `survey_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT current_timestamp,
  `deleted_at` DATETIME NOT NULL DEFAULT 99991231,
  PRIMARY KEY (`id`),
  INDEX `fk_survey_info_surveys1_idx` (`survey_id` ASC) VISIBLE,
  UNIQUE INDEX `unique_survey_current` (`survey_id` ASC, `deleted_at` ASC) INVISIBLE,
  CONSTRAINT `fk_survey_info_surveys1`
    FOREIGN KEY (`survey_id`)
    REFERENCES `survey`.`survey` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `survey`.`result`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `survey`.`result` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `survey_history_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_audiences_survey_history1_idx` (`survey_history_id` ASC) VISIBLE,
  CONSTRAINT `fk_audiences_survey_history1`
    FOREIGN KEY (`survey_history_id`)
    REFERENCES `survey`.`survey_history` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `survey`.`question`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `survey`.`question` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `survey_id` INT NOT NULL,
  `is_deleted` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `fk_questions_surveys1_idx` (`survey_id` ASC) VISIBLE,
  CONSTRAINT `fk_questions_surveys1`
    FOREIGN KEY (`survey_id`)
    REFERENCES `survey`.`survey` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `survey`.`type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `survey`.`type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `code` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `survey`.`question_history`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `survey`.`question_history` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `question_id` INT NOT NULL,
  `type_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT current_timestamp,
  `deleted_at` DATETIME NOT NULL DEFAULT 99991231,
  PRIMARY KEY (`id`),
  INDEX `fk_question_info_questions1_idx` (`question_id` ASC) VISIBLE,
  INDEX `fk_question_info_types1_idx` (`type_id` ASC) VISIBLE,
  UNIQUE INDEX `unique_question_current` (`question_id` ASC, `deleted_at` ASC) VISIBLE,
  CONSTRAINT `fk_question_info_questions1`
    FOREIGN KEY (`question_id`)
    REFERENCES `survey`.`question` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_question_info_types1`
    FOREIGN KEY (`type_id`)
    REFERENCES `survey`.`type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `survey`.`choice`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `survey`.`choice` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `question_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_choices_questions1_idx` (`question_id` ASC) VISIBLE,
  CONSTRAINT `fk_choices_questions1`
    FOREIGN KEY (`question_id`)
    REFERENCES `survey`.`question` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `survey`.`choice_history`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `survey`.`choice_history` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `choice_id` INT NOT NULL,
  `option_name` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT current_timestamp,
  `deleted_at` DATETIME NOT NULL DEFAULT 99991231,
  PRIMARY KEY (`id`),
  INDEX `fk_choice_log_choices1_idx` (`choice_id` ASC) VISIBLE,
  UNIQUE INDEX `unique_choice_current` (`choice_id` ASC, `deleted_at` ASC) VISIBLE,
  CONSTRAINT `fk_choice_log_choices1`
    FOREIGN KEY (`choice_id`)
    REFERENCES `survey`.`choice` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `survey`.`answer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `survey`.`answer` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `result_id` INT NOT NULL,
  `question_history_id` INT NOT NULL,
  `choice_history_id` INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`id`),
  INDEX `fk_survey_results_audiences1_idx` (`result_id` ASC) VISIBLE,
  INDEX `fk_survey_results_question_info1_idx` (`question_history_id` ASC) VISIBLE,
  INDEX `fk_survey_results_choice_log1_idx` (`choice_history_id` ASC) VISIBLE,
  CONSTRAINT `fk_survey_results_audiences1`
    FOREIGN KEY (`result_id`)
    REFERENCES `survey`.`result` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_survey_results_question_info1`
    FOREIGN KEY (`question_history_id`)
    REFERENCES `survey`.`question_history` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_survey_results_choice_log1`
    FOREIGN KEY (`choice_history_id`)
    REFERENCES `survey`.`choice_history` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

INSERT INTO `survey`.`type` (`name`, `code`) VALUES ('single choice', 'single_choice')