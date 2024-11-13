"use client";

import React from "react";
import { PublicPortalData } from "@/types/portal"; // Adjust the path to your types if needed
import Editor from "@/components/editor";
import { YooptaContentValue } from "@yoopta/editor";

type YooptaEditorComponentProps = {
  portalData: PublicPortalData;
};


const YooptaReader: React.FC<YooptaEditorComponentProps> = ({
  portalData,
  sectionId,
  content,
  editable = false,
}) => {
  return (
    <Editor
      key={sectionId}
      sectionId={sectionId}
      portalId={portalData.portalId}
      content={content as YooptaContentValue} // Ensure the type matches your content structure
      editable={editable}
    />
  );
};

export default YooptaReader;
