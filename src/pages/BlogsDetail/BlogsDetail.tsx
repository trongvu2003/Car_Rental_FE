import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useBlog, useBlogs } from "../../hooks/useBlogs";
import type { Blog } from "../../types/blog.types";
import defaultBlogImg from "../../assets/images/default.avif";
import "./BlogDetail.css";

const getBlogImage = (blog: Blog): string => {
  if (!blog.images || blog.images.length === 0) return defaultBlogImg;

  const mainImage = blog.images.find((img) => img.is_main) ?? blog.images[0];

  return mainImage?.image_url || defaultBlogImg;
};

const formatDate = (dateStr?: string | null): string => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-arrow-left">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const BlogDetailSkeleton = () => (
  <div className="blog-detail__skeleton">
    <div className="skeleton-line skeleton-line--tag" />
    <div className="skeleton-line skeleton-line--title" />
    <div className="skeleton-line skeleton-line--title skeleton-line--short" />
    <div className="skeleton-line skeleton-line--meta" />
    <div className="skeleton-img" />
    <div className="skeleton-line skeleton-line--body" />
    <div className="skeleton-line skeleton-line--body" />
    <div className="skeleton-line skeleton-line--body skeleton-line--short" />
  </div>
);

const SidebarSkeleton = () => (
  <div className="sidebar__skeleton">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="sidebar-skeleton-item">
        <div className="skeleton-line skeleton-line--body" />
        <div className="skeleton-line skeleton-line--short" />
      </div>
    ))}
  </div>
);

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { blog, loading, error } = useBlog(id ?? "");
  const { blogs: relatedBlogs, loading: sidebarLoading } = useBlogs({
    limit: 6,
    isPublished: true,
  });

  useEffect(() => {
    if (blog?.title) {
      document.title = blog.title;
    }
  }, [blog?.title]);

  const otherBlogs = relatedBlogs.filter((b) => b.id !== id);

  return (
    <main className="blog-detail-page">
      <div className="blog-detail__layout">
        <aside className="blog-detail__sidebar">
          <div className="sidebar__header">
            <button
              type="button"
              className="blog-detail__back"
              onClick={() => navigate("/")}
              aria-label="Quay lại trang chủ"
            >
              <ArrowLeft />
              Trang chủ
            </button>
            <h2 className="sidebar__title">Bài viết khác</h2>
            <div className="sidebar__divider" />
          </div>

          {sidebarLoading ? (
            <SidebarSkeleton />
          ) : (
            <ul className="sidebar__list">
              {otherBlogs.map((b) => (
                <li
                  key={b.id}
                  className={`sidebar__item${
                    b.id === id ? " sidebar__item--active" : ""
                  }`}
                >
                  <Link to={`/blog/${b.id}`} className="sidebar__link">
                    <div className="sidebar__item-img-wrap">
                      <img
                        src={getBlogImage(b)}
                        alt={b.title}
                        className="sidebar__item-img"
                        loading="lazy"
                      />
                    </div>
                    <div className="sidebar__item-body">
                      <p className="sidebar__item-title">{b.title}</p>
                      <span className="sidebar__item-date">
                        {formatDate(b.publishedAt ?? b.createdAt)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </aside>
        <div className="blog-detail__main">
          {loading && <BlogDetailSkeleton />}

          {error && !loading && (
            <div className="blog-detail__error">
              <span>⚠</span>
              <p>{error}</p>
              <Link to="/" className="btn--outline">
                Quay lại trang chủ
              </Link>
            </div>
          )}

          {blog && !loading && (
            <article className="blog-detail__article">
              <div className="blog-detail__meta">
                <span className="blog-detail__date">
                  {formatDate(blog.publishedAt ?? blog.createdAt)}
                </span>
                {typeof blog.viewCount === "number" && (
                  <span className="blog-detail__views">
                    {blog.viewCount.toLocaleString("vi-VN")} lượt xem
                  </span>
                )}
              </div>

              <h1 className="blog-detail__title">{blog.title}</h1>

              {blog.excerpt && (
                <p className="blog-detail__excerpt">{blog.excerpt}</p>
              )}

              <div className="blog-detail__img-wrap">
                <img
                  src={getBlogImage(blog)}
                  alt={blog.title}
                  className="blog-detail__img"
                />
              </div>

              <div
                className="blog-detail__content"
                dangerouslySetInnerHTML={{ __html: blog.content ?? "" }}
              />
            </article>
          )}
        </div>
      </div>
    </main>
  );
};

export default BlogDetail;
