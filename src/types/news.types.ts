export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  source: string;
}

export interface NewsResponse {
  success: boolean;
  data: NewsItem[];
  message?: string;
}
