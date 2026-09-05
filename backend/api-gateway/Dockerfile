# Build context must be the backend/ directory (parent reactor pom):
#   docker build -f api-gateway/Dockerfile -t edupulse/api-gateway .
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build

COPY pom.xml .
COPY eureka-server/pom.xml eureka-server/pom.xml
COPY api-gateway/pom.xml api-gateway/pom.xml
COPY auth-service/pom.xml auth-service/pom.xml
COPY student-service/pom.xml student-service/pom.xml
COPY attendance-service/pom.xml attendance-service/pom.xml
COPY result-service/pom.xml result-service/pom.xml
RUN mvn -ntp -DskipTests dependency:go-offline -pl api-gateway -am || true

COPY api-gateway/src api-gateway/src
RUN mvn -ntp -DskipTests package -pl api-gateway -am

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /build/api-gateway/target/api-gateway-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
