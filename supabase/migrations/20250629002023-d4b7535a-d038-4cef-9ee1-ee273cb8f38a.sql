
-- Create missing weather tables
CREATE TABLE IF NOT EXISTS trail_weather (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trail_id UUID NOT NULL REFERENCES trails(id) ON DELETE CASCADE,
  temperature INTEGER,
  condition TEXT,
  high INTEGER,
  low INTEGER,
  precipitation TEXT,
  sunrise TEXT,
  sunset TEXT,
  wind_speed TEXT,
  wind_direction TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create weather forecast table
CREATE TABLE IF NOT EXISTS trail_weather_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trail_id UUID NOT NULL REFERENCES trails(id) ON DELETE CASCADE,
  hourly JSONB,
  daily JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create hiking events table (for EventList component)
CREATE TABLE IF NOT EXISTS hiking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  trail_id UUID REFERENCES trails(id) ON DELETE SET NULL,
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  max_participants INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create event attendees table
CREATE TABLE IF NOT EXISTS event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES hiking_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'attending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS on new tables
ALTER TABLE trail_weather ENABLE ROW LEVEL SECURITY;
ALTER TABLE trail_weather_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hiking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- RLS Policies for weather tables (public read)
CREATE POLICY "Anyone can view trail weather" ON trail_weather FOR SELECT USING (true);
CREATE POLICY "Anyone can view weather forecasts" ON trail_weather_forecasts FOR SELECT USING (true);

-- RLS Policies for events
CREATE POLICY "Anyone can view events" ON hiking_events FOR SELECT USING (true);
CREATE POLICY "Users can create events" ON hiking_events FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizers can update their events" ON hiking_events FOR UPDATE USING (auth.uid() = organizer_id);

-- RLS Policies for event attendees
CREATE POLICY "Anyone can view event attendees" ON event_attendees FOR SELECT USING (true);
CREATE POLICY "Users can manage their attendance" ON event_attendees FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their attendance" ON event_attendees FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can remove their attendance" ON event_attendees FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_trail_weather_trail_id ON trail_weather(trail_id);
CREATE INDEX IF NOT EXISTS idx_trail_weather_updated_at ON trail_weather(updated_at);
CREATE INDEX IF NOT EXISTS idx_weather_forecasts_trail_id ON trail_weather_forecasts(trail_id);
CREATE INDEX IF NOT EXISTS idx_hiking_events_date ON hiking_events(date);
CREATE INDEX IF NOT EXISTS idx_hiking_events_organizer ON hiking_events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_event ON event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user ON event_attendees(user_id);
