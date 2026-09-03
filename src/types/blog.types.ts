export interface BlogImage {
  id: string;
  blog_id: string;
  image_url: string;
  public_id: string | null;
  is_main: boolean;
}

export interface Blog {
  id: string;
  title: string;
  excerpt?: string | null;
  content: string;
  images: BlogImage[];
  isPublished: boolean;
  publishedAt?: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogQuery {
  page?: number;
  limit?: number;
  isPublished?: boolean;
  search?: string;
}

export interface BlogListResponse {
  success: boolean;
  data: Blog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BlogDetailResponse {
  success: boolean;
  data: Blog;
}
