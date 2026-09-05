# Build context must be the backend/ directory (parent reactor pom):
#   docker build -f result-service/Dockerfile -t edupulse/result-service .
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build

COPY pom.xml .
COPY eureka-server/pom.xml eureka-server/pom.xml
COPY api-gateway/pom.xml api-gateway/pom.xml
COPY auth-service/pom.xml auth-service/pom.xml
COPY student-service/pom.xml student-service/pom.xml
COPY attendance-service/pom.xml attendance-service/pom.xml
COPY result-service/pom.xml result-service/pom.xml
RUN mvn -ntp -DskipTests dependency:go-offline -pl result-service -am || true

COPY result-service/src result-service/src
RUN mvn -ntp -DskipTests package -pl result-service -am

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /build/result-service/target/result-service-1.0.0.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
