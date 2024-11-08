// app/view/[token]/page.tsx

import React from "react";
import { getPortalData } from "@/server/actions/portal/queries";
import PortalContent from "./_components/portal-sectons";

export default async function ViewPage({
    params: { token },
}: {
    params: { token: string };
}) {
    const portalData = await getPortalData(token);

    if (!portalData) {
        return <div>Not found</div>;
    }

    return (
        <>
            <PortalContent portalData={portalData} />
        </>
    );
}
