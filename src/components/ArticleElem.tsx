import React from 'react'
import { Article } from '../types/Article'
import { Link, useNavigate } from 'react-router-dom'
import styles from './ArticleElem.module.css'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { toggleLike, deleteArticle } from '../store/articleSlice'

export default function ArticleElem({ article }: { article: Article }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const likedArticles = useAppSelector(state => state.articles.likedArticles);
  const isLiked = likedArticles.includes(article.id);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this article?')) {
      dispatch(deleteArticle(article.id));
    }
  };

  return (
    <div className={styles.article}>
      <div className={styles.articleHeader}>
        <h2>{article.title}</h2>
        <button 
          onClick={handleDelete}
          className={styles.deleteButton}
          title="Delete article"
        >
          ✕
        </button>
      </div>
      <img src={article.image_url} alt={article.title} />
      <p>{article.summary}</p>
      <div className={styles.articleFooter}>
        <Link to={`/products/${article.id}`}>View Details</Link>
        <button 
          onClick={() => dispatch(toggleLike(article.id))}
          className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
        >
          {isLiked ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  )
} 