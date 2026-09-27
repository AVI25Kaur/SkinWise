import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { blogPosts } from "./blogData";
import "./blog.css";

const BlogPost = () => {
  const { id } = useParams();

  const post = blogPosts.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="blog-post-page">
        <Link to="/blog" className="blog-back-btn">
          <i className="fas fa-arrow-left"></i> Back to all articles
        </Link>
        <div className="blog-empty-state">
          <h3>Article Not Found</h3>
          <p>The article you are looking for does not exist or has been moved.</p>
          <Link to="/blog" className="blog-reset-btn" style={{ textDecoration: "none" }}>
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-page">
      <Link to="/blog" className="blog-back-btn">
        <i className="fas fa-arrow-left"></i> Back to all articles
      </Link>

      <article>
        <header className="blog-post-header">
          <span className="blog-post-category">{post.category}</span>
          <h1 className="blog-post-title">{post.title}</h1>

          <div className="blog-post-meta">
            <div className="blog-author-info">
              <span className="blog-author-name">{post.author}</span>
              <span className="blog-author-role">{post.authorRole}</span>
            </div>

            <div className="blog-post-meta-details">
              <span>
                <i className="far fa-calendar-alt" style={{ marginRight: "0.4rem" }}></i>
                {post.date}
              </span>
              <span>
                <i className="far fa-clock" style={{ marginRight: "0.4rem" }}></i>
                {post.readTime}
              </span>
            </div>
          </div>
        </header>

        <div className="blog-post-image-container">
          <img src={post.image} alt={post.title} />
        </div>

        <div className="blog-post-content">
          {post.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {post.keyTakeaways && post.keyTakeaways.length > 0 && (
          <div className="blog-takeaways-box">
            <h4>
              <i className="fas fa-clipboard-check"></i> Key Clinical Takeaways
            </h4>
            <ul>
              {post.keyTakeaways.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="blog-post-tags">
          {post.tags.map((tag, index) => (
            <span key={index} className="blog-tag-badge">
              #{tag}
            </span>
          ))}
        </div>

        <section className="blog-community-note">
          <h4>Have concerns about your skin health?</h4>
          <p>
            SkinWise provides AI-assisted lesion screening and connects you with
            verified dermatologists across your region.
          </p>
          <div className="blog-share-actions">
            <Link to="/get-tested" className="blog-cta-btn">
              <i className="fas fa-notes-medical"></i> Take Questionnaire
            </Link>
            <Link to="/find-a-dermatologist" className="blog-cta-btn-outline">
              <i className="fas fa-user-md"></i> Find Dermatologists
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
};

export default BlogPost;
