# 🌿 EarthMed

EarthMed is a web application that helps users explore, learn about, and manage their favorite plants. With features like plant profiles, filtering, trending plants, and personalized favorites, EarthMed promotes sustainable plant knowledge and makes it easy to discover new species.

---

## 📖 Project Overview

### Introduction

EarthMed is an interactive plant exploration app built with **React**, **Framer Motion**, **TailwindCSS**, and **Vite**. It allows users to:

* Browse plant profiles with detailed information (description, scientific name, cost, health benefits, etc.)
* Filter plants by attributes like name, benefit, description, location, and cost
* Save plants to a personal favorites list
* View trending plants ranked by popularity
* Authenticate via **Login**, **Signup**, or continue as **Guest**

### Purpose

This project aims to combine sustainability and education by providing an engaging way for users to learn about plants, track favorites, and explore trending species.

---

## ⚙️ Installation Instructions

### Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/) (v16 or later)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/cruzmart/earthmed.git
   cd earthmed
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the backend and client together:

   ```bash
   npm run start_earthmed
   ```

   This will run both the backend API server (Express + MySQL2) and the client (React + Vite).

4. Open your browser at [http://localhost:(Depends)](http://localhost:(Depends)) .

> ⚠️ **Note:** EarthMed fetches data from a backend server at `http://localhost:3001` (so you would have to edit this personally). Make sure the backend API is running.

---

## 📦 Dependencies

**Core dependencies:**

* [React 19](https://react.dev/)
* [React DOM](https://react.dev/)
* [TailwindCSS](https://tailwindcss.com/)
* [Framer Motion](https://www.framer.com/motion/)
* [Swiper](https://swiperjs.com/) – plant carousel
* [React Icons](https://react-icons.github.io/react-icons/)
* [React Heart](https://www.npmjs.com/package/react-heart)
* [Express](https://expressjs.com/) – backend server
* [MySQL2](https://www.npmjs.com/package/mysql2) – database driver
* [CORS](https://www.npmjs.com/package/cors)

**Dev dependencies:**

* [Vite](https://vitejs.dev/)
* [ESLint](https://eslint.org/)
* [Prettier](https://prettier.io/)
* [Concurrently](https://www.npmjs.com/package/concurrently)

---

## 🚀 Usage Examples

### Authentication

* **Login/Signup**: Create an account or log in to access favorites.
* **Guest Mode**: Browse plants without authentication.

### Browsing Plants

* Explore plants through a **slider carousel** with quick info.
* Click on a plant to view a **detailed profile card** with expandable sections.

### Filtering

* Use the **filter modal** to narrow down plants by name, benefit, description, location, and maximum cost.

### Favorites

* Save plants to your **Favorites Page**.
* View detailed info in a modal, including price and details.
* Remove plants from favorites anytime.

### Trending Plants

* Discover the top 3 most favorited plants in a **podium-style view**.

---

## 🤝 Contributing Guidelines

We welcome contributions to improve EarthMed! Here’s how you can help:

1. **Fork** the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature/your-feature
   ```
3. Make your changes and commit:

   ```bash
   git commit -m "Add your feature"
   ```
4. Push to your fork and create a **Pull Request**.

You can also contribute by:

* Reporting bugs
* Suggesting new features
* Improving documentation

---

## 📬 Contact Information

Maintainer: **Elisandro Cruz Martinez**
Email: [elisandrocruzmartinez0@gmail.com](mailto:elisandrocruzmartinez0@gmail.com)
GitHub: [@cruzmart](https://github.com/cruzmart)

---

## 🛡️ Badges

![License](https://img.shields.io/badge/License-MIT-green.svg)
![React](https://img.shields.io/badge/React-19-blue)
![Framer Motion](https://img.shields.io/badge/Framer--Motion-animations-orange)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-styling-teal)
![Vite](https://img.shields.io/badge/Vite-build-yellow)

---

🌱 *EarthMed – Promoting sustainable plant knowledge.*
