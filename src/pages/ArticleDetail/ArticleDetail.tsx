import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import FullArticle from '../../components/FullArticle';
import styles from './ArticleDetail.module.css';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchArticleById, clearCurrentArticle, deleteArticle } from '../../store/articleSlice';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentArticle, loading, error } = useAppSelector((state) => state.articles);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(fetchArticleById(id));
    }
    
    // Clear current article when component unmounts
    return () => {
      dispatch(clearCurrentArticle());
    };
  }, [id, dispatch]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      dispatch(deleteArticle(Number(id)));
      navigate('/products');
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div>Loading article...</div>
      </div>
    );
  }

  if (error || !currentArticle) {
    return (
      <div className={styles.error}>
        <h2>Article not found</h2>
        <p>The article you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className={styles.backButton}>Back to Articles</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/products" className={styles.backButton}>← Back to Articles</Link>
        <button onClick={handleDelete} className={styles.deleteButton}>
          Delete Article
        </button>
      </div>
      <FullArticle article={currentArticle} />
    </div>
  );
};

export default ArticleDetail; 