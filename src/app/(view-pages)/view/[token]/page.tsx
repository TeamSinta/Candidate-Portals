// app/view/[token]/page.tsx

import React from "react";
import { getPublicPortalData } from "@/server/actions/portal/queries";
import PortalContent from "./_components/portal-sectons";

export default async function ViewPage({
    params: { token },
}: {
    params: { token: string };
}) {
    const portalData = await getPublicPortalData(token);
    console.log(portalData, "portaldata");

    if (!portalData) {
        return <div>Not found</div>;
    }

    return (
        <>
            <PortalContent portalData={portalData} />
        </>
    );
}
