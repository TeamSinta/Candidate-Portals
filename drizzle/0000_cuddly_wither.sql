CREATE TYPE "public"."feedback-label" AS ENUM('Issue', 'Idea', 'Question', 'Complaint', 'Feature Request', 'Other');--> statement-breakpoint
CREATE TYPE "public"."feedback-status" AS ENUM('Open', 'In Progress', 'Closed');--> statement-breakpoint
CREATE TYPE "public"."org-member-role" AS ENUM('Viewer', 'Developer', 'Billing', 'Admin');--> statement-breakpoint
CREATE TYPE "public"."section-content-type" AS ENUM('yoopta', 'url', 'doc', 'notion', 'pdf');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('User', 'Admin', 'Super Admin');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sinta-candidate-portals_account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "sinta-candidate-portals_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sinta-candidate-portals_candidate" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	"stage" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"notes" jsonb,
	CONSTRAINT "sinta-candidate-portals_candidate_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sinta-candidate-portals_feedback" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(255) NOT NULL,
	"title" varchar(255),
	"message" text NOT NULL,
	"label" "feedback-label" NOT NULL,
	"status" "feedback-status" DEFAULT 'Open' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sinta-candidate-portals_link" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidateId" varchar(255) NOT NULL,
	"portalId" varchar(255) NOT NULL,
	"url" varchar(255),
	"customContent" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sinta-candidate-portals_link_candidateId_unique" UNIQUE("candidateId"),
	CONSTRAINT "sinta-candidate-portals_link_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sinta-candidate-portals_membersToOrganizations" (
	"id" varchar(255) DEFAULT gen_random_uuid(),
	"memberId" varchar(255) NOT NULL,
	"memberEmail" varchar(255) NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"role" "org-member-role" DEFAULT 'Viewer' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sinta-candidate-portals_membersToOrganizations_id_memberId_organizationId_pk" PRIMARY KEY("id","memberId","organizationId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sinta-candidate-portals_orgRequest" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(255) NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sinta-candidate-portals_organization" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"image" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"ownerId" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sinta-candidate-portals_portal" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"ownerId" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sinta-candidate-portals_section" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portalId" varchar(255) NOT NULL,
	"title" varchar(255),
	"content" jsonb,
	"contentType" "section-content-type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sinta-candidate-portals_session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sinta-candidate-portals_subscription" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lemonSqueezyId" text NOT NULL,
	"orderId" integer NOT NULL,
	"orgId" text NOT NULL,
	"variantId" integer NOT NULL,
	CONSTRAINT "sinta-candidate-portals_subscription_lemonSqueezyId_unique" UNIQUE("lemonSqueezyId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sinta-candidate-portals_tags" (
	"candidateId" varchar(255) NOT NULL,
	"tagName" varchar(255) NOT NULL,
	CONSTRAINT "sinta-candidate-portals_tags_candidateId_tagName_pk" PRIMARY KEY("candidateId","tagName")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sinta-candidate-portals_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255),
	"role" "role" DEFAULT 'User' NOT NULL,
	"isNewUser" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sinta-candidate-portals_verificationToken" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "sinta-candidate-portals_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sinta-candidate-portals_waitlistUser" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sinta-candidate-portals_waitlistUser_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sinta-candidate-portals_webhookEvent" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"eventName" text NOT NULL,
	"processed" boolean DEFAULT false,
	"body" jsonb NOT NULL,
	"processingError" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sinta-candidate-portals_account" ADD CONSTRAINT "sinta-candidate-portals_account_userId_sinta-candidate-portals_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."sinta-candidate-portals_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sinta-candidate-portals_candidate" ADD CONSTRAINT "sinta-candidate-portals_candidate_organizationId_sinta-candidate-portals_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."sinta-candidate-portals_organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sinta-candidate-portals_feedback" ADD CONSTRAINT "sinta-candidate-portals_feedback_userId_sinta-candidate-portals_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."sinta-candidate-portals_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sinta-candidate-portals_link" ADD CONSTRAINT "sinta-candidate-portals_link_candidateId_sinta-candidate-portals_candidate_id_fk" FOREIGN KEY ("candidateId") REFERENCES "public"."sinta-candidate-portals_candidate"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sinta-candidate-portals_link" ADD CONSTRAINT "sinta-candidate-portals_link_portalId_sinta-candidate-portals_portal_id_fk" FOREIGN KEY ("portalId") REFERENCES "public"."sinta-candidate-portals_portal"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sinta-candidate-portals_membersToOrganizations" ADD CONSTRAINT "sinta-candidate-portals_membersToOrganizations_memberId_sinta-candidate-portals_user_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."sinta-candidate-portals_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sinta-candidate-portals_membersToOrganizations" ADD CONSTRAINT "sinta-candidate-portals_membersToOrganizations_organizationId_sinta-candidate-portals_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."sinta-candidate-portals_organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sinta-candidate-portals_orgRequest" ADD CONSTRAINT "sinta-candidate-portals_orgRequest_userId_sinta-candidate-portals_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."sinta-candidate-portals_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sinta-candidate-portals_orgRequest" ADD CONSTRAINT "sinta-candidate-portals_orgRequest_organizationId_sinta-candidate-portals_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."sinta-candidate-portals_organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sinta-candidate-portals_organization" ADD CONSTRAINT "sinta-candidate-portals_organization_ownerId_sinta-candidate-portals_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."sinta-candidate-portals_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sinta-candidate-portals_portal" ADD CONSTRAINT "sinta-candidate-portals_portal_organizationId_sinta-candidate-portals_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."sinta-candidate-portals_organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sinta-candidate-portals_portal" ADD CONSTRAINT "sinta-candidate-portals_portal_ownerId_sinta-candidate-portals_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."sinta-candidate-portals_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sinta-candidate-portals_section" ADD CONSTRAINT "sinta-candidate-portals_section_portalId_sinta-candidate-portals_portal_id_fk" FOREIGN KEY ("portalId") REFERENCES "public"."sinta-candidate-portals_portal"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sinta-candidate-portals_session" ADD CONSTRAINT "sinta-candidate-portals_session_userId_sinta-candidate-portals_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."sinta-candidate-portals_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sinta-candidate-portals_subscription" ADD CONSTRAINT "sinta-candidate-portals_subscription_orgId_sinta-candidate-portals_organization_id_fk" FOREIGN KEY ("orgId") REFERENCES "public"."sinta-candidate-portals_organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sinta-candidate-portals_tags" ADD CONSTRAINT "sinta-candidate-portals_tags_candidateId_sinta-candidate-portals_candidate_id_fk" FOREIGN KEY ("candidateId") REFERENCES "public"."sinta-candidate-portals_candidate"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "sinta-candidate-portals_account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orgRequest_organizationId_idx" ON "sinta-candidate-portals_orgRequest" USING btree ("organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "sinta-candidate-portals_session" USING btree ("userId");