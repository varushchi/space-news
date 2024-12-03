# Space News App

A React application for browsing and managing space-related news articles. Built with React, TypeScript, and Redux Toolkit.

## Live Demo

Visit the live application: [Space News App](https://varushchi.github.io/space-news)

## Features

- Browse space news articles
- Search articles by title
- Like/unlike articles
- Filter liked articles
- Create new articles
- Edit existing articles
- Delete articles
- Responsive design

## Technologies Used

- React
- TypeScript
- Redux Toolkit
- React Router
- CSS Modules

## Local Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
git clone https://github.com/varushchi/space-news.git

2. Navigate to the project directory:
cd space-news

3. Install dependencies:
npm install

4. Start the development server:
npm start

The application will open in your default browser at http://localhost:3000.

### Building for Production

To create a production build:
npm run build

### Deployment

To deploy to GitHub Pages:
npm run deploy

## API

This project uses the [Spaceflight News API](https://api.spaceflightnewsapi.net/v4/articles) for fetching space news articles.

## State Management

The application uses Redux Toolkit for state management, handling:
- Article data
- Liked articles
- Created articles
- Edited articles
- Deleted articles
- Loading states
- Filter states

## Features in Detail

### Article Management
- View list of articles with pagination
- Search articles by title
- Create new articles with image upload
- Edit existing articles
- Delete articles
- Like/unlike articles
- Filter to show only liked articles

### Persistence
- Created articles persist until page refresh
- Liked articles persist until page refresh
- Edited articles persist until page refresh
- Deleted articles won't reappear until page refresh

### UI/UX
- Responsive design for all screen sizes
- Loading states for better user experience
- Error handling and user feedback
- Smooth animations and transitions
- Intuitive navigation
