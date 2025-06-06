
# GreenTrails

GreenTrails is an AllTrails-inspired outdoor adventure app with social networking features, built for modern hikers and cannabis-friendly explorers. The app is 100% free to use and runs on a Supabase backend for all data, media, and real-time features.

## Features

- **Trail Discovery**: Comprehensive trail database with filtering and search
- **Social Networking**: User profiles, follows, likes, and comments
- **Photo Albums**: Create and share photo albums from your adventures
- **Weather Integration**: Real-time weather data for trails
- **Roamie AI Assistant**: Intelligent assistant with memory capabilities
- **Age Verification**: 21+ verification for age-restricted content

## Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Maps**: Mapbox GL JS
- **Real-time**: Supabase Realtime
- **State Management**: TanStack Query
- **Testing**: Vitest

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd greentrails
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your Supabase credentials.

5. Run the development server:
```bash
npm run dev
```

## Roamie Memory Integration

### Overview

Roamie is GreenTrails' AI assistant with memory capabilities. It can remember user preferences, past conversations, and trail history across sessions to provide personalized recommendations and assistance.

### Database Schema

The memory system uses a `user_memory` table with the following structure:

```sql
CREATE TABLE public.user_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  memory_key TEXT NOT NULL,
  memory_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Running the SQL Migration

To set up the memory system, run the following SQL commands in your Supabase SQL editor:

```sql
-- Create user_memory table
CREATE TABLE public.user_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  memory_key TEXT NOT NULL,
  memory_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster lookups
CREATE UNIQUE INDEX user_memory_user_id_memory_key_idx ON public.user_memory (user_id, memory_key);

-- Enable RLS
ALTER TABLE public.user_memory ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Service role can modify memory" ON public.user_memory
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Users can read their own memory" ON public.user_memory
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memory" ON public.user_memory
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memory" ON public.user_memory
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memory" ON public.user_memory
  FOR DELETE USING (auth.uid() = user_id);
```

### Deploying the Edge Function

The memory API is implemented as a Supabase Edge Function. To deploy:

1. Install Supabase CLI
2. Login to your project: `supabase login`
3. Deploy the function: `supabase functions deploy memory-api`

The function provides three endpoints:
- `GET /memory?user_id={id}&key={key}` - Retrieve memory
- `POST /memory` - Set/update memory
- `DELETE /memory?user_id={id}&key={key}` - Delete memory

### How useRoamieMemory Works

The `useRoamieMemory` hook provides a React interface for the memory system:

```typescript
const { roamieContext, loadMemory, saveMemory, clearMemory, updateContext, isReady } = useRoamieMemory();
```

- `roamieContext`: Current user context data
- `loadMemory()`: Loads memory from backend
- `saveMemory(context)`: Saves context to backend
- `clearMemory()`: Clears all user memory
- `updateContext(updates)`: Updates specific fields
- `isReady`: Boolean indicating if system is ready

### Integration Example

The memory system automatically loads when a user is authenticated and saves context updates:

```typescript
// Update user's preferred difficulty
await updateContext({ 
  preferredTrailDifficulty: 'hard',
  lastVisitedTrails: [...lastVisitedTrails, trailId]
});
```

### Sample Conversation Flow

1. **First interaction**: "Hi Roamie, I'm looking for easy trails near Denver"
   - Roamie saves: `preferredTrailDifficulty: "easy"`, `favoriteLocations: [Denver]`

2. **Later session**: "Show me some trails"
   - Roamie remembers: "Based on your preference for easy trails and your interest in the Denver area, here are some recommendations..."

3. **After visiting trails**: Roamie can reference past visits and suggest similar trails

### Memory Data Structure

```typescript
interface RoamieContext {
  lastVisitedTrails: string[];
  preferredTrailDifficulty: "easy" | "moderate" | "hard" | null;
  lastSearchTimestamp: string | null;
  favoriteLocations: { id: string; name: string }[];
  recentSearchTerms: string[];
  preferredWeatherConditions: string[];
  lastChatTimestamp: string | null;
  conversationCount: number;
}
```

## Testing

Run the test suite:

```bash
npm run test
```

Tests include:
- Memory API endpoint validation
- Hook state management
- Error handling scenarios

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.
