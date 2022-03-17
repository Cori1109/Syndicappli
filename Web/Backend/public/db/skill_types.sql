-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 21, 2019 at 08:22 PM
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
-- Table structure for table `skill_types`
--

CREATE TABLE `skill_types` (
  `id` int(11) NOT NULL,
  `display_name` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `skill_types`
--

INSERT INTO `skill_types` (`id`, `display_name`, `name`) VALUES
(0, 'Front End', 'front-end'),
(1, 'Back End', 'back-end'),
(2, 'DevOps', 'devops'),
(3, 'Design', 'design'),
(4, 'UI/UX', 'ui-ux'),
(5, 'Mobile', 'mobile'),
(6, 'Full Stack', 'full-stack'),
(9, 'Database', 'database'),
(10, 'Software', 'software'),
(11, 'Cloud Technologies', 'cloud-technologies'),
(12, 'Container Technologies', 'container-technologies'),
(13, 'Version Control', 'version-control'),
(14, 'Project Management', 'project-management'),
(15, 'Testing', 'testing'),
(16, 'Other', 'other'),
(17, 'Compiled / multipurpose', 'compiled-multipurpose '),
(18, 'AI', 'AI');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `skill_types`
--
ALTER TABLE `skill_types`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
