import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateCollection(collectionName: string, tableName: string) {
  console.log(`Migrating ${collectionName}...`);
  
  try {
    // Get data from Supabase
    const { data, error } = await supabase
      .from(tableName)
      .select('*');

    if (error) throw error;

    if (data.length > 0) {
      console.log(`✓ Found ${data.length} records in ${collectionName}`);
    } else {
      console.log(`No data found in ${collectionName}`);
    }
  } catch (error) {
    console.error(`Error migrating ${collectionName}:`, error);
  }
}

async function migrateData() {
  try {
    // Migrate collections
    await migrateCollection('users', 'users');
    await migrateCollection('contacts', 'contacts');
    await migrateCollection('sales_activities', 'sales_activities');
    await migrateCollection('sales_feedback', 'sales_feedback');
    await migrateCollection('stock_items', 'stock_items');
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateData();