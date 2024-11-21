import { WaitlistForm } from "@/app/waitlist/_components/waitlist-form";
import { waitlistPageConfig } from "@/app/waitlist/_constants/page-config";
import { Icons } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { type Metadata } from "next";

export const metadata: Metadata = {
    title: waitlistPageConfig.title,
    description: waitlistPageConfig.description,
};

export default function Waitlist() {
    return (
        <main className="container flex min-h-screen w-screen flex-col items-center justify-center space-y-4">
            <Icons.circleLogo className="h-80 w-80 text-foreground sm:h-20 sm:w-20" />

            <h1 className=" z-10 bg-gradient-to-br from-muted to-foreground bg-clip-text text-center font-heading text-4xl  font-bold text-transparent md:text-7xl">
                Join the Beta
            </h1>
            <p className=" z-10 mx-auto max-w-lg text-center text-md text-muted-foreground">
                Welcome to {siteConfig.name}, effortless create candidate portals
                to highlight top talent. Get real-time engagement insights to focus on what matters.
                Sign up now for early access and updates!


            </p>

            <WaitlistForm />
        </main>
    );
}
