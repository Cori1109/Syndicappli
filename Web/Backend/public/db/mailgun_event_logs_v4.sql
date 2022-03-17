-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 02, 2018 at 09:32 PM
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
-- Table structure for table `mailgun_event_logs_v4`
--

CREATE TABLE `mailgun_event_logs_v4` (
  `event_id` varchar(40) NOT NULL,
  `event_type` varchar(20) NOT NULL,
  `message_id` varchar(100) NOT NULL,
  `log_timestamp` double NOT NULL,
  `from` varchar(100) DEFAULT NULL,
  `recipient` varchar(100) DEFAULT NULL,
  `subject` varchar(256) DEFAULT NULL,
  `size` int(11) DEFAULT NULL,
  `client_type` varchar(40) DEFAULT NULL,
  `device_type` varchar(40) DEFAULT NULL,
  `client_name` varchar(40) DEFAULT NULL,
  `client_os` varchar(40) DEFAULT NULL,
  `user_agent` varchar(40) DEFAULT NULL,
  `country` varchar(40) DEFAULT NULL,
  `region` varchar(40) DEFAULT NULL,
  `city` varchar(40) DEFAULT NULL,
  `serverity_type` varchar(30) DEFAULT NULL,
  `reason` varchar(30) DEFAULT NULL,
  `delivery_stat_code` int(6) DEFAULT NULL,
  `delivery_stat_message` text,
  `recipient_domain` varchar(40) DEFAULT NULL,
  `page_url` varchar(500) DEFAULT NULL,
  `domain` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mailgun_event_logs_v4`
--
ALTER TABLE `mailgun_event_logs_v4`
  ADD PRIMARY KEY (`log_timestamp`),
  ADD KEY `recipient` (`recipient`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
