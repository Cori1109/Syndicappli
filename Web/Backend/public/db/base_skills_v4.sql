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
-- Table structure for table `base_skills_v4`
--

CREATE TABLE `base_skills_v4` (
  `id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL COMMENT 'base_jobs_v4.jid',
  `skill_name` varchar(100) NOT NULL,
  `skill_count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `base_skills_v4`
--

INSERT INTO `base_skills_v4` (`id`, `job_id`, `skill_name`, `skill_count`) VALUES
(2, 1, 'Javascript', 78),
(3, 1, 'CSS', 48),
(4, 1, 'Angular.js', 31),
(5, 1, 'Node.js', 21),
(6, 1, 'React.js', 36),
(7, 1, 'HTML', 37),
(8, 1, 'RESTful', 14),
(9, 1, 'MySQL', 23),
(10, 1, 'Object Oriented', 9),
(11, 1, 'Spring', 26),
(12, 1, 'Mongo DB', 9),
(13, 1, 'Agile/Scrum Project Experience', 9),
(14, 1, 'AWS', 52),
(15, 1, 'PHP', 9),
(16, 1, 'NoSQL/Distributed Databases', 8),
(17, 1, 'Docker', 15),
(18, 1, 'jQuery', 18),
(19, 1, 'Python', 96),
(20, 1, 'AJAX', 10),
(21, 1, 'Django', 10),
(22, 2, 'Java', 86),
(23, 2, 'RESTful API', 19),
(24, 2, 'MySQL', 23),
(25, 2, 'AWS', 52),
(26, 2, 'Spring', 26),
(27, 2, 'Python', 96),
(28, 2, 'API\'s', 17),
(29, 2, 'Scala/Play', 9),
(30, 2, 'Node.js', 9),
(31, 2, 'Kafka', 25),
(32, 2, 'NoSQL', 28),
(33, 2, 'MariaDB', 8),
(34, 2, 'GitHub', 19),
(35, 2, 'Web Services', 6),
(36, 2, 'Ruby', 5),
(37, 2, 'SQL', 50),
(38, 2, 'Agile', 5),
(39, 2, 'Multi Threading', 5),
(40, 2, 'Go', 16),
(41, 2, 'Linux', 23),
(42, 3, 'Javascript', 78),
(43, 3, 'HTML', 37),
(44, 3, 'CSS', 48),
(45, 3, 'HTML5', 14),
(46, 3, 'CSS3', 14),
(47, 3, 'React/Redux', 13),
(48, 3, 'React.js', 36),
(49, 3, 'GitHub', 19),
(50, 3, 'UI', 16),
(51, 3, 'Angular.js', 31),
(52, 3, 'jQuery', 10),
(53, 3, 'MVC Technologies/Frameworks', 10),
(54, 3, 'Webpack', 9),
(55, 3, 'Bootstrap', 8),
(56, 3, 'Ember.js', 7),
(57, 3, 'Saas', 7),
(58, 3, 'RESTful API', 19),
(59, 3, 'Vue.js', 6),
(60, 3, 'Backbone.js', 6),
(61, 3, 'Spring', 26),
(62, 4, 'Java', 86),
(63, 4, 'Python', 96),
(64, 4, 'C++', 27),
(65, 4, 'RESTful API', 19),
(66, 4, 'Javascript', 78),
(67, 4, 'C', 14),
(68, 4, 'SQL', 50),
(69, 4, 'Go', 16),
(70, 4, 'Linux', 23),
(71, 4, 'REST', 12),
(72, 4, 'Agile', 6),
(73, 4, 'AWS', 52),
(74, 4, 'Scala', 24),
(75, 4, 'Perl', 5),
(76, 4, 'NoSQL', 28),
(77, 4, 'UI Design', 6),
(78, 4, 'Scrum', 5),
(79, 4, 'C#', 4),
(80, 4, 'CSS', 48),
(81, 4, 'React.js', 36),
(82, 5, 'Linux (Centos/Redhat/Ubuntu)', 12),
(83, 5, 'Python', 96),
(84, 5, 'AWS', 52),
(85, 5, 'VPN', 7),
(86, 5, 'DevOps', 7),
(87, 5, 'Ruby', 7),
(88, 5, 'TCP/IP', 6),
(89, 5, 'DNS', 7),
(90, 5, 'HTTP', 10),
(91, 5, 'Unix Command Line', 6),
(92, 5, 'Golang', 5),
(93, 5, 'ICMP', 5),
(94, 5, 'SSH', 5),
(95, 5, 'Distributed File Systems', 5),
(96, 5, 'Shell Scripting', 5),
(97, 5, 'Docker', 15),
(98, 5, 'Django', 10),
(99, 5, 'Security', 4),
(100, 5, 'Configuring Systems Monitoring Tools', 4),
(101, 5, 'Kubernetes', 6),
(102, 6, 'Python', 96),
(103, 6, 'SQL', 50),
(104, 6, 'Spark', 41),
(105, 6, 'Hadoop', 23),
(106, 6, 'Java', 86),
(107, 6, 'ETL Design/Data Pipelines', 20),
(108, 6, 'AWS', 52),
(109, 6, 'NoSQL', 28),
(110, 6, 'Hive', 15),
(111, 6, 'Kafka', 25),
(112, 6, 'Scala', 24),
(113, 6, 'PostgreSQL', 11),
(114, 6, 'Map Reduce', 10),
(115, 6, 'Oracle', 9),
(116, 6, 'MySQL', 23),
(117, 6, 'Redshift', 8),
(118, 6, 'Big Data Technologies', 8),
(119, 6, 'Vertica', 7),
(120, 6, 'Google BigQuery', 7),
(121, 6, 'Linux', 23),
(122, 7, 'Swift', 24),
(123, 7, 'Native Objective C', 17),
(124, 7, 'iOS Development', 12),
(125, 7, 'GitHub', 19),
(126, 7, 'Javascript', 78),
(127, 7, 'iOS UI/UX', 10),
(128, 7, 'iOS SDK', 9),
(129, 7, 'Hybrid Mobile Applications', 8),
(130, 7, 'Xcode', 9),
(131, 7, 'API\'s', 17),
(132, 7, 'AWS', 52),
(133, 7, 'C++', 27),
(134, 7, 'Test Driven Development', 6),
(135, 7, 'Agile Methodologies', 5),
(136, 7, 'RESTful API', 19),
(137, 7, 'UI Kit', 4),
(138, 7, 'HTTP', 10),
(139, 7, 'Multi-threading or Multi-threaded Programming', 4),
(140, 7, 'PostgreSQL', 11),
(141, 7, 'Cocoa Touch', 3),
(142, 8, 'Linux', 23),
(143, 8, 'AWS', 52),
(144, 8, 'EC2', 2),
(145, 8, 'Puppet', 2),
(146, 8, 'Go', 16),
(147, 8, 'Ruby', 1),
(148, 8, 'Docker', 15),
(149, 8, 'Kubernetes', 6),
(150, 8, 'CoreOS', 1),
(151, 8, 'Kernel', 1),
(152, 8, 'Namespaces', 1),
(153, 8, 'Cgroups', 1),
(154, 8, 'Unix', 1),
(155, 8, 'Ansilble', 1),
(156, 8, 'Saltstack', 1),
(157, 8, 'IPMI', 1),
(158, 8, 'Arista', 1),
(159, 8, 'Cisco', 1),
(160, 8, 'Network Protocols', 1),
(161, 8, 'DNS', 7),
(162, 8, 'TCP/IP', 6),
(163, 8, 'Layer2 Networking', 1),
(164, 8, 'HTTP', 10),
(165, 8, 'TLS/Certificate Authorities', 1),
(166, 8, 'Heroku', 1),
(167, 8, 'Stripe', 1),
(168, 8, 'Google Cloud Platform', 1),
(169, 8, 'Azure', 1),
(170, 9, 'Java', 86),
(171, 9, 'Kotlin', 7),
(172, 9, 'RxJava', 7),
(173, 9, 'Retrofit', 7),
(174, 9, 'Oops', 6),
(175, 9, 'C++', 27),
(176, 9, 'REST', 12),
(177, 9, 'UI Design', 6),
(178, 9, 'Android SDK', 5),
(179, 9, 'JSON', 5),
(180, 9, 'Git', 5),
(181, 9, 'Linux', 23),
(182, 9, 'Javascript', 78),
(183, 9, 'C', 14),
(184, 9, 'Dagger', 4),
(185, 9, 'JUnit', 4),
(186, 9, 'SOAP', 4),
(187, 9, 'UX Design', 4),
(188, 9, 'AJAX', 10),
(189, 10, 'SDLC', 3),
(190, 10, 'Develop Test Plans', 2),
(191, 10, 'Report and Track Software Defects', 2),
(192, 10, 'Mobile Testing Frameworks/Tools', 2),
(193, 10, 'Problem Solver and Critical Thinker', 2),
(194, 10, 'CI', 2),
(195, 10, 'Jenkins', 2),
(196, 10, 'Selenium', 1),
(197, 10, 'Selenium WebDriver', 1),
(198, 10, 'Automation Testing Using Selenium', 1),
(199, 10, 'Solve Semi-Complex Problems', 1),
(200, 10, 'Understanding of Mobile Technologies (iOS and/or Android)', 1),
(201, 10, 'Unit Testing', 1),
(202, 10, 'A/B Testing', 1),
(203, 10, 'iOS Development', 12),
(204, 10, 'Xcode', 9),
(205, 10, 'Software Design Skills', 1),
(206, 11, 'Linux', 23),
(207, 11, 'Go', 16),
(208, 11, 'PHP', 9),
(209, 11, 'Java', 86),
(210, 11, 'Kubernetes', 6),
(211, 11, 'Docker', 15),
(212, 11, 'Prometheus', 1),
(213, 11, 'PostgreSQL', 11),
(214, 11, 'Redis', 2),
(215, 11, 'Nginx', 1),
(216, 11, 'Algorithms/Data Structures', 1),
(217, 11, 'Hadoop', 23),
(218, 11, 'Clojure', 1),
(219, 11, 'Apache Solr', 1),
(220, 12, 'Python', 96),
(221, 12, 'Neo4J', 1),
(222, 12, 'Machine Learning', 1),
(223, 12, 'Statistics', 1),
(224, 12, 'Natural Language Processing (NLP)', 5),
(225, 12, 'ElasticSearch', 2),
(226, 12, 'Stanford CoreNLP', 1),
(227, 12, 'Jupyter Notebooks', 1),
(228, 12, 'Scikit-Learn', 9),
(229, 12, 'Pandas', 1),
(230, 12, 'NumPy', 1),
(231, 12, 'TensorFlow', 10),
(232, 12, 'Jupyter', 1),
(233, 12, 'SpaCy', 1),
(234, 12, 'Regular Expressions', 1),
(235, 12, 'Semantic Parsing', 1),
(236, 13, 'Go', 16),
(237, 13, 'ElasticSearch', 2),
(238, 13, 'Kafka', 25),
(239, 13, 'Redis', 2),
(240, 13, 'Cassandra', 1),
(241, 14, 'ML Frameworks', 18),
(242, 14, 'Python', 96),
(243, 14, 'Java', 86),
(244, 14, 'Spark', 41),
(245, 14, 'Deep Learning', 16),
(246, 14, 'C/C++', 10),
(247, 14, 'Keras', 10),
(248, 14, 'TensorFlow', 10),
(249, 14, 'Big Data Technologies', 8),
(250, 14, 'Scikit-Learn', 9),
(251, 14, 'Caffe', 8),
(252, 14, 'Javascript', 78),
(253, 14, 'AWS', 52),
(254, 14, 'SQL', 50),
(255, 14, 'Computer Vision', 6),
(256, 14, 'REST', 12),
(257, 14, 'Scala', 24),
(258, 14, 'Natural Language Processing (NLP)', 5),
(259, 14, 'PyTorch', 5);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `base_skills_v4`
--
ALTER TABLE `base_skills_v4`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `base_skills_v4`
--
ALTER TABLE `base_skills_v4`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=261;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
