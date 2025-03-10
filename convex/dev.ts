import { config } from "dotenv"

// Load environment variables from .env file during development
config()

// This file is used for local development with Convex
// It helps set up the schema and environment variables
console.log("Convex development environment initialized")
console.log("OLLAMA_BASE_URL:", process.env.OLLAMA_BASE_URL)
console.log("NEXT_PUBLIC_CONVEX_URL:", process.env.NEXT_PUBLIC_CONVEX_URL)

