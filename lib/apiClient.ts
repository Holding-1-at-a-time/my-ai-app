// /lib/apiClient.ts
import axios from 'axios';

/**
 * Creates an instance of Axios with the configuration needed for the Ollama API.
 *
 * @remarks
 * The created instance is configured to use the base URL from the environment
 * variable `OLLAMA_BASE_URL` and to send and receive JSON data. The
 * `transformRequest` and `transformResponse` functions are used to ensure that
 * the data is sent and received as JSON. The `validateStatus` function is used
 * to validate the status code of the response. The `headers` property is used to
 * set the `Content-Type` header to `application/json`.
 *
 * @returns An instance of Axios with the configured options.
 */
export const apiClient = axios.create({
    /**
     * The base URL of the Ollama API.
     */
    baseURL: process.env.OLLAMA_BASE_URL,

    /**
     * The timeout for the request in milliseconds.
     */
    timeout: 10000, // adjust if needed

    /**
     * The type of data to be sent and received.
     */
    responseType: 'json',

    /**
     * Whether to send cookies with the request.
     */
    withCredentials: false, // adjust if needed

    /**
     * A function to transform the request data before sending it.
     *
     * @param data - The data to be sent.
     * @param headers - The headers of the request.
     * @returns The transformed data.
     */
    transformRequest: (data, headers) => {
        /**
         * Stringify the data to JSON.
         */
        return JSON.stringify(data);
    },

    /**
     * A function to transform the response data before returning it.
     *
     * @param response - The response data.
     * @returns The transformed data.
     */
    transformResponse: (response) => {
        /**
         * Parse the response data as JSON.
         */
        return JSON.parse(response);
    },

    /**
     * A function to validate the status code of the response.
     *
     * @param status - The status code of the response.
     * @returns `true` if the status code is valid, `false` otherwise.
     */
    validateStatus: (status) => {
        /**
         * Validate the status code if it is between 200 and 500.
         */
        return status >= 200 && status < 500;
    },

    /**
     * The headers of the request.
     */
    headers: {
        /**
         * The `Content-Type` header.
         */
        'Content-Type': 'application/json',
    },
});
