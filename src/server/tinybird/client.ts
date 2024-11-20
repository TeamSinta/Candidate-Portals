import { env } from "@/env";
import { Tinybird } from "@chronark/zod-bird";

export const tb = new Tinybird({
    token: env.NEXT_PUBLIC_TINYBIRD_PIPE_TOKEN as string,
    baseUrl: "https://api.us-east.tinybird.co",
});
