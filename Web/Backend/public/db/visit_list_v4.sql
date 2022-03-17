-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 05, 2019 at 11:47 PM
-- Server version: 10.1.32-MariaDB
-- PHP Version: 7.0.30

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
-- Table structure for table `visit_list_v4`
--

CREATE TABLE `visit_list_v4` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL COMMENT 'user_list_v4.id',
  `visit_number` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL DEFAULT '',
  `last_name` varchar(50) NOT NULL DEFAULT '',
  `email` varchar(50) NOT NULL DEFAULT '',
  `country` varchar(50) NOT NULL DEFAULT '',
  `phone_number` varchar(50) NOT NULL DEFAULT '',
  `remote_hour` varchar(100) NOT NULL DEFAULT '',
  `remote_position` varchar(512) NOT NULL DEFAULT '',
  `remote_custom` varchar(50) NOT NULL DEFAULT '',
  `remote_home` varchar(100) NOT NULL DEFAULT '',
  `linkedin_url` varchar(255) NOT NULL DEFAULT '',
  `recent_employer` varchar(50) NOT NULL DEFAULT '',
  `recent_position` varchar(50) NOT NULL DEFAULT '',
  `job_names` varchar(1000) NOT NULL DEFAULT '',
  `job_levels` varchar(1000) NOT NULL DEFAULT '',
  `skill_names` varchar(1000) NOT NULL DEFAULT '',
  `skill_levels` varchar(1000) NOT NULL DEFAULT '',
  `profession` varchar(50) NOT NULL DEFAULT '',
  `resume_path` varchar(255) NOT NULL DEFAULT '',
  `referer_url` varchar(255) NOT NULL DEFAULT '',
  `user_ip` varchar(50) NOT NULL DEFAULT '',
  `user_country` varchar(50) NOT NULL DEFAULT '',
  `user_region` varchar(50) NOT NULL DEFAULT '',
  `user_city` varchar(50) NOT NULL DEFAULT '',
  `user_browser_name` varchar(50) NOT NULL DEFAULT '',
  `user_browser_version` varchar(50) NOT NULL DEFAULT '',
  `user_os` varchar(50) NOT NULL DEFAULT '',
  `user_screen_width` int(11) DEFAULT NULL,
  `user_screen_height` int(11) DEFAULT NULL,
  `test_language` varchar(20) NOT NULL DEFAULT '',
  `test_user_score_palindrome` int(10) DEFAULT NULL,
  `test_system_score_palindrome` int(10) DEFAULT NULL,
  `test_time_palindrome` int(10) DEFAULT NULL,
  `test_date_palindrome` timestamp NULL DEFAULT NULL,
  `test_source_path_palindrome` varchar(50) NOT NULL DEFAULT '',
  `test_user_score_hackland` int(10) DEFAULT NULL,
  `test_system_score_hackland` int(10) DEFAULT NULL,
  `test_time_hackland` int(10) DEFAULT NULL,
  `test_date_hackland` timestamp NULL DEFAULT NULL,
  `test_source_path_hackland` varchar(50) NOT NULL DEFAULT '',
  `take_challenge_type` int(1) NOT NULL DEFAULT '-1' COMMENT '0: skip for now, 1: frontend 2:Fullstack',
  `s_param` varchar(20) NOT NULL DEFAULT '',
  `n_param` varchar(100) NOT NULL DEFAULT '',
  `logged_in_google` varchar(5) NOT NULL DEFAULT 'false',
  `logged_in_facebook` varchar(5) NOT NULL DEFAULT 'false',
  `quiz_answer` varchar(50) NOT NULL DEFAULT '',
  `register_google` tinyint(1) NOT NULL DEFAULT '0',
  `register_facebook` tinyint(1) NOT NULL DEFAULT '0',
  `register_linkedin` tinyint(1) NOT NULL DEFAULT '0',
  `register_github` tinyint(1) NOT NULL DEFAULT '0',
  `from_where` varchar(20) NOT NULL DEFAULT '',
  `logout_status` varchar(6) NOT NULL DEFAULT '',
  `javascript_test_type` tinyint(1) NOT NULL DEFAULT '-1',
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `visit_list_v4`
--
ALTER TABLE `visit_list_v4`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`uid`),
  ADD KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `visit_list_v4`
--
ALTER TABLE `visit_list_v4`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=188;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
