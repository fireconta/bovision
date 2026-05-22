ALTER TABLE `devices` DROP INDEX `devices_deviceId_unique`;--> statement-breakpoint
ALTER TABLE `devices` ADD CONSTRAINT `user_device_unique` UNIQUE(`userId`,`deviceId`);