import React from 'react'
import { Article } from '../types/Article'
import styles from './FullArticle.module.css'
import { Link } from 'react-router-dom'

export default function FullArticle({ article }: { article: Article }) {
  // Format the dates to be more readable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.fullArticle}>
      <div className={styles.header}>
        <h1>{article.title}</h1>
        <Link to={`/product/${article.id}/edit`} className={styles.editButton}>
          Edit Article
        </Link>
      </div>
      <img src={article.image_url} alt={article.title} />
      <p>{article.summary}</p>
      <div className={styles.metadata}>
        <p>Source: <span>{article.news_site}</span></p>
        <p>Published: <span>{formatDate(article.published_at)}</span></p>
        <p>Updated: <span>{formatDate(article.updated_at)}</span></p>
      </div>
    </div>
  )
}
