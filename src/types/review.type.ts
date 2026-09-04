import { User } from "../types/user.types";
import { Car } from "../types/car.types";

export interface Review {
  id: string;
  user_id: string;
  car_id: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  car?: Car;
}
