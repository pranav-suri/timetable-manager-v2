import type { AppRouter } from "../../server/src";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

/**
 * TRPC Client to make requests
 */
export const t = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "http://localhost:3000/trpc" })],
});

async function main() {
  console.log(await t.teachers.query({ timetableId: 1 }));
}

main();
