import React from 'react'
import { Article } from '../types/Article'
import { Link } from 'react-router-dom'

export default function ArcticleElem({ article }: { article: Article }) {
  return (
    <div className='article'>
      <h2>{article.title}</h2>
      <img src={article.image_url} alt={article.title} />
      <p>{article.summary}</p>
      <Link to={`/products/${article.id}`}>View Details</Link>
    </div>
  )
}
