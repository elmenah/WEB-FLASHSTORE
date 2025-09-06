import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jbeluuamhnxaifaiydbd.supabase.co'; // Reemplaza con tu URL de Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiZWx1dWFtaG54YWlmYWl5ZGJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjAwODIwMywiZXhwIjoyMDcxNTg0MjAzfQ.tZJkytxllRr85f_2xUvGWrinIau75OIGhpFEFZJJb3c'; // Reemplaza con tu clave pública de Supabase

export const supabase = createClient(supabaseUrl, supabaseKey);