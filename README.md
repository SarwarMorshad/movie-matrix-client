# 🎬 Movie Matrix

<div align="center">
  
  ![Movie Matrix Banner](https://img.shields.io/badge/Movie-Matrix-ff6b6b?style=for-the-badge&logo=react&logoColor=white)
  
  **Your Ultimate Movie Discovery & Management Platform**
  
  [![React](https://img.shields.io/badge/React-19.0+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.0+-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind](https://img.shields.io/badge/Tailwind-3.4+-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

[Live Demo](https://movie-matrix-bb82a.web.app) • [Report Bug](https://github.com/SarwarMorshad/movie-matrix-client/issues) • [Request Feature](https://github.com/SarwarMorshad/movie-matrix-client/issues)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Live Demo & Screenshots](#-live-demo--screenshots)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Customization](#-customization)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)
- [Acknowledgments](#-acknowledgments)

---

## 🎯 About

**Movie Matrix** is a modern, full-stack movie discovery and management platform that allows users to explore, review, and curate their favorite films. Built with **React 19**, **Vite**, **Tailwind CSS + DaisyUI**, and powered by **Firebase Authentication**, it offers a seamless and engaging experience for movie enthusiasts.

This is the **client-side application** - a lightning-fast, responsive React SPA that delivers an intuitive interface for browsing movies, managing collections, and personalizing your movie journey.

### 🌟 Why Movie Matrix?

- **Discover** - Explore a curated collection of movies with rich details, ratings, and posters
- **Curate** - Build your personal movie collection and watchlist
- **Manage** - Add, update, and organize movies with an intuitive interface
- **Engage** - Track your favorite genres, top-rated films, and recent additions
- **Secure** - Firebase authentication ensures your data stays protected

---

## ✨ Features

### 🎭 Core Features

- **🔐 User Authentication**

  - Firebase Authentication (Email/Password & Google Sign-In)
  - Protected routes with `PrivateRoute` wrapper
  - Persistent authentication state with Context API
  - Secure logout functionality

- **🎥 Movie Management**

  - Browse all movies with rich details (poster, genre, duration, rating, summary)
  - View detailed movie information on dedicated detail pages
  - Add new movies to the database (protected action)
  - Update existing movie information (protected action)
  - Advanced filtering by genre, rating, and release year

- **📚 Personal Collections**

  - **My Collection** - View and manage movies you've added
  - **My Watchlist** - Curate a personalized list of movies to watch
  - Quick add/remove functionality
  - Real-time updates across the app

- **👤 User Profile & Settings**
  - View and edit your profile information with dedicated profile page
  - Edit profile with a separate edit interface
  - Upload and update profile photos
  - Track your activity and statistics
  - Subscription plans and premium features
  - Manage account preferences

### 🎨 UI/UX Features

- **Responsive Design** - Seamless experience across desktop, tablet, and mobile
- **Dark Theme** - Beautiful dark mode powered by DaisyUI
- **Smooth Animations** - Framer Motion for fluid page transitions and interactions
- **Toast Notifications** - Real-time feedback with React Hot Toast
- **Loading States** - Custom loading spinners and skeleton screens
- **Error Handling** - Dedicated error page and graceful fallbacks
- **Genre Navigation** - Browse movies by genre with visual genre cards
- **Stats Dashboard** - View platform statistics and insights
- **Hero Section** - Engaging homepage with featured content
- **Footer & Navigation** - Consistent, intuitive navigation throughout
- **SEO Optimized** - Dynamic meta tags and document head management with React Helmet Async

### 📊 Quick Feature Reference

| Category           | Features                                                  |
| ------------------ | --------------------------------------------------------- |
| **Authentication** | Email/Password, Google Sign-In, Protected Routes          |
| **Movie Browsing** | All Movies, Genre Filter, Search, Top Rated, Recent       |
| **Collections**    | My Collection, My Watchlist, Add/Remove                   |
| **User Actions**   | Add Movie, Update Movie, Profile Management               |
| **Pages**          | 14 Total (Home, Details, Collection, Watchlist, Profile+) |
| **UI/UX**          | Dark Theme, Animations, Toast, Loading States, Responsive |
| **SEO**            | Dynamic meta tags, Open Graph, optimized for search       |

---

## 🌐 Live Demo & Screenshots

🎬 **Live Application:** [https://movie-matrix-bb82a.web.app](https://movie-matrix-bb82a.web.app)

### Key Pages

| Page              | Route                | Description                         |
| ----------------- | -------------------- | ----------------------------------- |
| 🏠 Home           | `/`                  | Homepage with hero, stats, featured |
| 🎬 All Movies     | `/all-movies`        | Browse complete movie catalog       |
| 🎥 Movie Details  | `/movie/:id`         | Detailed movie information          |
| ➕ Add Movie      | `/add-movie`         | Add new movie (Protected)           |
| ✏️ Update Movie   | `/update/:id`        | Edit movie details (Protected)      |
| 📚 My Collection  | `/my-collection`     | Movies you've added                 |
| ⭐ My Watchlist   | `/my-watchlist`      | Your saved watchlist                |
| 👤 Profile        | `/profile`           | View your profile                   |
| ✏️ Edit Profile   | `/edit-profile`      | Update profile info (Protected)     |
| 💎 Plans          | `/plans`             | Subscription plans                  |
| 🔐 Login/Register | `/login`/`/register` | Authentication pages                |

> **Tip:** Try adding a movie, creating a watchlist, and exploring the genre sections!

---

## 🛠 Tech Stack

### Frontend

```
⚛️  React 19          - Modern UI Library with latest features
🚀  Vite              - Lightning-fast build tool & dev server
🎨  Tailwind CSS      - Utility-first CSS framework
🌼  DaisyUI           - Beautiful component library for Tailwind
🎭  Framer Motion     - Production-ready animation library
🔥  React Hot Toast   - Elegant toast notifications
📱  React Icons       - Popular icon library (5000+ icons)
🛣️  React Router v7   - Declarative routing for React
🔌  Axios             - Promise-based HTTP client
🔐  Firebase          - Authentication & backend services
⚡  React Helmet Async - SEO & dynamic document head management

```

### Backend Integration

```
🌐  REST API          - Axios-based HTTP requests
🔒  Secure Routes     - Custom useAxiosSecure hook with auth headers
🔑  JWT Tokens        - Token-based authentication
📡  API Interceptors  - Automatic token refresh & error handling
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0 or higher recommended)
- **npm** (v9.0+) or **yarn**
- **Git** for version control
- **Firebase** account (for authentication setup)
- A code editor like **VS Code**

### Installation

1. **Clone the repository**

```pwsh
git clone https://github.com/SarwarMorshad/movie-matrix-client.git
cd movie-matrix-client
```

2. **Install Dependencies**

```pwsh
npm install
```

3. **Set up Environment Variables**

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration (Get these from Firebase Console)
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend API URL (adjust based on your backend server)
VITE_API_URL=http://localhost:5000
```

4. **Start the Development Server**

```pwsh
npm run dev
```

The app will open at `http://localhost:5173` (or the port shown in your terminal)

5. **Build for Production**

```pwsh
npm run build
```

This creates an optimized production build in the `dist/` folder.

6. **Preview Production Build**

```pwsh
npm run preview
```

7. **Lint Your Code**

```pwsh
npm run lint
```

### 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Authentication** → Sign-in methods → Enable Email/Password and Google
4. Go to Project Settings → General → Your apps → Web app
5. Copy the configuration values into your `.env.local` file

---

## 📁 Project Structure

```
movie-matrix-client/
├── public/                    # Static assets
│   └── (static files like favicon, images)
│
├── src/
│   ├── assets/               # Images, icons, media files
│   │
│   ├── components/           # Reusable UI components
│   │   ├── AboutSection.jsx        # About section for homepage
│   │   ├── Footer.jsx              # App footer
│   │   ├── GenreSection.jsx        # Genre browsing component
│   │   ├── HeroSection.jsx         # Hero banner
│   │   ├── LoadingSpinner.jsx      # Loading state component
│   │   ├── MovieCard.jsx           # Movie display card
│   │   ├── Navbar.jsx              # Navigation bar
│   │   ├── RecentMovies.jsx        # Recent movies section
│   │   ├── StatsSection.jsx        # Statistics display
│   │   ├── ThemeToggle.jsx         # Dark/light theme switcher
│   │   └── TopRatedMovies.jsx      # Top-rated movies section
│   │
│   ├── context/              # React Context
│   │   └── AuthContext.jsx         # Authentication context
│   │
│   ├── firebase/             # Firebase configuration
│   │   └── firebase.init.js        # Firebase initialization
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useAxios.jsx            # Axios wrapper hook
│   │   └── useAxiosSecure.jsx      # Secure axios with auth
│   │
│   ├── layouts/              # Layout components
│   │   └── MainLayout.jsx          # Main app layout wrapper
│   │
│   ├── pages/                # Route pages
│   │   ├── Home.jsx                # Homepage
│   │   ├── AllMovies.jsx           # Browse all movies
│   │   ├── MovieDetails.jsx        # Movie detail page
│   │   ├── AddMovie.jsx            # Add new movie (protected)
│   │   ├── UpdateMovie.jsx         # Update movie (protected)
│   │   ├── MyCollection.jsx        # User's added movies
│   │   ├── MyWatchlist.jsx         # User's watchlist
│   │   ├── Profile.jsx             # User profile page
│   │   ├── EditProfile.jsx         # Edit profile page (protected)
│   │   ├── SubscriptionPlans.jsx   # Subscription & plans
│   │   ├── Login.jsx               # Login page
│   │   ├── Register.jsx            # Registration page
│   │   ├── ErrorPage.jsx           # 404/error page
│   │   └── MoviesNotFound.jsx      # No movies found state
│   │
│   ├── provider/             # Context providers
│   │   └── AuthProvider.jsx        # Authentication provider
│   │
│   ├── Routes/               # Routing configuration
│   │   ├── Router.jsx              # Route definitions
│   │   └── PrivateRoute.jsx        # Protected route wrapper
│   │
│   ├── utils/                # Utility functions
│   │
│   ├── App.jsx               # Root component
│   ├── App.css               # App-specific styles
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles (Tailwind imports)
│
├── .env.local                # Environment variables (create this!)
├── eslint.config.js          # ESLint configuration
├── index.html                # HTML entry point
├── package.json              # Dependencies & scripts
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── vite.config.js            # Vite configuration
└── README.md                 # You are here! 📍
```

### Key Directories Explained

- **`components/`** - Reusable, presentational components used across multiple pages
- **`pages/`** - Route-level components, each representing a distinct page/view
- **`hooks/`** - Custom React hooks for data fetching, authentication, etc.
- **`context/` & `provider/`** - Global state management using React Context API
- **`Routes/`** - Centralized routing logic and route protection
- **`firebase/`** - Firebase configuration and initialization

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# ========================================
# Firebase Configuration
# ========================================
# Get these values from: Firebase Console > Project Settings > General > Your apps
VITE_FIREBASE_API_KEY=AIza...your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef...

# ========================================
# Backend API Configuration
# ========================================
# Development
VITE_API_URL=http://localhost:5000

# Production (uncomment when deploying)
# VITE_API_URL=https://your-api-domain.com
```

### 📝 Important Notes

- ⚠️ **Never commit `.env.local` to Git!** It's already in `.gitignore`
- All Vite environment variables must start with `VITE_` prefix
- The app reads these using `import.meta.env.VITE_VARIABLE_NAME`
- Firebase config is loaded in `src/firebase/firebase.init.js`
- For production deployments, set these as environment variables in your hosting platform (Vercel, Netlify, etc.)

### 🔒 Security Best Practices

- Store API keys in environment variables, not in code
- Use different Firebase projects for development and production
- Enable Firebase Security Rules to protect your data
- Rotate API keys if they're ever exposed

---

## 🔌 Available Scripts

| Command           | Description                                     |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Start Vite development server on localhost:5173 |
| `npm run build`   | Build optimized production bundle to `dist/`    |
| `npm run preview` | Preview production build locally                |
| `npm run lint`    | Run ESLint to check code quality                |

### Additional Commands

```pwsh
# Install dependencies
npm install

# Clean install (if you encounter issues)
rm -rf node_modules package-lock.json
npm install

# Check for outdated packages
npm outdated

# Update dependencies (be careful!)
npm update
```

---

## 🎨 Customization

### Tailwind Configuration

Modify `tailwind.config.js` to customize:

- Colors and theme
- Breakpoints
- Spacing scale
- Font families
- Custom plugins

### DaisyUI Themes

The app uses DaisyUI for components. Change themes in `tailwind.config.js`:

```javascript
module.exports = {
  // ...
  daisyui: {
    themes: ["light", "dark", "cupcake", "cyberpunk"], // Add your preferred themes
  },
};
```

### Component Styling

- Global styles: `src/index.css`
- Component-specific styles: Use Tailwind utility classes
- Custom CSS: `src/App.css`

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

```pwsh
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Netlify

1. Push code to GitHub
2. Connect repository on [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables
6. Deploy!

### Firebase Hosting

```pwsh
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Build Optimization Tips

- ✅ All assets are automatically optimized by Vite
- ✅ Code splitting is enabled by default
- ✅ Tree shaking removes unused code
- ✅ Production builds are minified
- 💡 Use dynamic imports for large components
- 💡 Optimize images before adding to `public/`

### ⚡ Performance Tips

- **Code Splitting**: Large components are lazy-loaded using React's `lazy()` and `Suspense`
- **Image Optimization**: Use WebP format for images, compress before upload
- **Caching**: Vite handles browser caching automatically
- **Tree Shaking**: Unused code is automatically removed in production
- **Minification**: All JS/CSS is minified in production builds
- **CDN**: Consider using a CDN for static assets in production

---

## ❓ Troubleshooting

### Common Issues

<details>
<summary><strong>Port 5173 already in use</strong></summary>

Change the port in `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    port: 3000, // or any other available port
  },
});
```

</details>

<details>
<summary><strong>Firebase configuration errors</strong></summary>

- Verify all environment variables are set correctly in `.env.local`
- Ensure all variables start with `VITE_` prefix
- Check Firebase Console for correct credentials
- Restart dev server after changing `.env.local`

</details>

<details>
<summary><strong>Build fails / Module not found</strong></summary>

```pwsh
# Clear cache and reinstall
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

</details>

<details>
<summary><strong>Authentication not working</strong></summary>

- Enable Email/Password and Google Sign-In in Firebase Console
- Check that Firebase config values are correct
- Ensure you're using the correct Firebase project
- Clear browser cache and cookies

</details>

<details>
<summary><strong>Styling issues / Tailwind not working</strong></summary>

- Verify `tailwind.config.js` and `postcss.config.js` are present
- Check that Tailwind directives are in `src/index.css`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Restart dev server

</details>

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**! 🎉

### How to Contribute

1. **Fork the Project**

   ```pwsh
   # Click the 'Fork' button on GitHub
   ```

2. **Clone Your Fork**

   ```pwsh
   git clone https://github.com/your-username/movie-matrix-client.git
   cd movie-matrix-client
   ```

3. **Create a Feature Branch**

   ```pwsh
   git checkout -b feature/AmazingFeature
   ```

4. **Make Your Changes**

   - Write clean, readable code
   - Follow existing code style and conventions
   - Add comments where necessary

5. **Test Your Changes**

   ```pwsh
   npm run dev    # Test locally
   npm run lint   # Check for linting errors
   npm run build  # Ensure it builds successfully
   ```

6. **Commit Your Changes**

   ```pwsh
   git add .
   git commit -m "Add some AmazingFeature"
   ```

7. **Push to Your Fork**

   ```pwsh
   git push origin feature/AmazingFeature
   ```

8. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Provide a clear description of your changes

### 📋 Development Guidelines

- ✅ Follow React best practices and hooks guidelines
- ✅ Use functional components and hooks (avoid class components)
- ✅ Keep components small and focused (single responsibility)
- ✅ Use meaningful variable and function names
- ✅ Write clean, self-documenting code
- ✅ Maintain consistent formatting (ESLint will help!)
- ✅ Test your changes thoroughly before submitting
- ✅ Update documentation if you add new features
- ✅ Keep commits atomic and focused

### 🐛 Bug Reports & Feature Requests

- **Found a bug?** [Open an issue](https://github.com/SarwarMorshad/movie-matrix-client/issues)
- **Have an idea?** [Submit a feature request](https://github.com/SarwarMorshad/movie-matrix-client/issues)
- Be descriptive and include screenshots/steps to reproduce

---

## 📝 License

Distributed under the MIT License. See `LICENSE` file for more information.

---

## 📧 Contact

**Sarwar Morshad** - [@SarwarMorshad](https://github.com/SarwarMorshad)

**Project Link:** [https://github.com/SarwarMorshad/movie-matrix-client](https://github.com/SarwarMorshad/movie-matrix-client)

**Live Demo:** [https://movie-matrix-bb82a.web.app](https://movie-matrix-bb82a.web.app) 🚀

---

## 🙏 Acknowledgments

Special thanks to these amazing tools and resources:

- [React](https://reactjs.org/) - The library for web and native user interfaces
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [Tailwind CSS](https://tailwindcss.com/) - Rapidly build modern websites
- [DaisyUI](https://daisyui.com/) - The most popular component library for Tailwind CSS
- [Firebase](https://firebase.google.com/) - App development platform by Google
- [Framer Motion](https://www.framer.com/motion/) - Production-ready animation library
- [React Router](https://reactrouter.com/) - Client-side routing
- [React Icons](https://react-icons.github.io/react-icons/) - Popular icons as React components
- [React Hot Toast](https://react-hot-toast.com/) - Smoking hot React notifications
- [React Helmet Async](https://github.com/staylor/react-helmet-async) - Manage document head for SEO
- [Axios](https://axios-http.com/) - Promise based HTTP client
- [TMDB](https://www.themoviedb.org/) - The Movie Database for movie data & posters
- [Shields.io](https://shields.io/) - For awesome README badges

### 💡 Inspiration

This project was built to showcase modern React development practices with:

- Component-based architecture
- Context API for state management
- Custom hooks for reusable logic
- Protected routing patterns
- Firebase authentication integration
- Responsive design principles

### 🗺️ Roadmap & Future Enhancements

Potential features for future versions:

- [ ] **Advanced Search** - Multi-criteria search with filters
- [ ] **Social Features** - Follow users, share watchlists
- [ ] **Reviews & Ratings** - User-generated reviews and ratings
- [ ] **Recommendations** - AI-powered movie suggestions
- [ ] **Watch History** - Track movies you've watched
- [ ] **Export/Import** - Backup watchlists and collections
- [ ] **Mobile App** - React Native companion app
- [ ] **Dark/Light Toggle** - Manual theme switcher
- [ ] **Multi-language** - Internationalization support
- [ ] **Offline Mode** - PWA with offline capabilities

Want to contribute to any of these? Check out the [Contributing](#-contributing) section!

---

<div align="center">
  
  ### ⭐ Star this repo if you find it helpful!
  
  **Made with ❤️ and ⚛️ React by [Sarwar Morshad](https://github.com/SarwarMorshad)**
  
  ![Footer](https://img.shields.io/badge/Happy-Coding-blue?style=for-the-badge&logo=react&logoColor=white)

</div>
