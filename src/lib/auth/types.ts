export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  allowed_pages?: string[];
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthResponse {
  user: AuthUser | null;
  error: AuthError | null;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  name: string;
  role: string;
}