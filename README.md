# MindSpace

MindSpace is a student-focused mental wellness and self-growth interface designed to make everyday emotional check-ins and self-care feel approachable.

## Features

- Mood check-ins and mood history
- Guided journaling prompts and journal entries
- Daily affirmations
- Self-care habit tracking
- Guided breathing exercises
- 5-4-3-2-1 grounding exercise
- AI emotional companion interface with a graceful fallback response
- Safety-focused messaging and support guidance

## Tech

- React
- TypeScript / TSX
- lucide-react for icons
- Browser localStorage for mood and habit persistence

## Source

The main application component is in:

`mindspace_ai_mental_wellness_self_growth_platform.tsx`

It exports the React app as the default export. To run it, place the component in a React project, install its dependencies, and render `App` from your application entry point.

```bash
npm install react lucide-react
```

Use your project's normal React build setup (for example, Vite). If your project uses TypeScript, ensure the React and TypeScript tooling is configured.

## AI companion configuration

The source currently contains an empty Gemini API key placeholder. As uploaded, the companion will use its built-in fallback response when the API call cannot be completed.

**Do not put a production Gemini API key directly in client-side React code.** For a live AI integration, route requests through a backend/serverless function that stores the key securely, then call that endpoint from the app.

## Privacy and wellbeing note

MindSpace is intended for reflection, self-care, and general emotional wellness. It is not a medical device, does not diagnose or treat mental-health conditions, and is not a substitute for a qualified mental-health professional or emergency support. Mood and habit data are stored in the browser's localStorage on the device/browser where the app is used.

## Author

Created by **Simran Joshi**.
