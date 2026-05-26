import { useState, useEffect } from "react";
import { carApi } from "../api/car.api";
import type { Car, CarQueryParams } from "../types/car.types";

interface UseCarsReturn {
  cars: Car[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCars = (params?: CarQueryParams): UseCarsReturn => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchCars = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await carApi.getAll(params);
        if (!cancelled) setCars(data);
      } catch (err: unknown) {
        if (!cancelled) {
          const msg =
            err instanceof Error ? err.message : "Không thể tải danh sách xe";
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCars();
    return () => {
      cancelled = true;
    };
  }, [trigger]);

  const refetch = () => setTrigger((t) => t + 1);

  return { cars, loading, error, refetch };
};
