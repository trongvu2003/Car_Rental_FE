export type CarStatus = "available" | "rented" | "maintenance";
export type FuelType = "gasoline" | "diesel" | "electric";
export type Transmission = "manual" | "automatic";

export interface Car {
  id: string;
  name: string;
  brand: string;
  price_per_day: number;
  status: CarStatus;
  description?: string;
  year?: number;
  seats?: number;
  fuel_type?: FuelType;
  transmission?: Transmission;
  images?: CarImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CarImage {
  id: string;
  image_url: string;
  car_id: string;
  public_id: string | null;
  is_main: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CarQueryParams {
  page?: number;
  limit?: number;
  brand?: string;
  status?: CarStatus;
  fuel_type?: FuelType;
  transmission?: Transmission;
  min_price?: number;
  max_price?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
