# Tackle UI

The UI web console for the tackle project.

# Development

Follow the set of instructions below to start the UI in development mode.

# Clone repository

```shell
git clone https://github.com/konveyor/tackle-ui
```

# Start dependencies

This project depends on other resources:

- Keycloak
- Controls

## Start dependencines with docker-compose

Start the dependencies using `docker-compose.yml`:

```shell
docker-compose up
```

## Start dependencies with Docker

### Create a docker network

```shell
docker network create konveyor
```

### Start keycloak

```shell
docker run -d \
--network konveyor --network-alias keycloak \
-p 8180:8080 \
-e KEYCLOAK_USER=admin \
-e KEYCLOAK_PASSWORD=admin \
-e KEYCLOAK_IMPORT=/tmp/konveyor-realm.json \
-e DB_VENDOR=h2 \
-v $(pwd)/konveyor-realm.json:/tmp/konveyor-realm.json:z \
quay.io/keycloak/keycloak:12.0.2
```

### Start controls

Start the controls' database:

```shell
docker run -d \
--network konveyor --network-alias controls-db \
-p 5432:5432 \
-e POSTGRES_USER=user \
-e POSTGRES_PASSWORD=password \
-e POSTGRES_DB=controls_db \
postgres:13.1
```

Start the controls:

```shell
docker run -d \
--network konveyor --network-alias controls \
-p 8080:8080 \
-e QUARKUS_HTTP_PORT=8080 \
-e QUARKUS_DATASOURCE_JDBC_URL=jdbc:postgresql://controls-db:5432/controls_db \
-e QUARKUS_DATASOURCE_USERNAME=user \
-e QUARKUS_DATASOURCE_PASSWORD=password \
-e QUARKUS_OIDC_AUTH_SERVER_URL=http://keycloak:8080/auth/realms/konveyor \
-e QUARKUS_OIDC_CLIENT_ID=controls-api \
-e QUARKUS_OIDC_CREDENTIALS_SECRET=secret \
quay.io/mrizzi/poc-controls:latest-native
```

# Start the UI

Install the npm dependencies:

```shell
yarn install
```

Start the UI:

```shell
yarn start
```

You should be able to open http://localhost:3000 and start working on the UI.
