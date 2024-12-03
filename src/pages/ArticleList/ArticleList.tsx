import React, { useEffect, useState } from 'react';
import ArticleElem from '../../components/ArticleElem';
import styles from './ArticleList.module.css';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchArticles, toggleLikedFilter } from '../../store/articleSlice';
import { Link } from 'react-router-dom';

const ArticleList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { articles, loading, nextPage, prevPage, currentPage } = useAppSelector(
    (state) => state.articles
  );
  const [searchTerm, setSearchTerm] = useState('');
  const ITEMS_PER_PAGE = 12;
  const likedArticles = useAppSelector(state => state.articles.likedArticles);
  const showOnlyLiked = useAppSelector(state => state.articles.showOnlyLiked);

  const filteredArticles = showOnlyLiked 
    ? articles.filter(article => likedArticles.includes(article.id))
    : articles;

  useEffect(() => {
    const baseUrl = 'https://api.spaceflightnewsapi.net/v4/articles/';
    const searchParam = searchTerm ? `&title_contains=${encodeURIComponent(searchTerm)}` : '';
    const url = `${baseUrl}?limit=${ITEMS_PER_PAGE}${searchParam}`;
    
    const debounceTimer = setTimeout(() => {
      dispatch(fetchArticles(url));
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, dispatch]);

  const handleNextPage = () => {
    if (nextPage) {
      dispatch(fetchArticles(nextPage));
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (prevPage) {
      dispatch(fetchArticles(prevPage));
      window.scrollTo(0, 0);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (loading) {
    return <div className={styles.loading}>Loading articles...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Space News Articles</h1>
        <div className={styles.headerButtons}>
          <button 
            onClick={() => dispatch(toggleLikedFilter())}
            className={`${styles.filterButton} ${showOnlyLiked ? styles.active : ''}`}
          >
            {showOnlyLiked ? 'Show All' : 'Show Liked'}
          </button>
          <Link to="/create-product" className={styles.createButton}>
            Create New Article
          </Link>
        </div>
      </div>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search articles by title..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.articleGrid}>
        {filteredArticles.map((article) => (
          <ArticleElem key={article.id} article={article} />
        ))}
      </div>
      <div className={styles.pagination}>
        <button 
          onClick={handlePrevPage} 
          disabled={!prevPage}
          className={styles.paginationButton}
        >
          ← Previous
        </button>
        <span className={styles.pageInfo}>Page {currentPage}</span>
        <button 
          onClick={handleNextPage} 
          disabled={!nextPage}
          className={styles.paginationButton}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default ArticleList; 