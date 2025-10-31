export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null | undefined;
  profile: string | null;
  created_at: string;
  permissions: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User;
  token: string | null;
  loading: boolean;
}
