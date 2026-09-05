# Build context must be the backend/ directory (parent reactor pom):
#   docker build -f attendance-service/Dockerfile -t edupulse/attendance-service .
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build

COPY pom.xml .
COPY eureka-server/pom.xml eureka-server/pom.xml
COPY api-gateway/pom.xml api-gateway/pom.xml
COPY auth-service/pom.xml auth-service/pom.xml
COPY student-service/pom.xml student-service/pom.xml
COPY attendance-service/pom.xml attendance-service/pom.xml
COPY result-service/pom.xml result-service/pom.xml
RUN mvn -ntp -DskipTests dependency:go-offline -pl attendance-service -am || true

COPY attendance-service/src attendance-service/src
RUN mvn -ntp -DskipTests package -pl attendance-service -am

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /build/attendance-service/target/attendance-service-1.0.0.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
