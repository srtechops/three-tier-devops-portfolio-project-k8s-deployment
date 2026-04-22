# ⚙️ Backend: Spring Boot REST API

Welcome to the **Backend** of the DevOps Portfolio! This component is the "brain" of the application. It receives requests from the Frontend, talks to the MySQL Database, and returns data in JSON format.

---

## 🛠️ Technology Stack
*   **Java (v17):** The programming language.
*   **Spring Boot (v3+):** A powerful framework that sets up a production-ready application quickly. 
*   **Spring Data JPA / Hibernate:** The ORM (Object Relational Mapper) that translates Java Objects directly into MySQL Database Tables.
*   **Maven:** Our build tool and dependency manager (`pom.xml`).

---

## 📂 Code Structure & Explanation

Navigate to `src/main/java/com/portfolio/backend/` to see the core logic. Here is how it works step-by-step:

### 1. The Models (`/model`)
A "Model" represents a table in our database. 
*   If you look at `Project.java`, you'll see `@Entity` and `@Table(name = "projects")`. 
*   This tells Spring Boot to automatically create a table called `projects` with columns for `title`, `description`, `link`, etc.
*   The `@Id` and `@GeneratedValue` annotations automatically generate unique IDs (1, 2, 3...) for every new entry.

### 2. The Repositories (`/repository`)
Repositories are where the magic of Spring Data JPA happens.
*   Instead of writing raw SQL commands (`SELECT * FROM projects`), we just create an interface `ProjectRepository` that extends `JpaRepository`.
*   Spring Boot automatically implements all standard database operations for us like `findAll()`, `findById()`, `save()`, and `deleteById()`.

### 3. The Controller (`/controller/PortfolioController.java`)
The Controller is the "Traffic Cop". It defines the API endpoints.
*   `@RestController` tells Spring this class will return JSON data.
*   `@RequestMapping("/api")` means all routes inside this class start with `/api`.
*   For example, `@GetMapping("/projects")` executes `projectRepository.findAll()` and returns a JSON array of all projects to the frontend React app.

### 4. Admin Authentication
*   In `application.yml`, we define environment variables like `${ADMIN_USER}` and `${ADMIN_PASS}`. These map to the variables injected by Kubernetes.
*   The `AuthController.java` checks if incoming login requests match these credentials. If so, it returns an arbitrary Authorization Token.

---

## 🌐 Properties & Environment Variables

Look inside `src/main/resources/application.yml`. 
You will notice the database URL:
`jdbc:mysql://${DB_HOST:localhost}:3306/${DB_NAME:portfolio}`

This is incredibly important for **DevOps**. It means if the `DB_HOST` environment variable is not provided (like when you are testing locally), it defaults to `localhost`. But in Kubernetes, we pass `DB_HOST=portfolio-mysql-0.mysql`, so the backend knows where the database lives on the cluster network!

---

## 🚀 How to Run Locally (For Students)

If you want to modify and run the Spring Boot code without Docker:

1.  Ensure you have Java 17 and Maven installed.
2.  You must have a MySQL database running on your local machine on port `3306` with user `root` and password `root` (or update `application.yml`).
3.  Open a terminal in this `backend` directory.
4.  Run `./mvnw spring-boot:run`
5.  Test the API by navigating to `http://localhost:8080/api/profile` in your browser.
