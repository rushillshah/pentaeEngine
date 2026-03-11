import type { PublicUser } from "./user";

export interface SignUpInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: PublicUser;
}

export interface SessionPayload {
  userId: number;
  email: string;
  role: string;
}
