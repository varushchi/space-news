import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ArticleList from './pages/ArticleList/ArticleList';
import ArticleDetail from './pages/ArticleDetail/ArticleDetail';
import CreateArticle from './pages/CreateArticle/CreateArticle';
import EditArticle from './pages/EditArticle/EditArticle';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/products" element={<ArticleList />} />
            <Route path="/products/:id" element={<ArticleDetail />} />
            <Route path="/create-product" element={<CreateArticle />} />
            <Route path="/product/:id/edit" element={<EditArticle />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
