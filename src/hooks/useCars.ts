import { useState, useEffect, useCallback } from "react";
import carApi from "../api/car.api";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const refetch = () => setTrigger((t) => t + 1);

  return { cars, loading, error, refetch };
};

export const useCar = (id: string) => {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const data = await carApi.getById(id);
        setCar(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Không thể tải thông tin xe");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  return {
    car,
    loading,
    error,
  };
};

interface UseCarActionsReturn {
  submitting: boolean;
  submitError: string | null;
  createCar: (formData: FormData) => Promise<Car>;
  updateCar: (id: string, formData: FormData) => Promise<Car>;
  deleting: boolean;
  deleteError: string | null;
  deleteCar: (id: string) => Promise<void>;
}

export const useCarActions = (): UseCarActionsReturn => {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const createCar = useCallback(async (formData: FormData): Promise<Car> => {
    try {
      setSubmitting(true);
      setSubmitError(null);
      return await carApi.create(formData);
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Không thể thêm xe.";
      setSubmitError(message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const updateCar = useCallback(
    async (id: string, formData: FormData): Promise<Car> => {
      try {
        setSubmitting(true);
        setSubmitError(null);
        return await carApi.update(id, formData);
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Không thể cập nhật xe.";
        setSubmitError(message);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  const deleteCar = useCallback(async (id: string) => {
    try {
      setDeleting(true);
      setDeleteError(null);
      await carApi.delete(id);
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Không thể xóa xe.";
      setDeleteError(message);
      throw err;
    } finally {
      setDeleting(false);
    }
  }, []);

  return {
    submitting,
    submitError,
    createCar,
    updateCar,
    deleting,
    deleteError,
    deleteCar,
  };
};
