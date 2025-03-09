// /app/page.tsx

import React, { useState } from 'react';
import { FormEvent } from 'react';
import { generateEmbedding } from '../lib/generateEmbedding';

/**
 * HomePage component renders a form to input text and generate its embedding.
 * It displays the generated embedding or an error message if the process fails.
 */
export default function HomePage() {
  // State to hold the input text
  const [inputText, setInputText] = useState('');

  // State to hold the generated embedding result
  const [result, setResult] = useState<number[] | null>(null);

  // State to hold any error message
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles form submission to generate embedding for the input text.
   * @param e The form event
   */
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      // Call the generateEmbedding function with the input text
      const embedding = await generateEmbedding(inputText);

      // Set the result state with the generated embedding
      setResult(embedding);

      // Clear any previous error message
      setError(null);
    } catch (error) {
      console.error('Error generating embedding:', (error as Error).message);
      setError((error as Error).message);
    } finally {
      // Clear the input text
      setInputText('');
    }
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>My Private AI Knowledge Base</h1>
      <form onSubmit={onSubmit}>
        <textarea
          placeholder="Enter text here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={4}
          cols={50}
          required
        />
        <br />
        <button type="submit">Generate Embedding</button>
      </form>
      {result && (
        <div>
          <h2>Generated Embedding</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div style={{ color: 'red' }}>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}
    </main>
  );
}

