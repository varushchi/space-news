import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchArticleById, updateArticle, clearCurrentArticle } from '../../store/articleSlice';
import styles from './EditArticle.module.css';

const EditArticle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentArticle, loading, error } = useAppSelector((state) => state.articles);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    image_url: '',
    news_site: ''
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchArticleById(id));
    }
    
    // Clear current article when component unmounts
    return () => {
      dispatch(clearCurrentArticle());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentArticle) {
      setFormData({
        title: currentArticle.title,
        summary: currentArticle.summary,
        image_url: currentArticle.image_url,
        news_site: currentArticle.news_site
      });
    }
  }, [currentArticle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      try {
        await dispatch(updateArticle({ id, formData })).unwrap();
        navigate(`/products/${id}`);
      } catch (err) {
        console.error('Failed to update article:', err);
      }
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error || !currentArticle) {
    return <div className={styles.error}>{error || 'Article not found'}</div>;
  }

  return (
    <div className={styles.editArticle}>
      <h1>Edit Article</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            required
            rows={5}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image_url">Image URL</label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="news_site">News Site</label>
          <input
            type="text"
            id="news_site"
            name="news_site"
            value={formData.news_site}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" onClick={() => navigate(-1)} className={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={styles.submitButton}>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArticle; 