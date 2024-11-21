import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import DotPattern from "@/components/ui/dot-pattern";
import FlickeringGrid from "@/components/ui/flickering-grid";
import { Icons } from "@/components/ui/icons";
import { siteUrls } from "@/config/urls";
import { cn } from "@/lib/utils";
import Link from "next/link";

type AuthLayoutProps = {
    children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="grid min-h-screen w-screen grid-cols-1 px-4 lg:grid-cols-3">
            <main className="col-span-2 flex items-center justify-center">
                {children}
            </main>

            <section className="relative col-span-1 hidden flex-col items-start justify-center gap-6 border-l border-border bg-muted/30 p-10 lg:flex">
                {/* Flickering Background */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <AnimatedGridPattern
                        numSquares={30}
                        maxOpacity={0.1}
                        duration={3}
                        repeatDelay={1}
                        className={cn(
                            "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
                            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
                        )}
                    />
                </div>

                {/* Content in Front */}
                <Icons.logo as="h3" />
                <h2 className="text-3xl font-medium">
                    Launch Your Portals with Ease
                </h2>
                <p className="font-light text-muted-foreground">
                    Simplify communication and engagement. Build and customize
                    your portal in minutes, just like Notion, and track
                    engagement effortlessly.{" "}
                    <Link
                        href={siteUrls.teamsinta}
                        className="font-medium text-foreground underline underline-offset-4"
                    >
                        teamsinta.com
                    </Link>
                </p>
            </section>
        </div>
    );
}
