import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Article, ArticleResponse } from '../types/Article';

interface ArticleState {
  articles: Article[];
  loading: boolean;
  error: string | null;
  nextPage: string | null;
  prevPage: string | null;
  currentPage: number;
  currentArticle: Article | null;
  editedArticles: { [key: number]: Article };
  createdArticles: { [key: number]: Article };
  likedArticles: number[];
  showOnlyLiked: boolean;
  deletedArticleIds: number[];
}

const initialState: ArticleState = {
  articles: [],
  loading: false,
  error: null,
  nextPage: null,
  prevPage: null,
  currentPage: 1,
  currentArticle: null,
  editedArticles: {},
  createdArticles: {},
  likedArticles: [],
  showOnlyLiked: false,
  deletedArticleIds: [],
};

const getPageFromUrl = (url: string) => {
  try {
    const params = new URLSearchParams(url.split('?')[1]);
    const offset = Number(params.get('offset')) || 0;
    const limit = Number(params.get('limit')) || 10;
    return Math.floor(offset / limit) + 1;
  } catch {
    return 1;
  }
};

const generateId = () => {
  // Generate a random number between 100000 and 999999
  return Math.floor(Math.random() * 900000) + 100000;
};

const formatDate = () => {
  return new Date().toISOString();
};

export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (url: string) => {
    const response = await fetch(url);
    const data: ArticleResponse = await response.json();
    return { data, url };
  }
);

export const fetchArticleById = createAsyncThunk(
  'articles/fetchArticleById',
  async (id: string, { getState }) => {
    const state = getState() as { articles: ArticleState };
    const createdArticle = state.articles.createdArticles[Number(id)];
    
    // If it's a created article, return it directly without API call
    if (createdArticle) {
      return createdArticle;
    }

    // Otherwise, fetch from API
    const response = await fetch(`https://api.spaceflightnewsapi.net/v4/articles/${id}`);
    const data: Article = await response.json();
    return data;
  }
);

export const updateArticle = createAsyncThunk(
  'articles/updateArticle',
  async ({ id, formData }: { id: string; formData: Partial<Article> }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: Number(id),
      ...formData,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      featured: false,
      launches: [],
      events: []
    } as Article;
  }
);

export const createArticle = createAsyncThunk(
  'articles/createArticle',
  async (formData: { title: string; summary: string; news_site: string; image: File }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Convert image to base64 for storage
    const imageUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(formData.image);
    });

    const timestamp = formatDate();
    const newArticle: Article = {
      id: generateId(),
      title: formData.title,
      summary: formData.summary,
      news_site: formData.news_site,
      image_url: imageUrl,
      published_at: timestamp,
      updated_at: timestamp,
      featured: false,
      launches: [],
      events: [],
      url: `https://spacenews.com/article/${generateId()}` // Generate a fake URL
    };

    return newArticle;
  }
);

const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    clearCurrentArticle: (state) => {
      state.currentArticle = null;
    },
    toggleLike: (state, action: PayloadAction<number>) => {
      const articleId = action.payload;
      const index = state.likedArticles.indexOf(articleId);
      if (index === -1) {
        state.likedArticles.push(articleId);
      } else {
        state.likedArticles.splice(index, 1);
      }
    },
    toggleLikedFilter: (state) => {
      state.showOnlyLiked = !state.showOnlyLiked;
    },
    deleteArticle: (state, action: PayloadAction<number>) => {
      const articleId = action.payload;
      // Add to deleted list
      if (!state.deletedArticleIds.includes(articleId)) {
        state.deletedArticleIds.push(articleId);
      }
      // Remove from articles list
      state.articles = state.articles.filter(article => article.id !== articleId);
      // Remove from created articles if it exists
      delete state.createdArticles[articleId];
      // Remove from edited articles if it exists
      delete state.editedArticles[articleId];
      // Remove from liked articles if it exists
      const likedIndex = state.likedArticles.indexOf(articleId);
      if (likedIndex !== -1) {
        state.likedArticles.splice(likedIndex, 1);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action: PayloadAction<{ data: ArticleResponse; url: string }>) => {
        state.loading = false;
        // Filter out deleted articles from API response
        const newArticles = action.payload.data.results
          .filter(article => !state.deletedArticleIds.includes(article.id))
          .map(article => {
            const editedArticle = state.editedArticles[article.id];
            return editedArticle || article;
          });
        const createdArticlesList = Object.values(state.createdArticles);
        state.articles = [...createdArticlesList, ...newArticles];
        state.nextPage = action.payload.data.next;
        state.prevPage = action.payload.data.previous;
        state.currentPage = getPageFromUrl(action.payload.url);
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch articles';
      })
      .addCase(fetchArticleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        state.loading = false;
        const createdArticle = state.createdArticles[action.payload.id];
        const editedArticle = state.editedArticles[action.payload.id];
        state.currentArticle = createdArticle || editedArticle || action.payload;
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch article';
      })
      .addCase(updateArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.editedArticles[action.payload.id] = action.payload;
        state.currentArticle = action.payload;
        
        const index = state.articles.findIndex(article => article.id === action.payload.id);
        if (index !== -1) {
          state.articles[index] = action.payload;
        }
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update article';
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.createdArticles[action.payload.id] = action.payload;
        state.articles = [action.payload, ...state.articles];
      });
  },
});

export const { clearCurrentArticle, toggleLike, toggleLikedFilter, deleteArticle } = articleSlice.actions;
export default articleSlice.reducer; 