CREATE TABLE `badges` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`icon` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `badges_code_unique` ON `badges` (`code`);--> statement-breakpoint
CREATE TABLE `lesson_performance` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_key_id` integer NOT NULL,
	`lesson_key` text NOT NULL,
	`chapters_completed` integer DEFAULT 0 NOT NULL,
	`total_chapters` integer NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`last_activity_at` integer NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_key_id`) REFERENCES `user_keys`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_badges` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_key_id` integer NOT NULL,
	`badge_id` integer NOT NULL,
	`awarded_at` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_key_id`) REFERENCES `user_keys`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`badge_id`) REFERENCES `badges`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_keys` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ext_user_id` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_keys_ext_user_id_unique` ON `user_keys` (`ext_user_id`);