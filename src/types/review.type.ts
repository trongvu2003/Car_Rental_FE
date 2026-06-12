import { User } from "../types/user.types";

export interface Review {
  id: string;
  user_id: string;
  car_id: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}
