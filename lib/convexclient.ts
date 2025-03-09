// lib/convexClient.ts
import { ConvexHttpClient } from "convex/browser";

// Ensure you have NEXT_PUBLIC_CONVEX_URL defined in your .env file!
if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error("Please set NEXT_PUBLIC_CONVEX_URL in your environment variables");
}

// Create the Convex client using the environment variable for the URL.
const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// Export a function that maps to the client's fetch method.
export const convexFetch = convexClient.fetch.bind(convexClient);
