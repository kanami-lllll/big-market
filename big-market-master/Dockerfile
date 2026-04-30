FROM maven:3.9.6-eclipse-temurin-8 AS builder
WORKDIR /workspace
COPY pom.xml ./
COPY big-market-api ./big-market-api
COPY big-market-app ./big-market-app
COPY big-market-domain ./big-market-domain
COPY big-market-infrastructure ./big-market-infrastructure
COPY big-market-querys ./big-market-querys
COPY big-market-trigger ./big-market-trigger
COPY big-market-types ./big-market-types
RUN mvn -q -DskipTests package

FROM eclipse-temurin:8-jre
WORKDIR /app
ENV TZ=Asia/Shanghai
ENV JAVA_OPTS=""
ENV PARAMS=""
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
COPY --from=builder /workspace/big-market-app/target/big-market-app.jar /app/big-market-app.jar
EXPOSE 8098
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/big-market-app.jar $PARAMS"]
