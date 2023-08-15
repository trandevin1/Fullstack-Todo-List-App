-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 13, 2023 at 09:56 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `431fin_trandevin`
--
CREATE DATABASE IF NOT EXISTS `todo_app` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `todo_app`;

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `create_list`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `create_list` (IN `list_name` VARCHAR(255))   BEGIN
INSERT INTO `list` (`idx`, `name`, `created`) 
VALUES (NULL, list_name, current_timestamp());
END$$

DROP PROCEDURE IF EXISTS `create_list_item`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `create_list_item` (IN `data` VARCHAR(255), IN `L_idx` INT(11))   BEGIN
INSERT INTO `list_item` (`idx`, `text`, `marked_complete`, `list_idx`, `created`) 
VALUES (NULL, `data`, '0', `L_idx`, current_timestamp());
END$$

DROP PROCEDURE IF EXISTS `update_list_name`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_list_name` (IN `new_list_name` VARCHAR(255), IN `L_idx` INT(11))   BEGIN
UPDATE `list`
SET `name`=`new_list_name` 
WHERE idx=`L_idx`;
END$$

DROP PROCEDURE IF EXISTS `update_marked_complete`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_marked_complete` (IN `bool` BOOLEAN, IN `LI_idx` INT(11))   BEGIN
UPDATE `list_item` 
SET `marked_complete`= `bool`
WHERE idx=`LI_idx`;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `list`
--

DROP TABLE IF EXISTS `list`;
CREATE TABLE `list` (
  `idx` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `list`
--

INSERT INTO `list` (`idx`, `name`, `created`) VALUES
(69, 'cars to get', '2023-05-13 12:47:44'),
(70, 'groceries', '2023-05-13 12:47:44'),
(71, 'homeworks', '2023-05-13 12:47:44'),
(75, 'new list also', '2023-05-13 12:55:51');

-- --------------------------------------------------------

--
-- Table structure for table `list_item`
--

DROP TABLE IF EXISTS `list_item`;
CREATE TABLE `list_item` (
  `idx` int(11) NOT NULL,
  `text` varchar(255) NOT NULL,
  `marked_complete` tinyint(1) NOT NULL DEFAULT 0,
  `list_idx` int(11) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `list_item`
--

INSERT INTO `list_item` (`idx`, `text`, `marked_complete`, `list_idx`, `created`) VALUES
(43, 'Nissan GTR', 0, 69, '2023-05-13 12:48:01'),
(44, 'Honda Accord', 1, 69, '2023-05-13 12:48:17'),
(45, 'Toyota Civic', 1, 69, '2023-05-13 12:48:33'),
(46, 'eggs', 0, 70, '2023-05-13 12:48:52'),
(47, 'salt & pepper', 0, 70, '2023-05-13 12:49:00'),
(48, 'bread', 1, 70, '2023-05-13 12:49:05'),
(49, 'frozen pizza', 0, 70, '2023-05-13 12:49:13'),
(50, 'CPSC 431 Final Project', 1, 71, '2023-05-13 12:49:40'),
(51, 'Algorithms Project', 0, 71, '2023-05-13 12:50:09'),
(60, 'task 2', 0, 75, '2023-05-13 12:55:56');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `list`
--
ALTER TABLE `list`
  ADD PRIMARY KEY (`idx`);

--
-- Indexes for table `list_item`
--
ALTER TABLE `list_item`
  ADD PRIMARY KEY (`idx`),
  ADD KEY `fk_list_idx` (`list_idx`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `list`
--
ALTER TABLE `list`
  MODIFY `idx` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `list_item`
--
ALTER TABLE `list_item`
  MODIFY `idx` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `list_item`
--
ALTER TABLE `list_item`
  ADD CONSTRAINT `fk_list_idx` FOREIGN KEY (`list_idx`) REFERENCES `list` (`idx`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
