import { supabase } from '../../lib/supabase';
import { MonthlyBudget } from '../../types/budget';

export const getSimotechBudget = async (year: number): Promise<MonthlyBudget | null> => {
  if (!year || isNaN(year)) {
    console.warn('Invalid year provided to getSimotechBudget');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('simotech_budgets')
      .select('*')
      .eq('year', year)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No data found
      throw error;
    }

    return data.budget;
  } catch (error) {
    console.error('Error getting Simotech budget:', error);
    return null;
  }
};

export const saveSimotechBudget = async (
  year: number,
  budget: MonthlyBudget
): Promise<void> => {
  if (!year || isNaN(year)) {
    throw new Error('Invalid year provided to saveSimotechBudget');
  }

  try {
    const { error } = await supabase
      .from('simotech_budgets')
      .upsert({
        year,
        budget,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'year'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving Simotech budget:', error);
    throw error;
  }
};