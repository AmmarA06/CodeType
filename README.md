# CodeType

**CodeType** is a gamified typing practice tool specifically designed for programmers. Unlike traditional typing tests, CodeType lets you practice typing real code snippets in Python, JavaScript, C++, and Rust with gamified progression.

### Core Features

- **Professional IDE Experience**
- **Real-time Feedback**
- **Accurate Metrics**: Track WPM (Words Per Minute), accuracy percentage, and errors
- **Anti-Cheat**: Copy-paste disabled, snippet cannot be selected/highlighted

### Gamification

- **XP System**: Earn XP based on your WPM and accuracy
- **Level Progression**: Level up as you earn more XP (100 XP per level)

### User Authentication & Cloud Persistence

- **Supabase Authentication**: Secure email/password signup and login
- **Cloud Storage**: All progress synced to Supabase PostgreSQL database
- **Cross-Device**: Access your stats from anywhere
- **Row-Level Security**: Your data is protected and isolated

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run the App

```bash
npm run dev
```

Then open http://localhost:5173

### 4. Create an Account

- Sign up with email and password -> verify email
