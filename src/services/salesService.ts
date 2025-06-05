import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { YearlyBudget, MonthlyBudget } from '../types/budget';

const COLLECTION = 'sales_budgets';

export const saveBudget = async (budget: YearlyBudget): Promise<void> => {
  try {
    const docRef = collection(db, COLLECTION);
    await addDoc(docRef, {
      ...budget,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error saving budget:', error);
    throw new Error('Failed to save budget data');
  }
};

export const getBudget = async (year: number): Promise<YearlyBudget | null> => {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('year', '==', year)
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as YearlyBudget;
  } catch (error) {
    console.error('Error getting budget:', error);
    throw new Error('Failed to load budget data');
  }
};