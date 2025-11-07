CREATE TABLE `documentRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestedBy` varchar(100) NOT NULL,
	`requestedByOther` varchar(100),
	`documentType` enum('PDF','ONLINE') NOT NULL,
	`onlinePlatform` varchar(100),
	`signedBy` varchar(100) NOT NULL,
	`signedByOther` varchar(100),
	`signatureDate` timestamp NOT NULL,
	`responsible` varchar(100) NOT NULL,
	`responsibleOther` varchar(100),
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documentRecords_id` PRIMARY KEY(`id`)
);
