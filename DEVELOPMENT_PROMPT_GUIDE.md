# 🤖 Building the Portfolio: The Antigravity Prompt Guide

If you want to understand how an AI Coding Assistant like **Antigravity** (Google DeepMind's agentic coding assistant) was instructed to develop the application code for this dynamic, three-tier portfolio, you can use the series of prompts below.

This guide focuses purely on the **software development** phase (Frontend, Backend, and Database Integration) from scratch, skipping the Kubernetes deployment orchestration.

---

## 🎯 Phase 1: Initializing the Project

> **"Hey Antigravity, I'm building a three-tier portfolio application. Let's start with the foundation. Can you initialize a Spring Boot backend using Java 17 and Maven, making sure to include Spring Web, Spring Data JPA, and MySQL Driver dependencies? Then open a new terminal and initialize a React 19 application using Vite and install TailwindCSS v3 for styling."**

* **What this does:** Sets up the skeletal structure of both repositories and configures the package managers and styling systems.

## 💾 Phase 2: Database Models & Backend Logic

> **"Now, let's build the backend data models and database connections. Connect the backend to a MySQL database using `application.yml` and environment variables. I need you to create JPA Entities, Repositories, and a unified RestController for the following items:**
> 1. **Profile:** Stores my Name, Title, Intro, About paragraph, and a `resumeUrl`.
> 2. **Skills:** Stores skill Name, Category, and Proficiency (0-100).
> 3. **Projects:** Stores Title, Description, Link, and Image URL.
> 4. **Experience:** Stores Role, Company, Start/End dates, and Description.
> 
> **Make sure to expose full CRUD (Create, Read, Update, Delete) GET, POST, PUT, and DELETE API endpoints for these models under `/api/*`."**

* **What this does:** Constructs the Java infrastructure, connects it directly to MySQL using Hibernate, and exposes the REST interfaces.

## 🎨 Phase 3: The Frontend UI and Premium Aesthetics

> **"Let's move to the React frontend. I want a stunning, premium single-page application. Please rewrite `index.css` and `App.jsx` with the following aesthetic requirements:**
> *   **Colors:** Deep dark mode (`#020617` background) with vibrant Blue (`#3b82f6`) and Emerald (`#10b981`) primary gradients.
> *   **Glassmorphism:** All cards and panels should have a translucent, frosted-glass effect with a slight border.
> *   **Animations:** Implement slow-moving glowing ambient orbs in the background. Make the main header text an animated, shifting color gradient. Add a 3D-tilt hover effect to the project cards.
> *   **Scroll Reveals:** Ensure elements slide up smoothly into view as the user traverses down the page.
> *   **Data:** Fetch all the components (Profile, Skills, Projects, Experience) from our `/api` backend endpoints using Axios."

* **What this does:** Brings the app to life visually by marrying advanced CSS animations with the data returned by the Spring Boot backend.

## 🔐 Phase 4: The Admin Editing System

> **"I need a way to manage my portfolio data directly from the UI without touching the database. First, set an Admin Username and Password via properties in the Spring Boot backend, and add an `/api/auth/login` check.**
> 
> **Then, on the Frontend, add a tiny, faint lock icon in the footer. If I double-click it, pop open an Admin Login Modal. If I log in successfully, float an 'Admin Toolbar' stuck to the bottom of the screen with an 'Edit Mode' toggle.** 
> 
> **When Edit Mode is active, replace all static text on the screen with input fields/textareas. Add a 'Delete' (🗑️) button to every project, skill, and experience card, and add a '➕ Add New' form at the bottom of every section. Make sure all edits fire off PUT/POST/DELETE requests to our backend to persist the state instantly."**

* **What this does:** Develops a fully functional, dynamic Content Management System (CMS) that modifies the live rendering of the application on the fly. 

## ✨ Phase 5: The Finishing Touches

> **"Almost done! For the 'Resume URL' inside the Profile, I want to paste a standard Google Drive share link, but I want the frontend to automatically regex/convert it into a Google Drive `preview` url format natively. Also, add 'View Resume' buttons in the Hero section and Navbar that hyperlink to this generated PDF preview link."**

* **What this does:** Handles QoL (Quality of Life) enhancements, cleaning up edge cases like messy Google Drive URLs that lead to standard HTML pages instead of native PDF previews.

---

### Why this approach works:
Notice how the prompts breakdown the application into **logical, modular phases**. Advanced coding agents function best when they understand the **architecture** before the **aesthetics**, and the **aesthetics** before the **edge cases**.
