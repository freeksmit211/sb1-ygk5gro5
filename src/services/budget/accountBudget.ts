import { supabase } from '../../lib/supabase';
import { AccountBudget, MonthlyBudget } from '../../types/budget';

const INITIAL_ACCOUNT_BUDGETS: Record<string, AccountBudget> = {
  franco: { name: 'franco', monthlyData: {} },
  freek: { name: 'freek', monthlyData: {} },
  jeckie: { name: 'jeckie', monthlyData: {} },
  inHouse: { name: 'inHouse', monthlyData: {} },
  cod: { name: 'cod', monthlyData: {} }
};

export const getAccountBudget = async (year: number): Promise<Record<string, AccountBudget>> => {
  try {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('year', year)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // If no data exists, create initial budget
        const initialBudget = {
          year,
          franco_data: {},
          freek_data: {},
          jeckie_data: {},
          in_house_data: {},
          cod_data: {}
        };

        const { error: insertError } = await supabase
          .from('budgets')
          .insert(initialBudget);

        if (insertError) {
          console.error('Error creating initial budget:', insertError);
          return INITIAL_ACCOUNT_BUDGETS;
        }

        return INITIAL_ACCOUNT_BUDGETS;
      }
      throw error;
    }

    return {
      franco: { name: 'franco', monthlyData: data.franco_data || {} },
      freek: { name: 'freek', monthlyData: data.freek_data || {} },
      jeckie: { name: 'jeckie', monthlyData: data.jeckie_data || {} },
      inHouse: { name: 'inHouse', monthlyData: data.in_house_data || {} },
      cod: { name: 'cod', monthlyData: data.cod_data || {} }
    };
  } catch (error) {
    console.error('Error getting account budget:', error);
    return INITIAL_ACCOUNT_BUDGETS;
  }
};

export const saveAccountBudget = async (
  year: number,
  accountName: string,
  monthlyData: Record<string, MonthlyBudget>
): Promise<void> => {
  try {
    const columnName = accountName === 'inHouse' 
      ? 'in_house_data' 
      : `${accountName.toLowerCase()}_data`;

    const { error } = await supabase
      .from('budgets')
      .upsert({
        year,
        [columnName]: monthlyData,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'year'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving budget:', error);
    throw error;
  }
};