// /convex/functions/getAllEntries.ts
import { query } from "./_generated/server";

export default query(async ({ db }) => {
    return await db.query("knowledgeEntry").collect();
});
