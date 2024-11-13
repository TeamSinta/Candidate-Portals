ALTER TYPE "public"."section-content-type" RENAME TO "sectionContentType";--> statement-breakpoint
ALTER TABLE "sinta-candidate-portals_candidate" RENAME COLUMN "stage" TO "linkedin";--> statement-breakpoint
ALTER TABLE "sinta-candidate-portals_section" ADD COLUMN "index" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "public"."sinta-candidate-portals_section" ALTER COLUMN "contentType" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."sectionContentType";--> statement-breakpoint
CREATE TYPE "public"."sectionContentType" AS ENUM('Notion Editor', 'Link', 'Document', 'notion', 'pdf');--> statement-breakpoint
ALTER TABLE "public"."sinta-candidate-portals_section" ALTER COLUMN "contentType" SET DATA TYPE "public"."sectionContentType" USING "contentType"::"public"."sectionContentType";