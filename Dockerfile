# ---------- build stage ----------
FROM gradle:8.5-jdk17 AS build
WORKDIR /app

COPY build.gradle settings.gradle ./
COPY gradle gradle

COPY src/main/java src/main/java
COPY src/main/resources src/main/resources

RUN gradle bootJar -x test

# ---------- runtime stage ----------
FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/build/libs/artLog.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
