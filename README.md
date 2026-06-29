# URL Shortener (Full-Stack Application)

A modern, fast, and secure full-stack URL Shortener built with Node.js/Express on the backend, PostgreSQL for data persistence, and React with Tailwind CSS v4 on the frontend. 

This application takes long URLs, generates a unique base64url-encoded short code, and routes users to their original destination.

---

## 🚀 Features

* **Instant Shortening:** Converts long, cluttered URLs into clean, manageable links.
* **Modern Premium UI:** Dark-mode focused responsive interface built with React and Tailwind CSS v4.
* **Robust Database System:** Powered by PostgreSQL with safe constraints and indexing for ultra-fast lookups.
* **Secure Backend:** Implements proper error handling, safe database inputs (`pool.query`), and CORS management.
* **Clipboard Integration:** One-click copy to clipboard functionality for the generated links.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React (Vite)
* **Styling:** Tailwind CSS v4
* **Package Manager:** pnpm

### Backend
* **Runtime:** Node.js
* **Framework:** Express
* **Database Driver:** pg (node-postgres)

### Database
* **Engine:** PostgreSQL

---

## 📁 Project Structure

```text
url-shortener/
├── backend/          # Node.js + Express API & PostgreSQL connection
│   ├── node_modules/
│   ├── .env.example
│   ├── package.json
│   ├── routes/
│   │   ├── auth.js
│   │   └── url.js
│   ├── controllers/
│   │   ├── auth.js
│   │   └── url.js
│   ├── db.js
│   └── app.js
├── frontend/         # React application (Vite + Tailwind v4)
│   ├── node_modules/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Home.jsx
│   │   ├── components/
│   │   │   ├── UrlForm.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Login.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── .gitignore        # Global git ignore file for dependencies & secrets
