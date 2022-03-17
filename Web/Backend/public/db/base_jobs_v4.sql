-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 31, 2018 at 10:45 AM
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
-- Table structure for table `base_jobs_v4`
--

CREATE TABLE `base_jobs_v4` (
  `id` int(11) NOT NULL,
  `jid` int(11) NOT NULL,
  `job_name` varchar(100) NOT NULL,
  `job_count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `base_jobs_v4`
--

INSERT INTO `base_jobs_v4` (`id`, `jid`, `job_name`, `job_count`) VALUES
(1, 1, 'Full-Stack Developer', 39),
(2, 2, 'Back-End Developer', 28),
(3, 3, 'Front-End Developer', 27),
(4, 4, 'Software Engineer', 27),
(5, 5, 'DevOps / Systems Engineer', 16),
(6, 6, 'Data Engineer', 8),
(7, 7, 'iOS Developer', 7),
(8, 8, 'Site Reliability Engineer', 5),
(9, 9, 'Android Developer', 5),
(10, 10, 'Automation QA (SDET)', 4),
(11, 11, 'Platform Engineer', 3),
(12, 12, 'NLP Engineer', 1),
(13, 13, 'Distributed Systems Engineer', 1),
(14, 14, 'ML and AI Engineering', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `base_jobs_v4`
--
ALTER TABLE `base_jobs_v4`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `base_jobs_v4`
--
ALTER TABLE `base_jobs_v4`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
