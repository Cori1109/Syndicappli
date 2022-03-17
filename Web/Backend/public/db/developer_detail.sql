-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 07, 2019 at 12:16 PM
-- Server version: 10.1.28-MariaDB
-- PHP Version: 5.6.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `turing_node`
--

-- --------------------------------------------------------

--
-- Table structure for table `developer_detail`
--

CREATE TABLE `developer_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `developer_pm` int(11) DEFAULT NULL,
  `avatar` text COLLATE utf8mb4_unicode_ci,
  `status` enum('inactive','screen','tech','final','matching','matched','working','pre-screen interview','technical interview','revising submission','negotiation','standardized resume','ready','matched internal','matched customer') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('frontend','backend','fullstack','devops','mobile','uiux') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` int(11) DEFAULT '0',
  `resume` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `availability` timestamp NULL DEFAULT NULL,
  `hourly_rate` int(11) DEFAULT '0',
  `frontend` int(11) DEFAULT '0',
  `backend` int(11) DEFAULT '0',
  `fullstack` int(11) DEFAULT '0',
  `years_of_experience` int(11) DEFAULT '0',
  `years_of_working_remotely` int(11) DEFAULT '0',
  `utc_timezone` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `technical_interviewer` varchar(225) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verbal_communication` int(11) DEFAULT NULL,
  `test_score` int(11) DEFAULT NULL,
  `country` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `resume_plain` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=163 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--
ALTER TABLE developer_detail ADD FULLTEXT INDEX idxResumePlainFullText(resume_plain);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `developer_detail`
--
ALTER TABLE `developer_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
