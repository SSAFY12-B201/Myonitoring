FROM openjdk:17-slim

WORKDIR /app

COPY . .

RUN chmod +x ./gradlew
RUN ./gradlew bootJar

EXPOSE 8080

CMD ["java", "-jar", "build/libs/myonitoring-0.0.1-SNAPSHOT.jar"]