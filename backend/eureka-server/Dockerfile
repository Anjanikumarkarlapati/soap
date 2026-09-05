# Build context must be the backend/ directory (parent reactor pom):
#   docker build -f eureka-server/Dockerfile -t edupulse/eureka-server .
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build

# Copy poms first so dependency download is a cached layer
COPY pom.xml .
COPY eureka-server/pom.xml eureka-server/pom.xml
COPY api-gateway/pom.xml api-gateway/pom.xml
COPY auth-service/pom.xml auth-service/pom.xml
COPY student-service/pom.xml student-service/pom.xml
COPY attendance-service/pom.xml attendance-service/pom.xml
COPY result-service/pom.xml result-service/pom.xml
RUN mvn -ntp -DskipTests dependency:go-offline -pl eureka-server -am || true

COPY eureka-server/src eureka-server/src
RUN mvn -ntp -DskipTests package -pl eureka-server -am

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /build/eureka-server/target/eureka-server-1.0.0.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
