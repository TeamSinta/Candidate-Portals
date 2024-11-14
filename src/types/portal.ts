export interface PortalData {
  portal: {
    portalId: string;
    title: string | null; // Allow title to be string or null
  };
  sections: {
    contentType: "yoopta" | "url" | "doc" | "notion" | "pdf";
    title: string | null; // Allow title to be string or null
  }[];
  links: {
    url: string | null; // Allow url to be string or null
    candidateId: string;
    linkId: string;
  }[];
  candidates: {
    name: string;
    email: string | null; // Allow email to be string or null
    role: string | null; // Allow role to be string or null
    linkedin: string | null; // Allow linkedin to be string or null
    candidateId: string;
  }[];
}


// Update the Section type to use the specific content types from PortalData
export type Section = {
  sectionId: Key | null | undefined;
  id: string;
  title: string;
  content: any;
  contentType: "yoopta" | "url" | "doc" | "notion" | "pdf"; // Use the union type
};


export type PublicPortalData = {
  candidateName: string;
  candidateEmail: string;
  userId: string;
  portalId: string;
  linkId: string;
  customContent: object | string | null;
  sections: Section[];
  links: {
    url: string | null; // Allow url to be string or null
    candidateId: string;
  }[];
};

export type PortalContentProps = {
  portalData: PortalData;
};


export interface SectionData {
  link_id: string;
  session_id: string;
  section_id: string;
}


// Extend the SectionData interface to include additional fields
export interface ExtendedSectionData extends SectionData {
  section_title: string;
  total_duration: number | null;
  last_view_timestamp?: string; // Optional in case you want to use it in the future
}

// Use the existing PortalData interface
export interface MergedSectionData {
  section_id: string;
  section_title: string;
  total_duration: number;
}

export interface MergedEngagedData {
  link_id: string;
  portal_id: string;
  user_id: string;
  total_duration: number; // Total duration in seconds
  last_view_timestamp: string; // Timestamp in string format
  candidate_name: string; // Name of the candidate
}


export type PortalReaderData = {
  candidateName: string;
  candidateEmail: string | null;
  roleTitle: string;
  orgName: string;
  userName: string;
  portalId: string;
  linkId: string;
  userId: string
  customContent: object | string | null;
  sections: Section[];
};
