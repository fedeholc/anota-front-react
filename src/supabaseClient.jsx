import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://xbnjcziobgswkczsvssv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibmpjemlvYmdzd2tjenN2c3N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMyNDc1MzAsImV4cCI6MjAwODgyMzUzMH0.FEYcuWPO4B4kDmOMbmXqy_K6TsW8xoRAF9CQCo0SRUU"
);
