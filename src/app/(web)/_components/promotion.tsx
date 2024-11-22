import Balancer from "react-wrap-balancer";

export function Promotion() {
    return (
        <section className="flex min-h-96 w-full flex-col items-center justify-center gap-5 rounded-[26px] bg-foreground p-8 py-10 text-background">
            <Balancer
                as="h2"
                className="text-center font-heading text-3xl font-bold md:text-5xl"
            >
                Elevate Your Recruitment Process 🌟
            </Balancer>
            <Balancer
                as="p"
                className="text-center text-base leading-relaxed text-background/70 sm:text-xl"
            >
                Sinta Candidate Portals simplify your hiring process by bringing
                everything candidates need into one place. Personalize
                experiences, track engagement, and collaborate seamlessly—all
                while saving time and effort.{" "}
                <span className="rounded-[5px] bg-background p-1 font-semibold text-foreground">
                    Designed for Recruiters.
                </span>
            </Balancer>
        </section>
    );
}
