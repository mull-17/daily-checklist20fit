import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://merodnddcdcndgvnoskn.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_twp1sJA7IMSGVuKxHwKlMA_cwKfredG";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);