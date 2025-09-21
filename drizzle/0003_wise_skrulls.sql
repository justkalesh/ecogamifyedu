PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_lesson_chapter_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`lesson_key` text NOT NULL,
	`chapter_index` integer NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`best_score` integer DEFAULT 0 NOT NULL,
	`latest_score` integer DEFAULT 0 NOT NULL,
	`passed` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_lesson_chapter_attempts`("id", "user_id", "lesson_key", "chapter_index", "attempts", "best_score", "latest_score", "passed", "created_at", "updated_at") SELECT "id", "user_id", "lesson_key", "chapter_index", "attempts", "best_score", "latest_score", "passed", "created_at", "updated_at" FROM `lesson_chapter_attempts`;--> statement-breakpoint
DROP TABLE `lesson_chapter_attempts`;--> statement-breakpoint
ALTER TABLE `__new_lesson_chapter_attempts` RENAME TO `lesson_chapter_attempts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_lesson_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`lesson_key` text NOT NULL,
	`current_chapter` integer DEFAULT 0 NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`final_score` integer,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_lesson_progress`("id", "user_id", "lesson_key", "current_chapter", "completed", "final_score", "created_at", "updated_at") SELECT "id", "user_id", "lesson_key", "current_chapter", "completed", "final_score", "created_at", "updated_at" FROM `lesson_progress`;--> statement-breakpoint
DROP TABLE `lesson_progress`;--> statement-breakpoint
ALTER TABLE `__new_lesson_progress` RENAME TO `lesson_progress`;