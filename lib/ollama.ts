// /lib/ollama.ts
import { ollama } from 'ollama-ai-provider';

/**
 * Import the default Ollama client instance from the provider package.
 *
 * @remarks
 * The default instance is configured to use the base URL from the environment
 * variable `OLLAMA_BASE_URL` and to send and receive JSON data.
 */
export { ollama };

/**
 * Create a customized Ollama client instance with the specified options.
 *
 * @param options - The options to configure the instance with.
 * @returns A customized Ollama client instance.
 *
 * @example
 * export const customOllama = createOllama({
 *   baseURL: 'https://api.ollama.com', // change this if you use a proxy or custom URL
 *   headers: {
 *     'Content-Type': 'application/json',
 *     // Add any custom headers if necessary
 *   },
 * });
 */
// export const createCustomOllama = (options: Parameters<typeof createOllama>[0]) => createOllama(options);

