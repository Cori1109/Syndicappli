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
-- Table structure for table `github_list_v4`
--

CREATE TABLE `github_list_v4` (
  `gid` int(11) NOT NULL,
  `guid` int(11) NOT NULL COMMENT 'user_list_v4.uid',
  `gfull_name` varchar(50) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `glogin_name` varchar(50) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `gemail` varchar(100) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `gcompany` varchar(50) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `glocation` varchar(100) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `gbio` varchar(200) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `gprofile_url` varchar(500) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `grepos_url` varchar(500) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `gpublic_repos_count` varchar(10) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `gfollowers_count` varchar(10) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `gfollowing_count` varchar(10) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `gavatar_url` varchar(5000) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `gaccount_create_date` varchar(100) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `guser_id` varchar(50) CHARACTER SET utf8 NOT NULL,
  `gerror_code` varchar(300) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `gcreated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `gupdated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `github_list_v4`
--
ALTER TABLE `github_list_v4`
  ADD PRIMARY KEY (`gid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `github_list_v4`
--
ALTER TABLE `github_list_v4`
  MODIFY `gid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
