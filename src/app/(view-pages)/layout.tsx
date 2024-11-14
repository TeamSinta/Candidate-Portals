// app/layouts/AppLayout.tsx

import React from "react";
import PageWithLoadingEffect from "./view/[token]/_components/page-loading-effect";

type AppLayoutProps = {
    children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
    return <PageWithLoadingEffect>{children}</PageWithLoadingEffect>;
}
