-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 02, 2018 at 09:31 PM
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
-- Table structure for table `google_list_v4`
--

CREATE TABLE `google_list_v4` (
  `oid` int(11) NOT NULL,
  `ouid` int(11) NOT NULL COMMENT 'user_list_v4.uid',
  `ofirst_name` varchar(50) NOT NULL DEFAULT '',
  `olast_name` varchar(50) NOT NULL DEFAULT '',
  `oemail` varchar(50) NOT NULL DEFAULT '',
  `ouser_id` varchar(50) NOT NULL DEFAULT '',
  `oerror_code` varchar(100) NOT NULL DEFAULT '',
  `ocreated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `oupdated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `google_list_v4`
--
ALTER TABLE `google_list_v4`
  ADD PRIMARY KEY (`oid`),
  ADD KEY `sid` (`ouid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `google_list_v4`
--
ALTER TABLE `google_list_v4`
  MODIFY `oid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
