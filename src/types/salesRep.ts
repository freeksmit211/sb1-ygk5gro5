import { z } from 'zod';

export const salesRepCodes = ['S01', 'S03', 'S05'] as const;
export const salesRepCodeSchema = z.enum(salesRepCodes);
export type SalesRepCode = z.infer<typeof salesRepCodeSchema>;

export interface SalesRepMapping {
  id: string;
  code: SalesRepCode;
  currentName: string;
  createdAt: string;
  updatedAt: string;
}

export const SALES_REP_NAMES: Record<SalesRepCode, string> = {
  'S01': 'Franco',
  'S03': 'Freek',
  'S05': 'Jeckie'
};

export const REP_CODE_TO_ID: Record<SalesRepCode, string> = {
  'S01': 'franco',
  'S03': 'freek',
  'S05': 'jeckie'
};

export const ID_TO_REP_CODE: Record<string, SalesRepCode> = {
  'franco': 'S01',
  'freek': 'S03',
  'jeckie': 'S05'
};