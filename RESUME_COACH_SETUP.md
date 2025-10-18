# Resume Coach - Setup Guide

## Overview
Resume Coach is an AI-powered tool that helps users improve their resumes and cover letters by analyzing them against job descriptions and providing tailored recommendations.

## Features
- 📄 **PDF Upload Support**: Upload PDFs or paste text for job descriptions, resumes, and cover letters
- 💬 **Multi-turn Chat**: Have iterative conversations with AI to refine your application materials
- 🎯 **Context-Aware Analysis**: AI analyzes your materials against the specific job
- 🚀 **Real-time Feedback**: Get instant suggestions for improvements and alternative wording
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Prerequisites
1. Node.js 18+ and npm/pnpm
2. OpenAI API key (get one at: https://platform.openai.com/api-keys)

## Installation

### 1. Install Dependencies
```bash
cd jobpilot
npm install
# or
pnpm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file in the `jobpilot` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Get your API key from: https://platform.openai.com/api-keys

### 3. Run Development Server
```bash
npm run dev
# or
pnpm dev
```

The app will be available at `http://localhost:3000`

## Usage

### Access Resume Coach
Navigate to: `http://localhost:3000/resume-coach`

### How It Works
1. **Left Panel (Input)**:
   - Paste or upload a job description (PDF or text)
   - Paste or upload your resume (PDF or text)
   - Paste or upload your cover letter (PDF or text)
   - Click "Start Analysis" to begin

2. **Right Panel (Chat)**:
   - AI provides initial analysis and suggestions
   - Ask follow-up questions like:
     - "How can I better highlight my experience?"
     - "Can you provide a better version of this paragraph?"
     - "What skills should I emphasize more?"
   - Get multiple iterations until satisfied

### Supported File Formats
- **Text**: Direct paste into text areas
- **PDF**: Upload PDF files, text will be extracted automatically

## Architecture

### Frontend Components
- `InputPanel`: Left side with upload/text input for job, resume, and cover letter
- `ChatPanel`: Right side with chat messages and input field
- `ResumeCoachPage`: Main orchestration component with state management

### Backend
- API Route: `/api/chat` - Handles chat requests and calls OpenAI API
- PDF Utilities: `lib/pdf-utils.ts` - Extracts text from PDF files
- Types: `lib/types.ts` - TypeScript interfaces for type safety

### API Integration
- Uses OpenAI GPT-3.5-turbo model
- Maintains conversation history for context
- Sends full context (job description, resume, cover letter) with each request

## Configuration

### Changing AI Model
To use GPT-4 instead of GPT-3.5-turbo, edit `src/app/api/chat/route.ts`:

```typescript
model: 'gpt-4', // Change from 'gpt-3.5-turbo'
```

### Adjusting Response Length
In `src/app/api/chat/route.ts`, modify:

```typescript
max_tokens: 2000, // Increase for longer responses
```

### Temperature (Creativity)
In `src/app/api/chat/route.ts`:

```typescript
temperature: 0.7, // Range: 0 (deterministic) to 1 (creative)
```

## Troubleshooting

### "OpenAI API key not configured"
- Ensure `.env.local` file exists in the `jobpilot` directory
- Verify `OPENAI_API_KEY` is set correctly
- Restart dev server after adding env variables

### PDF upload fails
- Check that file is a valid PDF
- File should be under 10MB
- Browser should support FileReader API (all modern browsers)

### Chat responses are slow
- OpenAI API calls can take 5-10+ seconds depending on response length
- Check your internet connection
- Verify OpenAI API key has available credits

## No Backend/Database
This prototype uses **no database** - all data is stored in browser memory during the session:
- Chat history is lost when you refresh or close the page
- Perfect for testing and early prototyping
- Easy to add persistence later if needed

## Future Enhancements
- [ ] Save conversation history to database
- [ ] User authentication and profiles
- [ ] Multiple resume/cover letter templates
- [ ] Export improved documents as PDF
- [ ] Support for different file formats (DOCX, etc.)
- [ ] Conversation history persistence
- [ ] User feedback and ratings

## Support
For issues or questions, check:
- OpenAI API documentation: https://platform.openai.com/docs
- Next.js documentation: https://nextjs.org/docs
- PDF.js documentation: https://mozilla.github.io/pdf.js/
