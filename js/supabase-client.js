import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = "https://merodnddcdcndgvnoskn.supabase.co"; // ganti dengan URL project kamu
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lcm9kbmRkY2RjbmRndm5vc2tuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0MDY4MDgsImV4cCI6MjEwNDk4MjgwOH0.iR-9hfXXAofKfJ__QgGlCdp2TUYVRBPlumXQ3RgOymQ';        // ganti dengan anon/public key kamu

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);