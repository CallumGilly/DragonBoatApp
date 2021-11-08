-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 08, 2021 at 08:17 PM
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
-- Database: `compscitest`
--

-- --------------------------------------------------------

--
-- Table structure for table `boat`
--

CREATE TABLE `boat` (
  `boatID` int(11) NOT NULL,
  `boatSize` tinyint(3) UNSIGNED NOT NULL,
  `widthArray` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`widthArray`)),
  `lengthArray` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`lengthArray`)),
  `boatName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `boatlink`
--

CREATE TABLE `boatlink` (
  `sessionID` int(11) NOT NULL,
  `boatID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `contactlink`
--

CREATE TABLE `contactlink` (
  `userName` varchar(255) NOT NULL,
  `phoneNumber` varchar(255) NOT NULL,
  `relation` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `contacttable`
--

CREATE TABLE `contacttable` (
  `phoneNumber` varchar(255) NOT NULL,
  `email` varchar(320) NOT NULL,
  `name` varchar(255) NOT NULL,
  `numberType` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `medicaltable`
--

CREATE TABLE `medicaltable` (
  `medicalID` int(11) NOT NULL,
  `Username` varchar(255) NOT NULL,
  `Description` text NOT NULL,
  `DateUpdated` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `paddlertable`
--

CREATE TABLE `paddlertable` (
  `username` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `weight` smallint(5) UNSIGNED NOT NULL,
  `weightLastUpdate` date NOT NULL,
  `gender` tinyint(4) NOT NULL DEFAULT 0,
  `password` varchar(255) NOT NULL,
  `BDAMemberShipNum` mediumint(9) NOT NULL,
  `BDAExpiry` year(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sessionlink`
--

CREATE TABLE `sessionlink` (
  `username` varchar(255) NOT NULL,
  `sessionID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sessiontable`
--

CREATE TABLE `sessiontable` (
  `sessionID` int(11) NOT NULL,
  `sessionDate` datetime NOT NULL,
  `Description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `team`
--

CREATE TABLE `team` (
  `teamName` varchar(255) NOT NULL,
  `Description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `teamlink`
--

CREATE TABLE `teamlink` (
  `teamName` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `boat`
--
ALTER TABLE `boat`
  ADD PRIMARY KEY (`boatID`);

--
-- Indexes for table `boatlink`
--
ALTER TABLE `boatlink`
  ADD PRIMARY KEY (`sessionID`,`boatID`),
  ADD KEY `boatID` (`boatID`);

--
-- Indexes for table `contactlink`
--
ALTER TABLE `contactlink`
  ADD PRIMARY KEY (`userName`,`phoneNumber`),
  ADD KEY `phoneNumber` (`phoneNumber`);

--
-- Indexes for table `contacttable`
--
ALTER TABLE `contacttable`
  ADD PRIMARY KEY (`phoneNumber`);

--
-- Indexes for table `medicaltable`
--
ALTER TABLE `medicaltable`
  ADD PRIMARY KEY (`medicalID`),
  ADD KEY `Username` (`Username`);

--
-- Indexes for table `paddlertable`
--
ALTER TABLE `paddlertable`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `sessionlink`
--
ALTER TABLE `sessionlink`
  ADD PRIMARY KEY (`username`,`sessionID`),
  ADD KEY `sessionID` (`sessionID`);

--
-- Indexes for table `sessiontable`
--
ALTER TABLE `sessiontable`
  ADD PRIMARY KEY (`sessionID`);

--
-- Indexes for table `team`
--
ALTER TABLE `team`
  ADD PRIMARY KEY (`teamName`);

--
-- Indexes for table `teamlink`
--
ALTER TABLE `teamlink`
  ADD PRIMARY KEY (`teamName`,`username`),
  ADD KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `boat`
--
ALTER TABLE `boat`
  MODIFY `boatID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `medicaltable`
--
ALTER TABLE `medicaltable`
  MODIFY `medicalID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sessiontable`
--
ALTER TABLE `sessiontable`
  MODIFY `sessionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `boatlink`
--
ALTER TABLE `boatlink`
  ADD CONSTRAINT `boatlink_ibfk_1` FOREIGN KEY (`boatID`) REFERENCES `boat` (`boatID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `contactlink`
--
ALTER TABLE `contactlink`
  ADD CONSTRAINT `contactlink_ibfk_1` FOREIGN KEY (`userName`) REFERENCES `paddlertable` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `contactlink_ibfk_2` FOREIGN KEY (`phoneNumber`) REFERENCES `contacttable` (`phoneNumber`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `medicaltable`
--
ALTER TABLE `medicaltable`
  ADD CONSTRAINT `medicaltable_ibfk_1` FOREIGN KEY (`Username`) REFERENCES `paddlertable` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sessionlink`
--
ALTER TABLE `sessionlink`
  ADD CONSTRAINT `sessionlink_ibfk_1` FOREIGN KEY (`username`) REFERENCES `paddlertable` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sessionlink_ibfk_2` FOREIGN KEY (`sessionID`) REFERENCES `sessiontable` (`sessionID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sessiontable`
--
ALTER TABLE `sessiontable`
  ADD CONSTRAINT `sessiontable_ibfk_1` FOREIGN KEY (`sessionID`) REFERENCES `boatlink` (`sessionID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `teamlink`
--
ALTER TABLE `teamlink`
  ADD CONSTRAINT `teamlink_ibfk_1` FOREIGN KEY (`teamName`) REFERENCES `team` (`teamName`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `teamlink_ibfk_2` FOREIGN KEY (`username`) REFERENCES `paddlertable` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
