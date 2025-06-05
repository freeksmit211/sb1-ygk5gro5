import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { YearlyBudget } from '../types/budget';

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

export const useYearlyBudget = () => {
  const [budget, setBudget] = useState<YearlyBudget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const abortController = useRef<AbortController | null>(null);

  const loadBudget = useCallback(async () => {
    if (!mountedRef.current) return;
    
    // Cancel any in-flight request
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    try {
      setLoading(true);
      setError(null);
      const currentYear = new Date().getFullYear();

      const { data, error: budgetError } = await supabase
        .from('budgets')
        .select('*')
        .eq('year', currentYear)
        .single();

      if (!mountedRef.current) return;

      if (budgetError) {
        if (budgetError.code === 'PGRST116') {
          // Create initial budget
          const { error: insertError } = await supabase
            .from('budgets')
            .insert({
              year: currentYear,
              franco_data: {},
              freek_data: {},
              jeckie_data: {},
              in_house_data: {},
              cod_data: {}
            });

          if (insertError) throw insertError;

          setBudget(INITIAL_BUDGET);
          return INITIAL_BUDGET;
        }
        throw budgetError;
      }

      // Transform data into expected format
      const transformedBudget = {
        year: currentYear,
        accounts: {
          franco: { name: 'franco', monthlyData: data.franco_data || {} },
          freek: { name: 'freek', monthlyData: data.freek_data || {} },
          jeckie: { name: 'jeckie', monthlyData: data.jeckie_data || {} },
          inHouse: { name: 'inHouse', monthlyData: data.in_house_data || {} },
          cod: { name: 'cod', monthlyData: data.cod_data || {} }
        }
      };

      if (mountedRef.current) {
        setBudget(transformedBudget);
      }
      return transformedBudget;
    } catch (error: any) {
      console.error('Error loading budget:', error);
      if (mountedRef.current) {
        setError('Failed to load budget data. Please try refreshing the page.');
        setBudget(null);
      }
      return null;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    loadBudget();
    
    return () => {
      mountedRef.current = false;
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [loadBudget]);

  const refetch = useCallback(async () => {
    return await loadBudget();
  }, [loadBudget]);

  return { budget, loading, error, refetch };
};