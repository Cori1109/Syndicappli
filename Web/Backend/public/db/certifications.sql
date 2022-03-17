-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 21, 2019 at 07:07 PM
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
-- Table structure for table `certifications`
--

CREATE TABLE `certifications` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `description` text CHARACTER SET utf8 NOT NULL,
  `logo_url` varchar(255) CHARACTER SET utf8 NOT NULL,
  `created_by` int(11) NOT NULL DEFAULT '-1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `certifications`
--

INSERT INTO `certifications` (`id`, `name`, `description`, `logo_url`, `created_by`) VALUES
(1, 'Adobe Certified Expert', 'Demonstrates professional level in proficiency with one or more Adobe software products. [http://www.adobe.com/training/certification.html]', 'null', -1),
(2, 'Appcelerator Titanium Certified Application Developer', 'Demonstrates skills and knowledge of native mobile application development using the Titanium framework. Familiar with JavaScript and comfortable writing intermediate level JavaScript-based scripts for the web or other environments. [http://www.appcelerator.com.s3.amazonaws.com/blog/www/tcad-certificiation-objectives.pdf]', 'null', -1),
(3, 'Appcelerator Titanium Certified Mobile Developer', 'Demonstrates skills and knowledge of ?best of breed? mobile application development that implements best practices and take advantage of a wide variety of cross-platform and platform-specific APIs. [http://www.appcelerator.com.s3.amazonaws.com/blog/www/tcad-certificiation-objectives.pdf]', 'null', -1),
(4, 'Associate Android Developer', 'The Associate Android Developer exam demonstrates the type of skill that a newer Android Developer should have as they begin their career. [https://developers.google.com/training/certification/]', 'https://developers.google.com/training/certification/', -1),
(5, 'BlackBerry Certified Builder for Native Application Development', 'Demonstrates experience building BlackBerry 10 applications using Native Software Development Kit and Cascades UI Framework. [http://developer.blackberry.com/blackberrybuilders/]', 'null', -1),
(6, 'BlackBerry Certified Builder for Web Application Development', 'Demonstrates experience building applications using the BlackBerry 10 WebWorks Software Development Kit. [http://developer.blackberry.com/blackberrybuilders/]', 'null', -1),
(7, 'Cambridge English: Advanced (CAE)', 'Cambridge English: Advanced (CAE) proves high achievement and English necessary to work and study in English [http://www.cambridgeenglish.org/exams-and-qualifications/advanced/]', 'null', -1),
(8, 'Cambridge English: Business Vantage or Higher', 'Cambridge English: Business Vantage / Higher proves upper-intermediate proficiency in English in a business setting. [http://www.cambridgeenglish.org/exams-and-qualifications/business-certificates/business-vantage/]', 'null', -1),
(9, 'Cambridge English: First (FCE)', 'Cambridge English: First, also known as First Certificate in English (FCE), is an upper-intermediate level qualification. It proves proficiency in everyday written and spoken English for work or study purposes. [http://www.cambridgeenglish.org/exams-and-qualifications/first/]', 'null', -1),
(10, 'Cambridge English: Proficiency (CPE)', 'Cambridge English: Proficiency, also known as Certificate of Proficiency in English (CPE), proves extremely high level proficiency in English. [http://www.cambridgeenglish.org/exams-and-qualifications/proficiency/]', 'null', -1),
(11, 'Cisco Certified Design Associate', 'Demonstrates the skills required to design basic campus, data center, security, voice, and wireless networks. [http://www.cisco.com/web/learning/certifications/associate/ccda/index.html]', 'null', -1),
(12, 'Cisco Certified Entry Networking Technician', 'Demonstrates the ability to install, operate and troubleshoot a small enterprise branch network, including basic network security. [http://www.cisco.com/web/learning/certifications/index.html]', 'null', -1),
(13, 'Cisco Certified Internetwork Expert', 'Network Engineers holding an active CCIE certification are recognized for their expert network engineering skills and mastery of Cisco products and solutions. [http://www.cisco.com/web/learning/certifications/index.html]', 'null', -1),
(14, 'Cisco Certified Network Associate', 'Demonstrates the ability to install, configure, operate, and troubleshoot medium-size routed and switched networks. [http://www.cisco.com/web/learning/certifications/index.html]', 'null', -1),
(15, 'Cisco Certified Network Associate Security', 'Demonstrates the skills required to develop a security infrastructure, recognize threats and vulnerabilities to networks, and mitigate security threats. [http://www.cisco.com/web/learning/certifications/associate/ccna_security/index.html]', 'null', -1),
(16, 'Cisco Certified Network Professional', 'Demonstrates the ability to plan, implement, verify and troubleshoot local and wide-area enterprise networks and work collaboratively with specialists on advanced security, voice, wireless and video solutions. [http://www.cisco.com/web/learning/certifications/index.html]', 'null', -1),
(17, 'CompTIA A+ Certification', 'This certification validates understanding of the most common hardware and software technologies in business and certifies the skills necessary to support complex IT infrastructures. [https://certification.comptia.org/certifications/a]', 'https://certification.comptia.org/certifications/a', -1),
(18, 'CompTIA Network+ Certification', 'CompTIA Network+ is a vendor neutral networking certification that is trusted around the world. It validates the essential knowledge and skills needed to confidently design, configure, manage and troubleshoot any wired and wireless networks. [https://certification.comptia.org/certifications/network]', 'https://certification.comptia.org/certifications/network', -1),
(19, 'CompTIA Project+ Certification', 'CompTIA Project+ certifies the knowledge and skills of professionals in project management. Project+ validates the ability to initiate, manage and support a project or business initiative. [https://certification.comptia.org/certifications/project]', 'https://certification.comptia.org/certifications/project', -1),
(20, 'CompTIA Security+ Certification', 'As a benchmark for best practices in IT security, this certification covers the essential principles for network security and risk management. [https://certification.comptia.org/certifications/security]', 'https://certification.comptia.org/certifications/security', -1),
(21, 'Duolingo Proficiency Exam in English', 'Affordable and convenient language certification from Duolingo Test Center.', '', -1),
(22, 'Google Ads Display Certification', 'The Display Advertising exam covers advanced concepts and best practices for creating, managing, measuring, and optimizing Display campaigns. [https://support.google.com/partners/answer/3154326?hl=en]', 'https://support.google.com/partners/answer/3154326?hl=en', -1),
(23, 'Google Ads Mobile Certification', 'The Mobile Advertising exam covers the basic and advanced concepts of mobile advertising, including ad formats, bidding and targeting, and campaign measurement and optimization. [https://support.google.com/partners/answer/3154326?hl=en]', 'https://support.google.com/partners/answer/3154326?hl=en', -1),
(24, 'Google Ads Search Certification', 'The Search Advertising exam covers basic and advanced concepts, including best practices for creating, managing, measuring, and optimizing search ad campaigns across the Search Network. [https://support.google.com/partners/answer/3154326?hl=en]', 'https://support.google.com/partners/answer/3154326?hl=en', -1),
(25, 'Google Ads Shopping Certification', 'The Shopping Advertising exam covers basic and advanced concepts, including creating a Merchant Center account and product data feed, and creating and managing Shopping campaigns. [https://support.google.com/partners/answer/3154326?hl=en]', 'https://support.google.com/partners/answer/3154326?hl=en', -1),
(26, 'Google Ads Video Certification', 'The Video Advertising exam covers basic and advanced concepts, including best practices for creating, managing, measuring, and optimizing video advertising campaigns across YouTube and the web. [https://support.google.com/partners/answer/3154326?hl=en]', 'https://support.google.com/partners/answer/3154326?hl=en', -1),
(27, 'Google Analytics Individual Qualification', 'The Google Analytics Individual Qualification (IQ) is a demonstration of proficiency in Google Analytics that is available to any individual who has passed the Google Analytics IQ exam. [https://support.google.com/partners/answer/6089738?hl=en]', 'https://support.google.com/partners/answer/6089738?hl=en', -1),
(28, 'Hubspot Agency Partner Certification', 'The bearer of this certificate is hereby deemed fully capable of delivering marketing services using the HubSpot platform. He/she has also demonstrated the ability to effectively execute and manage inbound marketing campaigns on behalf of HubSpot clients. Certification is active for 2 years after month issued. [http://academy.hubspot.com/certification?utm_campaign=upwork-freelancer-badges]', 'http://app.hubspot.com/l/academy-certification/certification/4', -1),
(29, 'Hubspot Contextual Marketing Certification', 'The bearer of this certificate is hereby deemed proficient in the use of HubSpot\'s tools to create a contextualized marketing experience. The bearer has demonstrated that he/she can effectively implement smart content and is versed in the best practices surrounding personalized marketing, website design and user experience. Certification is active for 13 months after month issued. [http://academy.hubspot.com/certification?utm_campaign=upwork-freelancer-badges]', 'http://app.hubspot.com/l/academy-certification/certification/5', -1),
(30, 'Hubspot Design Certification', 'The bearer of this certificate is hereby deemed proficient in crafting responsive, styled templates using HubSpot\'s design tools. The bearer has demonstrated that he/she can effectively apply template and style knowledge to HubSpot blog, page, landing page and email templates and is approved to sell these assets in the HubSpot Marketplace. Certification is active for 13 months after month issued. [http://academy.hubspot.com/certification?utm_campaign=upwork-freelancer-badges]', 'http://app.hubspot.com/l/academy-certification/certification/3', -1),
(31, 'Hubspot Inbound Certification', 'The bearer of this certificate is hereby deemed fully capable and skilled in Inbound Methodology. He/she has been tested on best practices and is capable of applying them to attract strangers, to convert visitors, to close leads and to delight customers.', 'https://academy.hubspot.com/courses/inbound', -1),
(32, 'Hubspot Inbound Certification (2017 Version)', 'The bearer of this certificate is hereby deemed fully capable and skilled in Inbound Methodology. He/she has been tested on best practices and is capable of applying them to attract strangers, to convert visitors, to close leads and to delight customers. Certification is active for 2 years after month issued. [http://academy.hubspot.com/certification?utm_campaign=upwork-freelancer-badges]', 'http://app.hubspot.com/l/academy-certification/certification/1', -1),
(33, 'HubSpot Marketing Software Certification', 'The bearer of this certificate is hereby deemed fully capable and skilled in Inbound Methodology and basic HubSpot software use. He/She has also demonstrated a mastery of the real-world application of inbound theory and practice using the HubSpot software. Certification is active for 13 months after month issued. [http://academy.hubspot.com/certification?utm_campaign=upwork-freelancer-badges]', 'http://app.hubspot.com/l/academy-certification/certification/2', -1),
(34, 'IELTS - English Proficiency Exam', 'IELTS is an English language proficiency exam that reports at all levels from low intermediate to very advanced. There is a general and academic version. [http://www.ielts.org/]', 'null', -1),
(35, 'Linux Professional Institute Certification - Level 1', 'Demonstrates basic Linux administration skill.  The participant can work at the Linux command line, perform basic maintenance tasks, install and configure a workstation and connect it to a LAN, or a standalone PC or the Internet. [http://www.lpi.org/linux-certifications/programs/lpic-1]', 'null', -1),
(36, 'Linux Professional Institute Certification - Level 2', 'Demonstrates that the participant can administer a small to medium-sized site, which includes: planning, implementing, securing and maintaining services; troubleshoot a small mixed (MS, Linux) network; supervise assistants; and advise management on automation and purchases. [http://www.lpi.org/linux-certifications/programs/lpic-2]', 'null', -1),
(37, 'Linux Professional Institute Certification - Level 3', 'Demonstrates advanced Linux administration skill:  Has several years professional experience with installing and maintaining Linux on many computers for various purposes; knows advanced and enterprise levels of Linux administration, including installation, management, security, troubleshooting and maintenance; Is able to use open-source tools to measure capacity planning and to troubleshoot resource problems; Is able to plan, architecture, design, build and implement a full environment using Samba and LDAP as well as measure the capacity planning and security of the services. [http://www.lpi.org/linux-certifications/programs/lpic-3]', 'null', -1),
(38, 'Magento 1 Certified Developer', 'Demonstrates skillful use of all business processes in Magento, such as: Structure of catalog, indexes, promotions, price generation logic; Architecture of checkout, payment/shipment methods, sales/order processing; Advanced core knowledge ? forms/grids full functionality, API, widgets, etc. [http://www.magentocommerce.com/certification/]', 'null', -1),
(39, 'Magento 1 Certified Developer Plus', 'Demonstrates skillful use of Magento Enterprise Edition and has proven knowledge of the details of the structure of Magento, which can give someone an advantage when implementing a site using Magento. [http://www.magentocommerce.com/certification/]', 'null', -1),
(40, 'Magento 1 Certified Front End Developer', 'Demonstrates thorough understanding of Magento\'s theming components and the ability to modify the user interface according to best practices, such as: templates, layouts, CSS, Javascript, images, translations, and design-related system configurations. [http://www.magentocommerce.com/certification/]', 'null', -1),
(41, 'Magento 1 Certified Solution Specialist', 'Magento 1 Certified Solution Specialists have demonstrated a thorough understanding of how to leverage Magento 1 functionality to satisfy ecommerce business goals according to best practices.', 'null', -1),
(42, 'Magento 2 Certified Associate Developer', 'The Magento 2 Associate Developer Certification is for a developer who is beginning their career as a Magento Developer and is designed to validate the student\'s skills and knowledge of Magento 2 in the areas of: UI modifications, database changes, admin modifications, customizations, catalog and checkout structure, and functionality changes. [https://u.magento.com/certification]', 'null', -1),
(43, 'Magento 2 Certified Professional Developer', 'Magento 2 Certified Professional Developers have demonstrated a deep understanding of how to customize Magento 2 source code in accordance with Magento best practices. [https://u.magento.com/certification]', 'null', -1),
(44, 'Magento 2 Certified Professional Developer Plus', 'This Magento 2 Professional Developer Plus Certification is for a senior Magento 2 developer/architect with 2 years of experience in customizing different areas of Magento Commerce, leading team(s) of Magento developers, leading projects, making key technical decisions on a Magento project, and working with customers to build project requirements. [https://u.magento.com/certification]', 'null', -1),
(45, 'Magento 2 Certified Professional Front End Developer', 'The Magento 2 Professional Front End Developer Certification is designed to validate the skills and knowledge needed to understand Magento\'s theming components and the ability to modify the user interface according to best practices.', 'null', -1),
(46, 'Magento 2 Certified Professional JavaScript Developer', 'The Magento 2 Professional JavaScript Developer Certification will validate the skills and knowledge needed to develop new JavaScript modules for Magento 2 and customize existing ones.', 'null', -1),
(47, 'Magento 2 Certified Solution Specialist', 'Magento 2 Certified Solution Specialists have demonstrated a thorough understanding of how to leverage Magento 2 functionality to satisfy ecommerce business goals according to best practices.', 'null', -1),
(48, 'Microsoft Certified Professional', 'Demonstrates professional skills and expertise with Microsoft platforms, tools and technologies. [https://www.microsoft.com/en-us/learning/microsoft-certified-professional.aspx]', '', -1),
(49, 'MongoDB Certified DBA Associate', 'Certifies administrators with knowledge of the concepts and mechanics of MongoDB. [https://university.mongodb.com/certification/dba/about]', 'https://university.mongodb.com/certification/dba/about', -1),
(50, 'MongoDB Certified Developer, Associate', 'Certifies individuals with knowledge of the fundamentals of designing and building applications using MongoDB. [https://university.mongodb.com/certification/developer/about]', 'https://university.mongodb.com/certification/developer/about', -1),
(51, 'Oracle Certified Associate', 'The?Oracle Certified Associate (OCA)??credential is the first step toward achieving an Oracle Certified Professional certification. The OCA credential ensures a candidate is equipped with fundamental skills, providing a strong foundation for supporting Oracle products.', 'null', -1),
(52, 'Oracle Certified Associate - Java', 'Demonstrates basic knowledge of the Java programming language including web, mobile and standard edition (SE), as well as the basics of UML object modeling language. [http://education.oracle.com/pls/web_prod-plq-dad/db_pages.getpage?page_id=146]', 'null', -1),
(53, 'Oracle Certified Expert', 'The?Oracle Certified Expert (OCE)??credentials recognize competency in specific, niche oriented technologies, architectures or domains. Credentials are independent of the traditional OCA, OCP, OCM hierarchy, but often build upon skills proven as an OCA or OCP. Competencies falling under the umbrella of the Expert program range from foundational skills to mastery of advanced technologies.', 'null', -1),
(54, 'Oracle Certified Expert - Java', 'Demonstrates expertise in professional Java programming.  Examination requires practical and theoretical knowledge of Java development techniques and frameworks. [http://education.oracle.com/pls/web_prod-plq-dad/db_pages.getpage?page_id=146]', 'null', -1),
(55, 'Oracle Certified Master', 'The?Oracle Certified Master (OCM)??credential recognizes the highest level of demonstrated skills, knowledge and proven abilities. OCMs are equipped to answer the most difficult questions and solve the most complex problems. The Oracle Certified Master certification validates a candidate\'s abilities through passing rigorous performance-based exams. The certification typically builds upon the fundamental skills of the OCA and the more advanced skills of the OCP.', 'null', -1),
(56, 'Oracle Certified Master - Java', 'Demonstrates advanced Java programming ability, verifying that the participant is able to write a real-world commercial application, for a variety of scenarios.  To earn the certification, the user is required to write a described application, extensively using custom file formats, distributed computing (JRMP) and advanced Swing features. [http://education.oracle.com/pls/web_prod-plq-dad/db_pages.getpage?page_id=146]', 'null', -1),
(57, 'Oracle Certified Professional', 'The?Oracle Certified Professional (OCP)??credential builds upon the fundamental skills demonstrated by the OCA. The Oracle Certified Professional has a command of a specific area of Oracle technology and demonstrates a high level of knowledge and skills. IT managers often use the OCP credential to evaluate the qualifications of employees and job candidates.', 'null', -1),
(58, 'Oracle Certified Professional - Java', 'Demonstrates the core features and constructs of the Java programming language.  Tests a wide range of Java\'s APIs and core features, starting from basics such as looping constructs and variables, to more complex topics such as Threads, Collections and Generics. [http://education.oracle.com/pls/web_prod-plq-dad/db_pages.getpage?page_id=146]', 'null', -1),
(59, 'Red Hat Certified Engineer', 'A Red Hat Certified Engineer (RHCE) is a Red Hat Certified System Administrator (RHCSA) who possesses the additional skills, knowledge, and abilities required of a senior system administrator responsible for Red Hat Enterprise Linux systems. [https://www.redhat.com/en/services/certification/rhce]', 'https://www.redhat.com/en/services/certification/rhce', -1),
(60, 'Red Hat Certified System Administrator', 'An IT professional who has earned the Red Hat Certified System Administrator (RHCSA) is able to perform the core system administration skills required in Red Hat Enterprise Linux environments. The credential is earned after successfully passing the Red Hat Certified System Administrator (RHCSA) Exam (EX200). [https://www.redhat.com/en/services/certification/rhcsa]', 'https://www.redhat.com/en/services/certification/rhcsa', -1),
(61, 'Salesforce Certified Administrator', 'Certified Administrators possess broad knowledge of customizing Salesforce, regularly configuring the platform, managing users, and looking for ways to get even more out of its features and capabilities. [http://certification.salesforce.com/administratoroverview]', 'http://certification.salesforce.com/administratoroverview', -1),
(62, 'Salesforce Platform App Builder', 'The Salesforce Platform App Builder credential is designed for those who can demonstrate skills and knowledge in designing, building, and implementing custom applications using the declarative customization capabilities of the Salesforce Platform.', 'http://certification.salesforce.com/developeroverview', -1),
(63, 'Salesforce Platform Developer I', 'The Salesforce Platform Developer I credential is designed for those who have the skills and experience to build custom declarative and programmatic applications on the Salesforce Platform.', 'https://trailhead.salesforce.com/credentials/developeroverview', -1),
(64, 'Salesforce Platform Developer II', 'The Salesforce Platform Developer II (PDII) credential is designed for those who have the skills and experience in advanced programmatic capabilities of the Salesforce Platform and data modeling to develop complex business logic and interfaces.', 'https://trailhead.salesforce.com/credentials/developeroverview', -1),
(65, 'Zend Certified Engineer', 'Demonstrates professional expertise in building and maintaining PHP based sites. [http://www.zend.com/en/services/certification/php-5-certification/]', 'null', -1),
(66, 'Zend Framework Certified Engineer', 'Demonstrates professional expertise in using the Zend Framework to build and maintain PHP based sites. [http://www.zend.com/en/services/certification/php-5-certification/]', 'null', -1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `certifications`
--
ALTER TABLE `certifications`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `certifications`
--
ALTER TABLE `certifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
