-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 43.202.60.152    Database: myonitoring
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cats`
--

DROP TABLE IF EXISTS `cats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cats` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `age` int NOT NULL,
  `birth_date` date NOT NULL,
  `breed` varchar(50) DEFAULT NULL,
  `characteristics` text,
  `gender` enum('F','M') NOT NULL,
  `is_neutered` bit(1) NOT NULL,
  `name` varchar(50) NOT NULL,
  `profile_image_url` varchar(2048) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `device_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6u94dmjm71pr93ypwsom9wev3` (`device_id`),
  CONSTRAINT `FK7x21hx4hyktve1995nxmc312a` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `devices` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `registration_date` date NOT NULL,
  `serial_number` varchar(100) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6ju48hv6y1f2kn982hyxd0wep` (`serial_number`),
  KEY `FKrfbri1ymrwywdydc4dgywe1bt` (`user_id`),
  CONSTRAINT `FKrfbri1ymrwywdydc4dgywe1bt` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `eye_records`
--

DROP TABLE IF EXISTS `eye_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eye_records` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `captured_date_time` datetime(6) NOT NULL,
  `is_eye_diseased` bit(1) NOT NULL,
  `left_blepharitis_prob` decimal(3,2) NOT NULL,
  `left_conjunctivitis_prob` decimal(3,2) NOT NULL,
  `left_corneal_sequestrum_prob` decimal(3,2) NOT NULL,
  `left_corneal_ulcer_prob` decimal(3,2) NOT NULL,
  `left_eye_image_url` varchar(255) DEFAULT NULL,
  `left_non_ulcerative_keratitis_prob` decimal(3,2) NOT NULL,
  `right_blepharitis_prob` decimal(3,2) NOT NULL,
  `right_conjunctivitis_prob` decimal(3,2) NOT NULL,
  `right_corneal_sequestrum_prob` decimal(3,2) NOT NULL,
  `right_corneal_ulcer_prob` decimal(3,2) NOT NULL,
  `right_eye_image_url` varchar(255) DEFAULT NULL,
  `right_non_ulcerative_keratitis_prob` decimal(3,2) NOT NULL,
  `cat_id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_eye_cat` (`cat_id`),
  KEY `FKb6ethv2lr9iyj79juuq3e6u39` (`user_id`),
  CONSTRAINT `fk_eye_cat` FOREIGN KEY (`cat_id`) REFERENCES `cats` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FKb6ethv2lr9iyj79juuq3e6u39` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fcm_tokens`
--

DROP TABLE IF EXISTS `fcm_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fcm_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `is_active` bit(1) DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKqopjyk0c1cho2ep0abxd9hi5q` (`token`),
  KEY `FKj2kob865pl9dv5vwrs2pmshjv` (`user_id`),
  CONSTRAINT `FKj2kob865pl9dv5vwrs2pmshjv` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `feeding_records`
--

DROP TABLE IF EXISTS `feeding_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feeding_records` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `actual_feeding_amount` int NOT NULL,
  `configured_feeding_amount` int NOT NULL,
  `feeding_date_time` datetime(6) NOT NULL,
  `cat_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_feeding_cat` (`cat_id`),
  CONSTRAINT `fk_feeding_cat` FOREIGN KEY (`cat_id`) REFERENCES `cats` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=337 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `intake_records`
--

DROP TABLE IF EXISTS `intake_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `intake_records` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `intake_amount` int DEFAULT NULL,
  `intake_date_time` datetime(6) NOT NULL,
  `intake_duration` int NOT NULL,
  `cat_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_intake_cat` (`cat_id`),
  CONSTRAINT `fk_intake_cat` FOREIGN KEY (`cat_id`) REFERENCES `cats` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=471 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `intake_statistics`
--

DROP TABLE IF EXISTS `intake_statistics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `intake_statistics` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `change_days` int NOT NULL,
  `change_status` int NOT NULL,
  `cat_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9m8r5fqpktfohvcumytbclnxj` (`cat_id`),
  CONSTRAINT `FK9m8r5fqpktfohvcumytbclnxj` FOREIGN KEY (`cat_id`) REFERENCES `cats` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `medical_records`
--

DROP TABLE IF EXISTS `medical_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_records` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` enum('CHECKUP','OTHER','TREATMENT') NOT NULL,
  `description` text,
  `hospital_name` varchar(100) NOT NULL,
  `title` varchar(100) NOT NULL,
  `visit_date` date NOT NULL,
  `visit_time` time(6) NOT NULL,
  `cat_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_medical_cat` (`cat_id`),
  CONSTRAINT `fk_medical_cat` FOREIGN KEY (`cat_id`) REFERENCES `cats` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notification_records`
--

DROP TABLE IF EXISTS `notification_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_records` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` enum('DEVICE','EYE','FOOD','INTAKE') NOT NULL,
  `message` varchar(500) NOT NULL,
  `notification_date` datetime(6) NOT NULL,
  `cat_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKop4enou91ie4m7265qlfeivr9` (`cat_id`),
  CONSTRAINT `FKop4enou91ie4m7265qlfeivr9` FOREIGN KEY (`cat_id`) REFERENCES `cats` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedules` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `is_active` bit(1) NOT NULL,
  `scheduled_amount` int NOT NULL,
  `scheduled_time` time(6) NOT NULL,
  `device_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_schedule_device` (`device_id`),
  CONSTRAINT `fk_schedule_device` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stat_records`
--

DROP TABLE IF EXISTS `stat_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stat_records` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `average30d` decimal(6,2) NOT NULL,
  `average7d` decimal(6,2) NOT NULL,
  `change30d` decimal(3,2) NOT NULL,
  `change7d` decimal(3,2) NOT NULL,
  `change_days` int NOT NULL,
  `change_status` int NOT NULL,
  `stat_date` date NOT NULL,
  `total_intake` int NOT NULL,
  `cat_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK97lbvp624j0p569e748d388s6` (`cat_id`),
  CONSTRAINT `FK97lbvp624j0p569e748d388s6` FOREIGN KEY (`cat_id`) REFERENCES `cats` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `is_profile_completed` bit(1) NOT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `provider` enum('GOOGLE','KAKAO','LOCAL','NAVER') NOT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','USER') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-20 23:06:01
