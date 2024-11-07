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
  }[];
  candidates: {
    name: string;
    email: string | null; // Allow email to be string or null
    role: string | null; // Allow role to be string or null
    linkedin: string | null; // Allow linkedin to be string or null
    candidateId: string;
  }[];
}


export type Section = {
  id: string;
  title: string;
  content: any;
  contentType: string;
};

export type PublicPortalData = {
  candidateName: string;
  candidateEmail: string;
  userId: string;
  portalId: string;
  linkId: string;
  customContent: object | string | null;
  sections: Section[];
};

export type PortalContentProps = {
  portalData: PortalData;
};
