-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 11, 2021 at 10:53 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 7.4.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `compscinea`
--

-- --------------------------------------------------------

--
-- Table structure for table `cookietable`
--

CREATE TABLE `cookietable` (
  `username` varchar(255) NOT NULL,
  `cookie` varchar(255) NOT NULL,
  `dateMade` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cookietable`
--

INSERT INTO `cookietable` (`username`, `cookie`, `dateMade`) VALUES
('cwjg21', ':II50yCJw\'tA}VQ0H)sC[I4$Q:m1[x#}\'QtPL[:<_xcq#s>ao7,wtaOfCQ^/!', '2021-11-11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cookietable`
--
ALTER TABLE `cookietable`
  ADD PRIMARY KEY (`username`,`cookie`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cookietable`
--
ALTER TABLE `cookietable`
  ADD CONSTRAINT `cookietable_ibfk_1` FOREIGN KEY (`username`) REFERENCES `paddlertable` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
