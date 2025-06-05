import { supabase } from '../lib/supabase';
import { YearlyBudget, MonthlyBudget } from '../types/budget';

const INITIAL_BUDGET: YearlyBudget = {
  year: new Date().getFullYear(),
  accounts: {
    franco: { name: 'franco', monthlyData: {} },
    freek: { name: 'freek', monthlyData: {} },
    jeckie: { name: 'jeckie', monthlyData: {} },
    inHouse: { name: 'inHouse', monthlyData: {} },
    cod: { name: 'cod', monthlyData: {} }
  }
};

export const saveAccountBudget = async (
  year: number,
  accountName: string,
  monthlyData: Record<string, MonthlyBudget>
): Promise<void> => {
  try {
    if (!year || isNaN(year)) {
      throw new Error('Invalid year provided');
    }

    // Get the column name for the account
    let columnName: string;
    if (accountName === 'inHouse') {
      columnName = 'in_house_data';
    } else if (accountName === 'cod') {
      columnName = 'cod_data';
    } else {
      columnName = `${accountName.toLowerCase()}_data`;
    }

    // Update the budget
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

export const getYearlyBudget = async (year: number): Promise<YearlyBudget> => {
  if (!year || isNaN(year)) {
    console.error('Invalid year provided to getYearlyBudget');
    return INITIAL_BUDGET;
  }

  try {
    // Get budget data
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('year', year)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Create initial budget
        const { error: insertError } = await supabase
          .from('budgets')
          .insert({
            year,
            franco_data: {},
            freek_data: {},
            jeckie_data: {},
            in_house_data: {},
            cod_data: {}
          });

        if (insertError) {
          console.error('Error creating initial budget:', insertError);
          return {
            ...INITIAL_BUDGET,
            year
          };
        }

        return {
          year,
          accounts: {
            franco: { name: 'franco', monthlyData: {} },
            freek: { name: 'freek', monthlyData: {} },
            jeckie: { name: 'jeckie', monthlyData: {} },
            inHouse: { name: 'inHouse', monthlyData: {} },
            cod: { name: 'cod', monthlyData: {} }
          }
        };
      }
      throw error;
    }

    // Transform data into expected format
    return {
      year,
      accounts: {
        franco: { name: 'franco', monthlyData: data.franco_data || {} },
        freek: { name: 'freek', monthlyData: data.freek_data || {} },
        jeckie: { name: 'jeckie', monthlyData: data.jeckie_data || {} },
        inHouse: { name: 'inHouse', monthlyData: data.in_house_data || {} },
        cod: { name: 'cod', monthlyData: data.cod_data || {} }
      }
    };
  } catch (error) {
    console.error('Error getting budget:', error);
    return {
      ...INITIAL_BUDGET,
      year
    };
  }
};

export const saveSimotechBudget = async (
  year: number,
  budget: MonthlyBudget
): Promise<void> => {
  try {
    if (!year || isNaN(year)) {
      throw new Error('Invalid year provided');
    }

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

export const getSimotechBudget = async (year: number): Promise<MonthlyBudget | null> => {
  try {
    if (!year || isNaN(year)) {
      console.warn('Invalid year provided to getSimotechBudget');
      return null;
    }

    const { data, error } = await supabase
      .from('simotech_budgets')
      .select('*')
      .eq('year', year)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Create initial budget
        const initialBudget = { target: 0, invoiceValue: 0, orderValue: 0 };
        const { error: insertError } = await supabase
          .from('simotech_budgets')
          .insert({
            year,
            budget: initialBudget
          });

        if (insertError) {
          console.error('Error creating initial Simotech budget:', insertError);
          return null;
        }

        return initialBudget;
      }
      throw error;
    }

    return data.budget;
  } catch (error) {
    console.error('Error getting Simotech budget:', error);
    return null;
  }
};