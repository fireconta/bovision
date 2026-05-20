CREATE TABLE `admin_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`targetUserId` int,
	`action` varchar(128) NOT NULL,
	`details` longtext,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admin_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`metricType` varchar(64) NOT NULL,
	`value` decimal(12,2),
	`prediction` longtext,
	`confidence` decimal(5,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `animals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(128),
	`breed` varchar(128),
	`age` int,
	`sex` enum('male','female'),
	`currentWeight` decimal(8,2),
	`photoUrl` varchar(512),
	`photoKey` varchar(255),
	`vacinationStatus` enum('up_to_date','pending','overdue') DEFAULT 'pending',
	`healthStatus` enum('healthy','sick','treatment') DEFAULT 'healthy',
	`notes` longtext,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `animals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `devices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`deviceId` varchar(32) NOT NULL,
	`userAgent` text,
	`ipAddress` varchar(45),
	`operatingSystem` varchar(64),
	`browser` varchar(64),
	`lastAccessed` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `devices_id` PRIMARY KEY(`id`),
	CONSTRAINT `devices_deviceId_unique` UNIQUE(`deviceId`)
);
--> statement-breakpoint
CREATE TABLE `financial` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('income','expense') NOT NULL,
	`category` varchar(128) NOT NULL,
	`amount` decimal(12,2) NOT NULL,
	`description` text,
	`date` date NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `financial_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `licenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`plan` enum('trial','monthly','annual') NOT NULL DEFAULT 'trial',
	`startDate` timestamp NOT NULL DEFAULT (now()),
	`expirationDate` timestamp NOT NULL,
	`status` enum('active','expired','cancelled') NOT NULL DEFAULT 'active',
	`isTrial` boolean DEFAULT true,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `licenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`deviceId` varchar(32),
	`action` varchar(128) NOT NULL,
	`details` longtext,
	`ipAddress` varchar(45),
	`status` enum('success','failed','warning') DEFAULT 'success',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` varchar(64) NOT NULL,
	`title` varchar(256) NOT NULL,
	`content` text,
	`isRead` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` decimal(12,2) NOT NULL,
	`method` enum('pix','boleto') NOT NULL,
	`status` enum('pending','completed','failed','cancelled') DEFAULT 'pending',
	`plan` enum('monthly','annual') NOT NULL,
	`transactionId` varchar(128),
	`metadata` longtext,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`deviceId` varchar(32) NOT NULL,
	`pinHash` varchar(255) NOT NULL,
	`attempts` int DEFAULT 0,
	`lockedUntil` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`reportType` varchar(64) NOT NULL,
	`title` varchar(256) NOT NULL,
	`content` longtext,
	`fileUrl` varchar(512),
	`fileKey` varchar(255),
	`format` enum('pdf','excel','csv'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`deviceId` varchar(32) NOT NULL,
	`sessionToken` varchar(255) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`ipAddress` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessions_sessionToken_unique` UNIQUE(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `vaccines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`animalId` int NOT NULL,
	`vaccineName` varchar(128) NOT NULL,
	`vaccinationDate` date NOT NULL,
	`nextDueDate` date,
	`veterinarian` varchar(128),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vaccines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `weights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`animalId` int NOT NULL,
	`weight` decimal(8,2) NOT NULL,
	`estimatedPrecision` decimal(5,2),
	`method` enum('manual','ai_camera','scale') DEFAULT 'manual',
	`photoUrl` varchar(512),
	`photoKey` varchar(255),
	`aiReport` longtext,
	`dailyGain` decimal(8,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `weights_id` PRIMARY KEY(`id`)
);
