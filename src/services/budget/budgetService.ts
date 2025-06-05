import { YearlyBudget } from '../../types/budget';
import { getAccountBudget } from './accountBudget';
import { getSimotechBudget } from './simotechBudget';

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

export const getYearlyBudget = async (year: number): Promise<YearlyBudget> => {
  if (!year || isNaN(year)) {
    console.error('Invalid year provided to getYearlyBudget');
    return INITIAL_BUDGET;
  }

  try {
    const accounts = await getAccountBudget(year);
    if (!accounts) {
      return {
        ...INITIAL_BUDGET,
        year
      };
    }

    return {
      year,
      accounts
    };
  } catch (error) {
    console.error('Error getting yearly budget:', error);
    return {
      ...INITIAL_BUDGET,
      year
    };
  }
};