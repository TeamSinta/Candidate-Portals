import { z } from "zod";
import { tb } from "../client";
// Define the schema for section duration data
export const sectionDurationSchemaTB = z.object({
  section_id: z.string(),
  section_title: z.string(),
  total_duration: z.number(),
  link_id: z.string(),
  user_id: z.string(),
  session_id: z.string(),
  last_view_timestamp: z.string(), // Ensure this is a valid timestamp string
});

export const averageDurationSchemaTB = z.object({
  portal_id: z.string(),
  link_id: z.string(),
  section_id: z.string(),
  section_title: z.string(),
  average_duration: z.number(),
  last_view_timestamp: z.string(), // Ensure this is a valid timestamp string
});


export const topEngagedSchemaTB = z.object({
  portal_id: z.string(),
  link_id: z.string(),
  user_id: z.string(),
  total_duration: z.number().nullable(), // Handle Nullable(Int64)
  last_view_timestamp: z.string(), // Ensure this is a valid timestamp string
});

// Define the pipe with parameters
export const getSectionDuration = tb.buildPipe({
  pipe: "section_duration", // Name of your Tinybird pipe
  parameters: z.object({
    link_id: z.string(), // Parameter to filter by link ID
  }),
  data: sectionDurationSchemaTB, // The schema to validate the returned data
});


// Define the new pipe with parameters
export const getAverageDuration = tb.buildPipe({
  pipe: "average_duration", // Name of your new Tinybird pipe
  parameters: z.object({
    portal_id: z.string(), // Parameter to filter by portal ID
  }),
  data: averageDurationSchemaTB, // The schema to validate the returned data
});


// Define the Tinybird pipe to get top engaged links
export const getTopEngaged = tb.buildPipe({
  pipe: "top_engaged", // Name of your Tinybird pipe for top engaged links
  parameters: z.object({
    portal_id: z.string(), // Parameter to filter by portal ID
  }),
  data: topEngagedSchemaTB, // Schema to validate the returned data
});
