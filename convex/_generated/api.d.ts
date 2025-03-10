/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ConvexClientProvider from "../ConvexClientProvider.js";
import type * as dev from "../dev.js";
import type * as knowledgeEntries from "../knowledgeEntries.js";
import type * as ollama from "../ollama.js";
import type * as scraper from "../scraper.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ConvexClientProvider: typeof ConvexClientProvider;
  dev: typeof dev;
  knowledgeEntries: typeof knowledgeEntries;
  ollama: typeof ollama;
  scraper: typeof scraper;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
