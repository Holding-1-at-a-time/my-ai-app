// /app/ai-provider.tsx
'use client';

import React, { useState, createContext, ReactNode } from 'react';

interface AIState {
    // Define your shared AI state (for example, system instructions, responses, etc.)
    systemMessage: string;
    conversation: string[];
}

interface AIContextType {
    aiState: AIState;
    updateAIState: (newState: AIState) => void;
}

export const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider = ({ children }: { children: ReactNode }) => {
    const [aiState, setAIState] = useState<AIState>({
        systemMessage: "Welcome to your AI interface.",
        conversation: [],
    });

    const updateAIState = (newState: AIState) => {
        setAIState(newState);
    };

    return (
        <AIContext.Provider value={{ aiState, updateAIState }}>
            {children}
        </AIContext.Provider>
    );
};
