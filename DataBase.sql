-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 14, 2022 at 10:07 AM
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
(1, 20, '[\"Json\",\"Dis\",\"You\"]', '[\"Json\",\"Dis\",\"You\"]', 'The dragon of dreams'),
(2, 20, '[0.89,0.97,1.06,1.11,1.15,1.15,1.11,1.06,0.97,0.89]', '[]', 'TestBoat');

-- --------------------------------------------------------

--
-- Table structure for table `boatlink`
--

CREATE TABLE `boatlink` (
  `sessionID` int(11) NOT NULL,
  `boatID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `boatlink`
--

INSERT INTO `boatlink` (`sessionID`, `boatID`) VALUES
(5, 2),
(7, 1),
(8, 1),
(11, 1),
(13, 1);

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
('Coach1', '2[Ojv^lo{$eOI/50qO_Y_P|a*t-/P.BL`}\'b8pk/K8+#hecNSm$Hz&Oqm|>q:', '2022-01-07'),
('Coach1', '=>mC02@p-|m0b7m{b|iTO-41pch8NB]wKH(<lVn(nK)Q_eH$og|6Q4&y|`XT6', '2022-01-01'),
('Coach1', 'ct,yO)5n#$\\\'sX6\"8O`6AD2hF..2Ka`^7\"M`bqLoWJH4aFkI64o%a5Vy,eeeP', '2022-01-05'),
('Coach1', 'e9h}:*99nx6tuB5m!\"w7nlLh-8EIs0D?@)`jb!F8=.w!`m$.W[OGXwInW,pE-', '2022-01-09'),
('Coach1', 'LLBhec8W@Y:Si,=U$wo\\Md7>;N^5h^ZA00CYKp|}exA#8.BUZHS|8B!?v*yHR', '2022-01-07'),
('Coach1', 'OYA|#^rW_Lk\'rKxI}{OzzP)cx+Jl4k`5paygnEM?Uc{g_k7#_S\'xYco!5uRdV', '2022-01-05'),
('Coach1', 'qlw_--07T;qgiBG.6,+h<3(C\\=pwFzxOSj\'OE\'?>ke@y_a%T<gh9(32Vv(]lt', '2022-01-06'),
('Coach1', '_No^4\"?o9Pl#\"86/@Cdm=hMW\"y*JRBB2MKeTOYgs=\'PmO:2bN21193#scTp;q', '2022-01-13'),
('paddler1', '5EM!@QIj@&9if0sj4LP\"fFQz:r`4X6`C\"Mz)EAU_0jF.$!2c[fOw_!q5\'G@cj', '2022-01-05'),
('paddler1', 'L7@Y?n,w(B,tf}**OBV\'vCzS=TN4iY5XfSux\"ZWU9}n!LXwK%0r@GD<ja&0`\\', '2022-01-09'),
('paddler1', 'qnM;o}A{&It2K,4,>fz$-#&tPmf*\'uE}:z9Q|Je{I[C8(b4?NN*kesk\';_zfe', '2021-12-30');

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
  `privilegeLevel` int(11) NOT NULL DEFAULT 0 COMMENT '0=Paddler, 1=Coach, 2=Admin, 3=Owner',
  `BDAMemberShipNum` mediumint(9) DEFAULT NULL,
  `BDAExpiry` year(4) DEFAULT NULL,
  `preference` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preference`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `paddlertable`
--

INSERT INTO `paddlertable` (`username`, `firstName`, `lastName`, `weight`, `weightLastUpdate`, `gender`, `password`, `privilegeLevel`, `BDAMemberShipNum`, `BDAExpiry`, `preference`) VALUES
('Coach1', 'Coach', 'One', NULL, NULL, 1, '1d707811988069ca760826861d6d63a10e8c3b7f171c4441a6472ea58c11711b', 1, NULL, NULL, NULL),
('paddler1', 'paddler', '1', 50, '2021-12-12', 1, '1d707811988069ca760826861d6d63a10e8c3b7f171c4441a6472ea58c11711b', 0, NULL, NULL, NULL),
('paddler2', 'paddler', '2', 51, '2021-12-12', 1, '1d707811988069ca760826861d6d63a10e8c3b7f171c4441a6472ea58c11711b', 0, NULL, NULL, NULL),
('paddler3', 'paddler', '3', 52, '2021-12-12', 1, '1d707811988069ca760826861d6d63a10e8c3b7f171c4441a6472ea58c11711b', 0, NULL, NULL, NULL),
('paddler4', 'paddler', '4', 54, '2021-12-12', 2, '1d707811988069ca760826861d6d63a10e8c3b7f171c4441a6472ea58c11711b', 0, NULL, NULL, NULL),
('paddler5', 'paddler', '5', 55, '2021-12-12', 2, '1d707811988069ca760826861d6d63a10e8c3b7f171c4441a6472ea58c11711b', 0, NULL, NULL, NULL),
('paddler6', 'paddler', '6', 56, '2021-12-12', 1, '1d707811988069ca760826861d6d63a10e8c3b7f171c4441a6472ea58c11711b', 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sessionlink`
--

