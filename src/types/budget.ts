export interface MonthlyBudget {
  target: number;
  invoiceValue: number;
  orderValue: number;
}

export interface AccountBudget {
  name: string;
  monthlyData: Record<string, MonthlyBudget>;
}

export interface YearlyBudget {
  year: number;
  accounts: {
    franco: AccountBudget;
    freek: AccountBudget;
    jeckie: AccountBudget;
    inHouse: AccountBudget;
    cod: AccountBudget;
  };
}