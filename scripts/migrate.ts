import { createClient } from '@supabase/supabase-js';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Initialize Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function migrateCollection(collectionName: string, tableName: string) {
  console.log(`Migrating ${collectionName}...`);
  
  try {
    const snapshot = await getDocs(collection(firestore, collectionName));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (data.length > 0) {
      const { error } = await supabase.from(tableName).insert(data);
      if (error) throw error;
      console.log(`✓ Migrated ${data.length} records from ${collectionName}`);
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