CREATE TABLE `sessionlink` (
  `username` varchar(255) NOT NULL,
  `sessionID` int(11) NOT NULL,
  `tempSide` varchar(2) DEFAULT NULL,
  `tempRow` int(12) DEFAULT NULL,
  `isLocked` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sessionlink`
--

INSERT INTO `sessionlink` (`username`, `sessionID`, `tempSide`, `tempRow`, `isLocked`) VALUES
('paddler1', 5, NULL, NULL, 0),
('paddler1', 8, 'L', 0, 0),
('paddler2', 5, 'R', 0, 1),
('paddler3', 5, 'R', 9, 0),
('paddler4', 5, 'L', 9, 0),
('paddler5', 5, 'L', 0, 1),
('paddler6', 5, 'R', 3, 0),
('paddler6', 6, 'L', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `sessiontable`
--

CREATE TABLE `sessiontable` (
  `sessionID` int(11) NOT NULL,
  `sessionDate` datetime NOT NULL,
  `Description` text NOT NULL,
  `designSaved` tinyint(1) NOT NULL DEFAULT 0,
  `helm` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sessiontable`
--

INSERT INTO `sessiontable` (`sessionID`, `sessionDate`, `Description`, `designSaved`, `helm`) VALUES
(5, '2022-05-31 16:11:32', 'Test session', 1, 'Coach1'),
(6, '2022-01-18 12:00:21', 'Session In the future\r\n', 1, NULL),
(7, '2022-01-06 12:02:38', 'Session on the sixth', 1, NULL),
(8, '2022-01-31 12:03:08', 'A session for dragon boating', 1, NULL),
(9, '2022-01-13 13:08:00', 'dasfasdf', 0, NULL),
(10, '2022-01-11 13:19:00', 'dasfasdf', 0, NULL),
(11, '2022-01-27 13:24:00', 'A test for session creation', 1, NULL),
(12, '2022-01-26 13:27:00', 'Session Creation Test', 0, NULL),
(13, '2022-01-30 15:21:00', 'home test session', 1, NULL),
(14, '2022-03-02 15:30:00', 'Session Creation Test', 0, NULL);

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
  ADD PRIMARY KEY (`sessionID`),
  ADD KEY `sessionDate` (`sessionDate`),
  ADD KEY `helm` (`helm`);

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
  MODIFY `boatID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `medicaltable`
--
ALTER TABLE `medicaltable`
  MODIFY `medicalID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sessiontable`
--
ALTER TABLE `sessiontable`
  MODIFY `sessionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
-- Constraints for table `sessiontable`
--
ALTER TABLE `sessiontable`
  ADD CONSTRAINT `sessiontable_ibfk_1` FOREIGN KEY (`helm`) REFERENCES `paddlertable` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

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
