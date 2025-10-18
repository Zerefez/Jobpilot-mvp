'use client';

import { ChatPanel } from '@/components/resume-coach/chat-panel';
import { InputPanel } from '@/components/resume-coach/input-panel';
import { ChatRequest, ChatResponse, Message } from '@/lib/types';
import { useCallback, useState } from 'react';

export default function ResumeCoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contextData, setContextData] = useState<{
    jobDescription: string;
    resume: string;
    coverLetter: string;
  } | null>(null);

  const handleInitialSubmit = useCallback(
    async (data: {
      jobDescription: string;
      resume: string;
      coverLetter: string;
    }) => {
      setContextData(data);
      setMessages([]);

      // Create initial greeting message
      const initialMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I've received your job description, resume, and cover letter. I'll analyze them and provide you with specific recommendations for improvement. 

What would you like me to focus on? For example:
- General feedback on how well your resume matches the job
- Specific improvements for your cover letter
- Suggested rewording for certain sections
- Tips on highlighting specific skills or experiences`,
        timestamp: new Date(),
      };

      setMessages([initialMessage]);
    },
    []
  );

  const handleSendMessage = useCallback(
    async (userMessage: string) => {
      if (!contextData) return;

      // Add user message to chat
      const newUserMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setIsLoading(true);

      try {
        // Prepare chat history for API
        const chatHistory = messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        // Add the new user message
        chatHistory.push({
          role: 'user',
          content: userMessage,
        });

        // Call API
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: chatHistory,
            systemContext: contextData,
          } as ChatRequest),
        });

        if (!response.ok) {
          throw new Error('Failed to get response from AI');
        }

        const data: ChatResponse = await response.json();

        // Add AI response to chat
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, contextData]
  );

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Left Panel - Input */}
      <div className="w-full md:w-1/2 md:h-screen md:overflow-hidden">
        <InputPanel onSubmit={handleInitialSubmit} isLoading={isLoading} />
      </div>

      {/* Right Panel - Chat */}
      <div className="w-full md:w-1/2 md:h-screen md:overflow-hidden">
        <ChatPanel
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          isEmpty={contextData === null}
        />
      </div>
    </div>
  );
}
