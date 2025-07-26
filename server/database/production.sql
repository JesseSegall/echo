drop database if exists echo;
create database echo;
use echo;


CREATE TABLE IF NOT EXISTS `user` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(255) ,
  `last_name` VARCHAR(255) ,
  `bio` TEXT,
  `city` VARCHAR(255) ,
  `state` VARCHAR(255) ,
  `zip_code` VARCHAR(20) ,
  `profile_img_url` TEXT,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `instrument` VARCHAR(255),
  `created_at` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `band` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `band_img_url` TEXT,
  `genre` VARCHAR(255),
  `bio` TEXT,
  `city` VARCHAR(255),
  `state` VARCHAR(255),
  `zip_code` VARCHAR(20),
  `needs_new_member` BOOL NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `band_members` (
  `band_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `role` VARCHAR(255),
  `joined_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`band_id`,`user_id`),
  CONSTRAINT `bm_band_fk` FOREIGN KEY (`band_id`) REFERENCES `Band`(`id`) ON DELETE CASCADE,
  CONSTRAINT `bm_user_fk` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `albums` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `band_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `release_date` DATE,
  `cover_url` TEXT,
  `cover_key` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `alb_band_fk` FOREIGN KEY (`band_id`) REFERENCES `Band`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `songs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `band_id` INT NULL,
  `album_id` INT NULL,
  `title` TEXT NOT NULL,
  `file_key` TEXT NOT NULL,
  `file_url` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `sng_user_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  CONSTRAINT `sng_band_fk` FOREIGN KEY (`band_id`) REFERENCES `band`(`id`) ON DELETE CASCADE,
  CONSTRAINT `sng_alb_fk` FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS `conversations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_message_at` TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS `conversation_users` (
  `conversation_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `joined_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`conversation_id`,`user_id`),
  CONSTRAINT `cu_conv_fk` FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE,
  CONSTRAINT `cu_user_fk` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `conversation_id` INT NOT NULL,
  `sender_id` INT NOT NULL,
  `body` TEXT NOT NULL,
  `sent_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `msg_conv_fk` FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE,
  CONSTRAINT `msg_sender_fk` FOREIGN KEY (`sender_id`) REFERENCES `User`(`id`) ON DELETE CASCADE
);

DELIMITER $$
CREATE TRIGGER trg_update_last_message
  AFTER INSERT ON `messages`
  FOR EACH ROW
BEGIN
  UPDATE `conversations`
    SET last_message_at = NEW.sent_at
    WHERE id = NEW.conversation_id;
END$$
DELIMITER ;

CREATE TABLE IF NOT EXISTS `posts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `band_id` INT NULL,
  `body` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `pst_user_fk` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  CONSTRAINT `pst_band_fk` FOREIGN KEY (`band_id`) REFERENCES `Band`(`id`) ON DELETE CASCADE,
  CHECK (
    (user_id IS NOT NULL AND band_id IS NULL)
    OR
    (user_id IS NULL AND band_id IS NOT NULL)
  )
);

CREATE TABLE IF NOT EXISTS `comments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `post_id` INT NOT NULL,
  `user_id` INT NULL,
  `band_id` INT NULL,
  `body` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `cmt_post_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE,
  CONSTRAINT `cmt_user_fk` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  CONSTRAINT `cmt_band_fk` FOREIGN KEY (`band_id`) REFERENCES `Band`(`id`) ON DELETE CASCADE,
  CHECK (
    (user_id IS NOT NULL AND band_id IS NULL)
    OR
    (user_id IS NULL AND band_id IS NOT NULL)
  )
);
-- Insert a test user into the User table
INSERT INTO `user` (
    username, 
    password, 
    first_name, 
    last_name, 
    city, 
    state, 
    zip_code, 
    profile_img_url, 
    email, 
    instrument
) VALUES (
    'testuser123',
    'password123', 
    'John',
    'Doe',
    'Phoenix',
    'AZ',
    '85001',
    'https://example.com/profile.jpg',
    'john.doe@example.com',
    'Guitar'
);

INSERT INTO band (name, genre, city, state) VALUES 
('The Rockers', 'Rock', 'Los Angeles', 'CA'),
('Jazz Collective', 'Jazz', 'Chicago', 'IL'),
('Electronic Vibes', 'Electronic', 'Austin', 'TX');

select * from `user`;
SELECT * FROM songs;
