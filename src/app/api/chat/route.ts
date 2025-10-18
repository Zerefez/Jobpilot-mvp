import { ChatRequest } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY is not set');
}

export async function POST(request: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const body: ChatRequest = await request.json();

    // Build system prompt
    const systemPrompt = `You are an expert resume and cover letter coach helping job seekers improve their applications. 
Your role is to:
1. Analyze resumes and cover letters against job descriptions
2. Provide specific, actionable recommendations for improvement
3. Suggest better phrasing, structure, and content
4. Help highlight relevant skills and experience
5. Ensure applications are tailored to the job

Job Description:
${body.systemContext.jobDescription}

Current Resume:
${body.systemContext.resume}

Current Cover Letter:
${body.systemContext.coverLetter}

Provide concise, practical advice and potential improved drafts when requested.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...body.messages,
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'Failed to get response from AI' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const message = data.choices[0].message.content;

    return NextResponse.json({
      message,
      usage: data.usage,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
