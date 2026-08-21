import type { User } from "./user.types";
export interface LoginData {
  email: string;
  password: string;
}
export interface LoginResponse {
  user: User;
}
