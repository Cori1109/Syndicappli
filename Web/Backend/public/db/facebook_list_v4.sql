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
-- Table structure for table `facebook_list_v4`
--

CREATE TABLE `facebook_list_v4` (
  `fid` int(11) NOT NULL,
  `fuid` int(11) NOT NULL COMMENT 'user_list_v4.uid',
  `ffirst_name` varchar(50) NOT NULL DEFAULT '',
  `flast_name` varchar(50) NOT NULL DEFAULT '',
  `femail` varchar(50) NOT NULL DEFAULT '',
  `fuser_id` varchar(50) NOT NULL DEFAULT '',
  `ferror_code` varchar(100) NOT NULL DEFAULT '',
  `fcreated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fupdated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `facebook_list_v4`
--
ALTER TABLE `facebook_list_v4`
  ADD PRIMARY KEY (`fid`),
  ADD KEY `fsid` (`fuid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `facebook_list_v4`
--
ALTER TABLE `facebook_list_v4`
  MODIFY `fid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
