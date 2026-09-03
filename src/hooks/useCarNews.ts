import { useState } from "react";
import type { NewsItem } from "../types/news.types";
import { getCarNewsApi } from "../api/news.api";

export const useCarNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [fetched, setFetched] = useState(false);

  const fetchNews = async () => {
    if (fetched) return;

    setLoading(true);
    setError("");

    try {
      const result = await getCarNewsApi();

      if (result.success && result.data) {
        setNews(result.data);
        setFetched(true);
      } else {
        throw new Error("Dữ liệu không hợp lệ");
      }
    } catch (err: any) {
      setError(err.message || "Không thể tải tin tức. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return { news, loading, error, fetch: fetchNews };
};
