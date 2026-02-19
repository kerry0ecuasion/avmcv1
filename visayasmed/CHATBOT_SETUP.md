# ChatBot AI Setup Guide

## Overview
The AI ChatBot is a floating widget integrated into VisayasMed's website that provides AI-powered assistance to visitors. It supports both OpenAI's ChatGPT and Google's Gemini AI APIs.

## Features
- ✅ Floating chat button (lower right corner with pulse animation)
- ✅ Expandable chat widget with modern UI
- ✅ Support for ChatGPT (GPT-3.5 Turbo or GPT-4)
- ✅ Support for Google Gemini AI
- ✅ Message history during session
- ✅ Typing indicators and loading states
- ✅ Responsive design (desktop & mobile)
- ✅ Keyboard shortcuts (Enter to send)
- ✅ Clear chat history button
- ✅ Accessibility features (ARIA labels, screen reader support)

## Setup Instructions

### Step 1: Choose Your AI Provider

Choose between **ChatGPT (OpenAI)** or **Google Gemini**. You only need one.

#### Option A: ChatGPT API (Recommended)

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your OpenAI account
3. Navigate to **API Keys** → **Create new secret key**
4. Copy your API key

#### Option B: Google Gemini API

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy your API key

### Step 2: Configure Environment Variables

1. Create a `.env.local` file in the project root (next to `.env.example`):
   ```bash
   # For ChatGPT
   VITE_OPENAI_API_KEY=your_api_key_here
   
   # OR for Gemini
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

2. **Never commit** `.env.local` to version control (it's in `.gitignore`)

### Step 3: Restart Development Server

```bash
npm run dev
```

The chatbot button should now appear in the lower right corner with full functionality.

## Usage

### For Users
1. Click the floating chat button in the lower right corner
2. Type your message in the input field
3. Press **Enter** or click the **Send** button
4. The AI will respond to your query
5. Click the **X** button or the chat button again to close

### For Developers

#### Component Location
- **Component file**: `src/components/ChatBot.tsx`
- **Integrated in**: `src/App.tsx`

#### Customization Options

**1. Change the Welcome Message**
```typescript
// In ChatBot.tsx, modify the initial message:
{
  id: '1',
  role: 'ai',
  content: 'Your custom welcome message here',
  timestamp: new Date(),
}
```

**2. Adjust Button Position**
```typescript
// Classes in the button element:
// Default: bottom-8 right-8 (30px from edges)
// Change to: bottom-20 right-20 (for different position)
```

**3. Customize Button Color**
```typescript
// Change gradient:
// Current: from-sky-500 to-sky-700
// Change to: from-blue-600 to-blue-800 (for example)
```

**4. Modify Chat Widget Size**
```typescript
// Change widget height for desktop:
// Current: h-[600px]
// Change to: h-[500px] or h-96
```

**5. Adjust Message Display Limit**
```typescript
// In the fetch request, modify max_tokens:
max_tokens: 500, // Change to desired length
```

## How It Works

### Architecture
```
User Input
    ↓
ChatBot Component
    ↓
Send Message Handler
    ↓
→ ChatGPT API OR Gemini API
    ↓
Parse Response
    ↓
Display in Chat Widget
    ↓
Auto-scroll to Latest Message
```

### Message Flow
1. User types and sends a message
2. Message appears in chat window (right-aligned, blue)
3. Loading indicator (typing dots) appears
4. API request sent to ChatGPT or Gemini
5. AI response received
6. Response displayed (left-aligned, gray)
7. Auto-scroll to bottom

## API Configuration Details

### ChatGPT API
- **Model**: `gpt-3.5-turbo` (economical) or `gpt-4` (advanced)
- **Temperature**: `0.7` (balanced creativity)
- **Max Tokens**: `500` (response length limit)
- **Endpoint**: `https://api.openai.com/v1/chat/completions`

Change model:
```typescript
model: 'gpt-4', // For more accurate responses (costs more)
```

### Gemini API
- **Model**: `gemini-pro`
- **Endpoint**: `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent`

## Security Best Practices

⚠️ **IMPORTANT**: Never expose API keys in your code!

### ✅ DO
- Store API keys in `.env.local` (never commit this file)
- Use environment variables (`import.meta.env.VITE_*`)
- For production, implement a backend proxy

### ❌ DON'T
- Hardcode API keys in component files
- Commit `.env.local` to Git
- Expose API keys in client-side code
- Use your personal API keys in shared projects

### Production Deployment
For production, implement a **backend proxy** to hide API keys:

```
Frontend → Your Backend Server → OpenAI/Gemini API
```

This prevents API key exposure and enables better rate limiting.

## Troubleshooting

### Chatbot Not Appearing
- Check if `.env.local` exists with correct variable name
- Ensure development server is running (`npm run dev`)
- Clear browser cache and refresh

### API Key Errors
- Verify API key is correct (copy/paste carefully)
- Check if API key has sufficient quota/credits
- Ensure API is enabled in your provider's dashboard
- ChatGPT: Verify payment method is set up in OpenAI account
- Gemini: Check API quota limits

### Messages Not Sending
- Verify internet connection
- Check browser console for error messages
- Ensure API key is valid
- Try with a simpler message first

### Slow Responses
- API provider may be experiencing delays
- Network latency
- Model is busy (try again in a moment)

## Performance Optimization

### Optional Enhancements
1. **Message Persistence**: Save chat history to localStorage
2. **Suggested Prompts**: Quick-response buttons for common questions
3. **Sound Notifications**: Alert user when AI responds
4. **Multiple Languages**: Add i18n for non-English support

## Example Implementation

### Basic Setup
```bash
# 1. Copy .env.example to .env.local
cp .env.example .env.local

# 2. Edit .env.local with your API key
# VITE_OPENAI_API_KEY=sk-...

# 3. Start development server
npm run dev
```

### Verify It Works
1. Open http://localhost:5173
2. Click the chat button (lower right, blue circle with pulse)
3. Type: "Hello!"
4. Check browser console for any errors
5. Chat button should show X icon when open

## Cost Estimation

### ChatGPT API
- GPT-3.5-turbo: ~$0.001 per 1K tokens
- GPT-4: ~$0.03 per 1K tokens
- Typical message ≈ 100-500 tokens

### Gemini API
- Free tier: Limited requests per minute
- Paid tier: $0.075 per 1M tokens

**Recommendation**: Start with GPT-3.5-turbo or free Gemini tier; monitor usage and scale as needed.

## Support & Resources

- **OpenAI API Docs**: https://platform.openai.com/docs
- **Google Gemini Docs**: https://ai.google.dev
- **Component File**: `src/components/ChatBot.tsx`
- **Configuration**: `.env.local` (create from `.env.example`)

## Future Enhancements

Potential features to add:
- [ ] Custom system prompts for hospital-specific queries
- [ ] Chat history persistence (localStorage/database)
- [ ] Admin dashboard to monitor conversations
- [ ] Multi-language support
- [ ] Integration with Facebook Messenger or WhatsApp
- [ ] Voice input/output capability
- [ ] Sentiment analysis for support escalation
- [ ] Analytics tracking for popular questions
