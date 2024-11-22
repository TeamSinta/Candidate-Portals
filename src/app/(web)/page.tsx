import Features from "@/app/(web)/_components/features";
import {
    WebPageHeader,
    WebPageWrapper,
} from "@/app/(web)/_components/general-components";
import { Promotion } from "@/app/(web)/_components/promotion";
import { Testimonials } from "@/app/(web)/_components/testimonials";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { siteUrls } from "@/config/urls";
import Image from "next/image";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sinta Candidate Portals - Personalize experiences, track engagement, and collaborate seamlessly",
};




export const dynamic = "force-static";

export default async function HomePage() {
    return (
      <WebPageWrapper>

      <WebPageHeader
          badge="Currently in Beta 🎉"
          title="Sinta Portals: Find, Track, and Engage Top Talent"
      >
          <Balancer
              as="p"
              className="text-center text-base text-muted-foreground sm:text-lg "
          >
              Transform your hiring experience with personalized candidate portals. <br/>
              Engage, track, and communicate effortlessly. All in one place.
          </Balancer>

          <div className="flex items-center gap-3">
              <Link
                  href={siteUrls.calender}
                  className={buttonVariants({ variant: "outline" })}
              >
                  <Icons.circleLogo className="mr-2 h-4 w-4" /> Book a Demo
              </Link>

              <Link
                  href={siteUrls.waitlist}
                  className={buttonVariants()}
              >
                  Join the Beta Program
                  <span className="ml-1 font-light italic">

                  </span>
              </Link>
          </div>
      </WebPageHeader>

      <div className="-m-2 w-full rounded-xl bg-foreground/5 p-2 ring-1 ring-inset ring-foreground/10 lg:-m-4 lg:rounded-2xl lg:p-4">
          <div className="relative aspect-video w-full rounded-md bg-muted">
              <Image
                  src="https://utfs.io/f/NyiNiWCHmEc4z08OipjZOdvRm5YClyws7nXD6H32upZQP1Vi"
                  alt="Sinta Candidate Portal Preview"
                  fill
                  className="block rounded-md border border-border dark:hidden"
                  priority
              />

              <Image
                  src="https://utfs.io/f/NyiNiWCHmEc4p99juRUcWMOb5pFNtqeG4ruHKQzyLfZlPdYR"
                  alt="Sinta Candidate Portal Preview (Dark Mode)"
                  fill
                  className="hidden rounded-md border border-border dark:block"
                  priority
              />
          </div>
      </div>



            <Promotion />

            <Features />

            {/* <Testimonials /> */}
        </WebPageWrapper>
    );
}
