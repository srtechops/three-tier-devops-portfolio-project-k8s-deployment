CREATE DATABASE IF NOT EXISTS portfolio;
USE portfolio;

CREATE TABLE IF NOT EXISTS profile (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    intro TEXT,
    about TEXT,
    resume_url VARCHAR(512)
);

CREATE TABLE IF NOT EXISTS skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    proficiency INT
);

CREATE TABLE IF NOT EXISTS projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    link VARCHAR(512),
    image_url VARCHAR(512),
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS experience (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    start_date VARCHAR(50),
    end_date VARCHAR(50),
    description TEXT,
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Demo Data
INSERT INTO profile (name, title, intro, about, resume_url) 
VALUES ('John Doe', 'Senior DevOps Engineer', 'Automating everything from commit to cluster.', 'Passionate about infrastructure as code, continuous delivery, and scalable systems.', 'https://example.com/resume.pdf');

INSERT INTO skills (name, category, proficiency) VALUES 
('Docker', 'Containers', 90),
('Kubernetes', 'Orchestration', 85),
('AWS', 'Cloud', 90),
('Linux', 'OS', 95),
('Terraform', 'IaC', 80);

INSERT INTO projects (title, description, link, image_url, display_order) VALUES 
('K8s GitOps Cluster', 'Automated K8s cluster bootstrapping using ArgoCD and Terraform', 'https://github.com/example/k8s-gitops', 'https://picsum.photos/seed/k8s/600/400', 1),
('Microservices CI/CD', 'Complete CI/CD pipeline using GitHub Actions for Spring Boot and React', 'https://github.com/example/cicd-pipeline', 'https://picsum.photos/seed/cicd/600/400', 2);

INSERT INTO experience (role, company, start_date, end_date, description, display_order) VALUES
('Senior DevOps Engineer', 'Tech Corp', 'Jan 2022', 'Present', 'Lead the migration to Kubernetes. Built automated deployment pipelines reducing deploy time by 70%.', 1),
('DevOps Engineer', 'Startup Inc', 'Mar 2019', 'Dec 2021', 'Managed AWS infrastructure and implemented Docker containerization for monolith application.', 2);
