import { AppPageShell } from "@/app/(app)/_components/page-shell";
import { getPortalQuery } from "@/server/actions/portal/queries";
import { Terminal } from "lucide-react";
import { notFound } from "next/navigation";
import BlockEditor from "./_components/block-editor";
import EditorPageButtons from "./editor-page-buttons";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import DotPattern from "@/components/ui/dot-pattern";
import GridPattern from "@/components/ui/grid-pattern";

async function PortalEditPage({ params }: { params: { portalId: string } }) {
    const data = await getPortalQuery(params.portalId);
    if (!data.portal) return notFound();
    console.log("PORTAL DATA", data);

    return (
        <AppPageShell
            title={"Portals"}
            description="Edit the contents of your portal here"
            buttons={[<EditorPageButtons key={0} portalId={params.portalId} />]}
            breadcrumbs={[data.portal.title ?? "Untitled"]}
        >




            <div
                className="flex h-full min-h-[80vh] flex-col items-center gap-8 border-t-2 border-t-border bg-background pt-8 dark:border-t-border dark:bg-background/30"

            >
          <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn(
          "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]",
        )}
      />

                <div className=" z-10 flex w-max gap-2 rounded-sm  border bg-white p-2 transition-shadow duration-300 hover:shadow-lg lg:min-w-[30rem]">
                    <Terminal className="mt-1 h-4" />
                    <div className="flex flex-col text-sm">
                        <div className="font-medium">Heads up!</div>
                        <div className="">
                            Click Preview to see the Candidate Experience Live
                        </div>
                    </div>
                </div>
                <BlockEditor
                    sections={data.sections || []}
                    portalId={params.portalId}
                    initialPortalData={data.portal}
                />

            </div>
        </AppPageShell>
    );
}

export default PortalEditPage;
