import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { blogPosts } from "./blogData";
import "./blog.css";

const categories = [
  "All",
  "Skin Cancer Education",
  "Patient Stories & Support",
  "Sun Safety & Health",
  "Technology & AI",
  "Dermatology Science",
  "Survivor Stories",
  "Prevention & Lifestyle",
];

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  const filteredPosts = useMemo(() => {
    let posts = blogPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;

      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

      const matchesSearch =
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });

    if (sortBy === "rated") {
      posts = [...posts].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    } else if (sortBy === "readTime") {
      posts = [...posts].sort((a, b) => parseInt(a.readTime) - parseInt(b.readTime));
    }

    return posts;
  }, [searchQuery, selectedCategory, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("latest");
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={i <= rating ? "fas fa-star" : "far fa-star"}
          aria-hidden="true"
        />
      );
    }
    return stars;
  };

  return (
    <div className="blog-page">
      {/* Title Section */}
      <div className="title" style={{ marginBottom: "1.5rem" }}>
        <div className="side-line"></div>
        <h3>SkinWise Blog & Experience</h3>
      </div>

      {/* Hero Banner */}
      <div className="blog-hero">
        <h1>
          SkinWise-Blogs: <span>Share & Learn</span>
        </h1>
        <p>
          Real stories, scientific breakthroughs, and essential dermatological
          guidance to help you and your loved ones protect your skin with confidence.
        </p>
      </div>

      {/* Search & Sort Controls */}
      <div className="blog-controls">
        <div className="blog-search-sort-bar">
          <div className="blog-search-wrapper">
            <span className="blog-search-icon">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="blog-search-input"
              placeholder="Search articles, symptoms, treatments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search articles"
            />
          </div>

          <div className="blog-sort-wrapper">
            <label htmlFor="blog-sort" className="blog-sort-label">
              Sort By:
            </label>
            <select
              id="blog-sort"
              className="blog-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest Articles</option>
              <option value="rated">Highest Rated</option>
              <option value="readTime">Quick Reads</option>
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="blog-category-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
              type="button"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count Meta */}
      <div className="blog-results-meta">
        Showing {filteredPosts.length} of {blogPosts.length} articles
        {selectedCategory !== "All" && ` in "${selectedCategory}"`}
        {searchQuery && ` matching "${searchQuery}"`}
      </div>

      {/* Blog Cards Grid */}
      {filteredPosts.length > 0 ? (
        <div className="blog-grid">
          {filteredPosts.map((post) => (
            <Link
              to={`/blog/${post.id}`}
              className="blog-card"
              key={post.id}
            >
              <div className="blog-card-image-wrap">
                <img
                  src={post.image}
                  alt={post.title}
                  className="blog-card-image"
                  loading="lazy"
                />
                <span className="blog-card-category-badge">
                  {post.category}
                </span>
              </div>

              <div className="blog-card-body">
                <div className="blog-card-stars">
                  {renderStars(post.rating)}
                  <span className="blog-card-reviews-count">
                    ({post.reviewCount} {post.reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </div>

                <h4 className="blog-card-title">{post.title}</h4>
                <p className="blog-card-excerpt">{post.excerpt}</p>

                <div className="blog-card-footer">
                  <span className="blog-card-author">{post.author}</span>
                  <span className="blog-read-more-link">
                    Read article <i className="fas fa-arrow-right"></i>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="blog-empty-state">
          <i
            className="fas fa-book-open"
            style={{ fontSize: "3rem", color: "#ff2e63", marginBottom: "1rem" }}
          ></i>
          <h3>No matching articles found</h3>
          <p>
            We couldn't find any articles matching your search or filters.
          </p>
          <button className="blog-reset-btn" onClick={resetFilters} type="button">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Blog;
