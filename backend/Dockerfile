# ─── Build Stage ───────────────────────────────────────────────────────────────
FROM maven:3.9.9-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies first (layer caching)
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn clean package -DskipTests

# ─── Runtime Stage ─────────────────────────────────────────────────────────────
# Use Alpine-based JRE to minimize OS-level CVEs (replaces Ubuntu jammy)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create a non-root user for security hardening
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=build /app/target/*.jar app.jar

# Switch to non-root user
USER appuser

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
