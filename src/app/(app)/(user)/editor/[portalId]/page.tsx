import { AppPageShell } from "@/app/(app)/_components/page-shell";
import { getPortalQuery } from "@/server/actions/portal/queries";
import { notFound } from "next/navigation";
import BlockEditor from "./_components/block-editor";
import GridPattern from "@/components/ui/grid-pattern";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import TitleEditorClient from "./_components/portal-edit-block";
import DotPattern from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import { HoverBar } from "./_components/hover-bar";
import EditorPageButtons from "./editor-page-buttons";

async function PortalEditPage({ params }: { params: { portalId: string } }) {
  const data = await getPortalQuery(params.portalId);
  if (!data.portal) return notFound();
  console.log("PORTAL DATA", data);

  return (
<div className="flex h-full w-full flex-col space-y-4">
{/* Header Section */}
<div className="flex justify-between">
      <div className="z-10 flex items-center gap-2 ">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <TitleEditorClient
          initialTitle={data.portal.title ?? ""}
          portalId={params.portalId}
        />

      </div>
      <EditorPageButtons key={0}  data={data} />
      </div>
      {/* Main Content Section */}
      <div className="relative flex h-full  flex items-start gap-8 border-t-2 border-t-border bg-background pt-8 dark:border-t-border dark:bg-background/30">
        {/* Grid Background Pattern and Block Editor */}
        <div className="absolute inset-0 z-5">
        <GridPattern
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
        )}
      />
        </div>
        <BlockEditor
          sections={data.sections || []}
          portalId={params.portalId}
          initialPortalData={data.portal}
        />
      </div>
      <HoverBar portalData={data} />
      </div>
  );
}

export default PortalEditPage;
