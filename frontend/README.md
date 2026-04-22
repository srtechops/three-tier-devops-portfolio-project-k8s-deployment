# 🖥️ Frontend: React & Nginx Architecture

Welcome to the **Frontend** component of the DevOps Portfolio! This guide explains how the UI works so you can understand the codebase and learn how to build similar applications.

---

## 🛠️ Technology Stack
*   **React (v19):** Used to build the user interface using a component-based approach.
*   **Vite:** A blazing fast build tool that replaces Create React App (CRA), bundling our code for production.
*   **TailwindCSS (v3):** A utility-first CSS framework that allows us to style the application directly inline.
*   **Nginx:** A web server used in our Docker container to serve the compiled React files and act as a *reverse proxy*.

---

## 📂 Code Structure & Explanation

### 1. `src/App.jsx`
This is the heart of the frontend application. Let's break down what it does:

*   **State Management (`useState`, `useEffect`):**
    When the page loads, `useEffect` triggers our API calls to fetch Profile, Skills, Projects, and Experience data. This data is stored in React state (`useState`) so the UI automatically updates.
*   **The UI Layout:**
    The file returns a massiveJSX block containing the Navbar, Hero Section, Tech Stack, Featured Projects, Career Timeline, and Footer. 
*   **The "Edit Mode" CMS:**
    We integrated a custom admin dashboard. When a user logs in via the hidden padlock icon in the footer, `isEditMode` becomes `true`. This replaces all standard text fields with `<input>` and `<textarea>` components, revealing CRUD (Create, Read, Update, Delete) buttons.

### 2. `src/api.js`
This file acts as our "Network Layer". 
*   It uses `axios` to make HTTP requests to our backend API.
*   It centralizes all our API endpoints (e.g., `getSkills()`, `updateProfile(data)`).
*   **Auth Interceptor:** It automatically checks `localStorage` for an admin token and injects it into the HTTP headers for secure, authenticated requests.

### 3. `src/index.css`
While Tailwind handles most styling, `index.css` is where we wrote custom Keyframe Animations:
*   Floating Orbs (`.orb-1`, `.orb-glow`)
*   The animated gradient text effect.
*   Scroll reveals (elements sliding up as you scroll down).
*   3D Card Hover effects.

### 4. `Dockerfile` & `nginx.conf` (Deployment)
When we run `docker build`, we use a **Multi-Stage Build**:
*   **Stage 1 (Node):** Installs `npm` packages and runs `npm run build` to compile the React code into generic HTML, CSS, and JS files.
*   **Stage 2 (Nginx):** Takes *only* those compiled files and places them inside a lightweight Nginx web server. 
*   **Reverse Proxy (`nginx.conf`):** If a user hits `http://frontend/api/...`, Nginx steps in and silently forwards that request to the Spring Boot backend (`http://portfolio-backend-service:8080/api/...`). This prevents CORS errors!

---

## 🚀 How to Run Locally (For Students)

If you want to modify the React code on your laptop without using Docker:

1.  Ensure you have Node.js installed.
2.  Open a terminal in this `frontend` directory.
3.  Run `npm install` to download dependencies.
4.  Run `npm run dev` to start the Vite development server.
5.  Open `http://localhost:5173` in your browser.
