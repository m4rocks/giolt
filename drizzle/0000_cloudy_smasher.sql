CREATE TABLE `blog_posts` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`writer_id` text,
	`reading_time` integer DEFAULT 0 NOT NULL,
	`related_project_id` integer,
	`date` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`draft` integer DEFAULT true NOT NULL,
	`organization_id` text NOT NULL,
	FOREIGN KEY (`related_project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_id_unique` ON `blog_posts` (`id`);--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`logo_url` text,
	`mission` text,
	`email` text,
	`about` text,
	`contact` text,
	`location` text,
	`theme` text DEFAULT 'light' NOT NULL,
	`volunteer_code_of_conduct` text,
	`team_section_enabled` integer DEFAULT true NOT NULL,
	`hide_giolt_branding` integer DEFAULT false NOT NULL,
	`subscription_id` text,
	`status` text DEFAULT 'inactive' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_id_unique` ON `organizations` (`id`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`code` text DEFAULT (lower(hex(randomblob(8)))) NOT NULL,
	`start_date` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`end_date` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`draft` integer DEFAULT true NOT NULL,
	`organization_id` text NOT NULL,
	`location` text,
	`site_address` text,
	`rules` text,
	`travel_details` text,
	`volunteer_number` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_id_unique` ON `projects` (`id`);