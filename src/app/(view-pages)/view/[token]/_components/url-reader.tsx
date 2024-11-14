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
    <div >
    {/* Try using embed */}
    <embed src={url} className="w-screen h-screen" />

    {/* Fallback using object */}

  </div>
  );
};

export default LinkComponent;
