// /app/layout.tsx
import { AIProvider } from './ai-provider';
import './globals.css';

export const metadata = {
  title: 'My AI App',
  description: 'Private AI Knowledge Base Application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AIProvider>
          {children}
        </AIProvider>
      </body>
    </html>
  );
}
