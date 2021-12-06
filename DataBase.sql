-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 17, 2021 at 04:03 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 7.3.31

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
-- Table structure for table `boat`
--

CREATE TABLE `boat` (
  `boatID` int(11) NOT NULL,
  `boatSize` tinyint(3) UNSIGNED NOT NULL,
  `widthArray` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`widthArray`)),
  `lengthArray` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`lengthArray`)),
  `boatName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `boat`
--

INSERT INTO `boat` (`boatID`, `boatSize`, `widthArray`, `lengthArray`, `boatName`) VALUES
(1, 20, '[\"Json\",\"Dis\",\"You\"]', '[\"Json\",\"Dis\",\"You\"]', 'The dragon of dreams');

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
('cwjg21', ':II50yCJw\'tA}VQ0H)sC[I4$Q:m1[x#}\'QtPL[:<_xcq#s>ao7,wtaOfCQ^/!', '2021-11-11'),
('cwjg21', 'DxC<3UZQ0Z4w6n0&{Wr62Mj:I<6!m=xIR\"HpMTtt9bEwG6{xI)o{QAT)w]#WH', '2021-11-15');

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
  `weight` smallint(5) UNSIGNED DEFAULT NULL,
  `weightLastUpdate` date DEFAULT NULL,
  `gender` tinyint(4) NOT NULL DEFAULT 0,
  `password` varchar(255) NOT NULL,
  `BDAMemberShipNum` mediumint(9) DEFAULT NULL,
  `BDAExpiry` year(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `paddlertable`
--

INSERT INTO `paddlertable` (`username`, `firstName`, `lastName`, `weight`, `weightLastUpdate`, `gender`, `password`, `BDAMemberShipNum`, `BDAExpiry`) VALUES
('cwjg21', 'Callum', 'Gilchrist', 56, '2021-11-02', 1, '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', NULL, NULL);

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
-- Table structure for table `signuplinks`
--

CREATE TABLE `signuplinks` (
  `linkID` varchar(255) NOT NULL,
  `creator` varchar(255) NOT NULL,
  `maxUses` int(11) DEFAULT NULL,
  `expiration` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `signuplinks`
--

INSERT INTO `signuplinks` (`linkID`, `creator`, `maxUses`, `expiration`) VALUES
('averyrealSignUpLink', 'cwjg21', NULL, NULL),
('linkwithExpiration', 'cwjg21', NULL, '2021-11-16'),
('linkWithMaxUses', 'cwjg21', -1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `team`
--

CREATE TABLE `team` (
  `teamName` varchar(255) NOT NULL,
  `Description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `team`
--

INSERT INTO `team` (`teamName`, `Description`) VALUES
('Hurricanes', 'The hurricanes dragon boat team, any new members welcome.');

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
-- Indexes for table `cookietable`
--
ALTER TABLE `cookietable`
  ADD PRIMARY KEY (`username`,`cookie`);

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
-- Indexes for table `signuplinks`
--
ALTER TABLE `signuplinks`
  ADD PRIMARY KEY (`linkID`),
  ADD KEY `creator` (`creator`);

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
  MODIFY `boatID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `medicaltable`
--
ALTER TABLE `medicaltable`
  MODIFY `medicalID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sessiontable`
--
ALTER TABLE `sessiontable`
  MODIFY `sessionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `boatlink`
--
ALTER TABLE `boatlink`
  ADD CONSTRAINT `boatlink_ibfk_1` FOREIGN KEY (`boatID`) REFERENCES `boat` (`boatID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `boatlink_ibfk_2` FOREIGN KEY (`sessionID`) REFERENCES `sessiontable` (`sessionID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `contactlink`
--
ALTER TABLE `contactlink`
  ADD CONSTRAINT `contactlink_ibfk_1` FOREIGN KEY (`userName`) REFERENCES `paddlertable` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `contactlink_ibfk_2` FOREIGN KEY (`phoneNumber`) REFERENCES `contacttable` (`phoneNumber`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cookietable`
--
ALTER TABLE `cookietable`
  ADD CONSTRAINT `cookietable_ibfk_1` FOREIGN KEY (`username`) REFERENCES `paddlertable` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Constraints for table `signuplinks`
--
ALTER TABLE `signuplinks`
  ADD CONSTRAINT `signuplinks_ibfk_1` FOREIGN KEY (`creator`) REFERENCES `paddlertable` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

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
