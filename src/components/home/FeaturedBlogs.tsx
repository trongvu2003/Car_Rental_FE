import "./FeaturedBlogs.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useBlogs } from "../../hooks/useBlogs";
import { useCarNews } from "../../hooks/useCarNews";
import type { Blog } from "../../types/blog.types";
import type { NewsItem } from "../../types/news.types";
import defaultBlogImg from "../../assets/images/default.avif";

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

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const SkeletonBlogCard = ({ index }: { index: number }) => (
  <div className="timeline-row">
    <div className="timeline-indicator">
      <div className="timeline-line" />
      <div className="timeline-number-wrapper">
        <span className="timeline-number">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </div>
    <div className="skeleton-card">
      <div className="skeleton-shimmer" />
    </div>
  </div>
);

interface BlogTimelineRowProps {
  blog: Blog;
  index: number;
}

const BlogTimelineRow = ({ blog, index }: BlogTimelineRowProps) => (
  <div className="timeline-row">
    <div className="timeline-indicator">
      <div className="timeline-line" />
      <div className="timeline-number-wrapper">
        <span className="timeline-number">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </div>
    <div className="timeline-card">
      {blog.publishedAt && (
        <div className="timeline-card__meta">
          <span className="timeline-card__date">
            {formatDate(blog.publishedAt)}
          </span>
        </div>
      )}

      <Link to={`/blog/${blog.id}`} className="timeline-card__title-link">
        <h3 className="timeline-card__title">{blog.title}</h3>
      </Link>

      {blog.excerpt && <p className="timeline-card__desc">{blog.excerpt}</p>}

      <Link
        to={`/blog/${blog.id}`}
        className="timeline-card__img-wrap"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={getBlogImage(blog)}
          alt={blog.title}
          loading="lazy"
          className="timeline-card__img"
        />
      </Link>

      <div className="timeline-card__footer">
        <Link to={`/blog/${blog.id}`} className="timeline-card__read-more">
          Đọc tiếp <ArrowRight />
        </Link>
      </div>
    </div>
  </div>
);

interface NewsTimelineRowProps {
  item: NewsItem;
  index: number;
}

const NewsTimelineRow = ({ item, index }: NewsTimelineRowProps) => (
  <div className="timeline-row">
    <div className="timeline-indicator">
      <div className="timeline-line" />
      <div className="timeline-number-wrapper">
        <span className="timeline-number">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </div>
    <div className="timeline-card">
      <div className="timeline-card__meta">
        <span className="timeline-card__category">{item.source}</span>
        {item.publishedAt && (
          <span className="timeline-card__date">
            {formatDate(item.publishedAt)}
          </span>
        )}
      </div>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="timeline-card__title-link"
      >
        <h3 className="timeline-card__title">{item.title}</h3>
      </a>

      {item.excerpt && <p className="timeline-card__desc">{item.excerpt}</p>}

      {item.imageUrl && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="timeline-card__img-wrap"
          tabIndex={-1}
          aria-hidden="true"
        >
          <img
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            className="timeline-card__img"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </a>
      )}

      <div className="timeline-card__footer">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="timeline-card__read-more"
        >
          Đọc tiếp <ArrowRight />
        </a>
      </div>
    </div>
  </div>
);

type TabKey = "admin" | "news";

const FeaturedBlogs = () => {
  const [tab, setTab] = useState<TabKey>("admin");

  const {
    blogs,
    loading: blogsLoading,
    error: blogsError,
  } = useBlogs({ limit: 5, isPublished: true });

  const {
    news,
    loading: newsLoading,
    error: newsError,
    fetch: fetchNews,
  } = useCarNews();

  useEffect(() => {
    if (tab === "news") fetchNews();
  }, [tab, fetchNews]);

  const isLoading = tab === "admin" ? blogsLoading : newsLoading;
  const error = tab === "admin" ? blogsError : newsError;
  const isEmpty =
    !isLoading &&
    !error &&
    ((tab === "admin" && blogs.length === 0) ||
      (tab === "news" && news.length === 0));

  return (
    <section className="featured-blogs" id="blog">
      <div className="featured-blogs__inner">
        <div className="featured-blogs__left">
          <span className="featured__tag">Kiến thức thuê xe</span>
          <h2 className="featured__title">
            Cẩm Nang <span className="gold">Thuê Xe</span>
          </h2>
          <div className="featured__divider" />
          <p className="featured__subtitle">
            Mỗi chuyến đi trọn vẹn bắt đầu từ sự chuẩn bị kỹ càng. Chúng tôi
            không chỉ cung cấp dịch vụ cho thuê xe, mà còn đồng hành cùng bạn
            với những kinh nghiệm, kiến thức và tin tức mới nhất về ô tô, xe máy
            để mỗi hành trình đều an toàn và trọn vẹn.
          </p>

          <div className="blog-tabs">
            <button
              type="button"
              className={`blog-tab ${
                tab === "admin" ? "blog-tab--active" : ""
              }`}
              onClick={() => setTab("admin")}
            >
              Bài viết của chúng tôi
            </button>
            <button
              type="button"
              className={`blog-tab ${tab === "news" ? "blog-tab--active" : ""}`}
              onClick={() => setTab("news")}
            >
              Tin tức xe
            </button>
          </div>

          {tab === "admin" && (
            <Link to="/blog" className="btn--outline">
              Xem tất cả bài viết <ArrowRight />
            </Link>
          )}
        </div>

        <div className="featured-blogs__right">
          {error && <div className="featured-blogs__error">⚠ {error}</div>}

          {isEmpty && (
            <div className="featured-blogs__error">
              {tab === "admin"
                ? "Chưa có bài viết nào được đăng."
                : "Chưa có tin tức nào."}
            </div>
          )}

          <div className="timeline-container">
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <SkeletonBlogCard key={i} index={i} />
              ))}

            {!isLoading &&
              tab === "admin" &&
              blogs.map((blog, index) => (
                <BlogTimelineRow key={blog.id} blog={blog} index={index} />
              ))}

            {!isLoading &&
              tab === "news" &&
              news.map((item, index) => (
                <NewsTimelineRow
                  key={item.id || item.url}
                  item={item}
                  index={index}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogs;
