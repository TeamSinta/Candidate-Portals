"use client";

import React from "react";

type LinkComponentProps = {
    urlData: {
        url: string;
        title: string;
    };
};

const LinkComponent: React.FC<LinkComponentProps> = ({ urlData }) => {
    const { url, title } = urlData;

    return (
        <div className="h-full">
            {/* Try using embed */}
            <embed src={url} className="h-full w-full" />

            {/* Fallback using object */}
        </div>
    );
};

export default LinkComponent;
