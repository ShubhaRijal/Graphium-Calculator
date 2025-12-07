-- Create a table to track unique visitors
CREATE TABLE public.visitor_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL UNIQUE,
  first_visit TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_visit TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visitor_stats ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for tracking new visitors)
CREATE POLICY "Anyone can register as visitor" 
ON public.visitor_stats 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read the count
CREATE POLICY "Anyone can read visitor stats" 
ON public.visitor_stats 
FOR SELECT 
USING (true);

-- Allow update for returning visitors
CREATE POLICY "Anyone can update their visit" 
ON public.visitor_stats 
FOR UPDATE 
USING (true);