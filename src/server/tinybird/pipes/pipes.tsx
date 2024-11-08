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


// Define the pipe with parameters
export const getSectionDuration = tb.buildPipe({
  pipe: "section_duration", // Name of your Tinybird pipe
  parameters: z.object({
    link_id: z.string(), // Parameter to filter by link ID
  }),
  data: sectionDurationSchemaTB, // The schema to validate the returned data
});
