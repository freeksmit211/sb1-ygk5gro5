import { z } from 'zod';

export type UserRole = 
  | 'superAdmin' 
  | 'management' 
  | 'admin' 
  | 'salesFreek'
  | 'salesFranco'
  | 'salesJeckie'
  | 'safety'
  | 'projects'
  | 'deleted';

export const userRoleSchema = z.enum([
  'superAdmin',
  'management', 
  'admin',
  'salesFreek',
  'salesFranco',
  'salesJeckie',
  'safety',
  'projects',
  'deleted'
]);

export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  role: UserRole;
  allowed_pages?: string[];
  password?: string;
}

export interface EditUserData {
  name?: string;
  surname?: string;
  email?: string;
  role?: UserRole;
  password?: string;
  allowed_pages?: string[];
}

export const ROLE_LABELS: Record<UserRole, string> = {
  superAdmin: 'Super Admin',
  management: 'Management',
  admin: 'Admin',
  salesFreek: 'Freek (Sales)',
  salesFranco: 'Franco (Sales)',
  salesJeckie: 'Jeckie (Sales)',
  safety: 'Safety Officer',
  projects: 'Project Manager',
  deleted: 'Deleted'
};