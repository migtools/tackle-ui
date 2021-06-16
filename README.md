# Tackle UI

The UI web console for the tackle project.

# Starting the UI

## Clone repository

```shell
git clone https://github.com/konveyor/tackle-ui
```

## Start application's service dependencies

Tackle UI requires the following services in order to work properly:

- [tackle-controls](https://github.com/konveyor/tackle-controls)
- [tackle-application-inventory](https://github.com/konveyor/tackle-application-inventory)
- [tackle-pathfinder](https://github.com/konveyor/tackle-pathfinder)
- [keycloak](https://www.keycloak.org/)

You can start all services using `docker-compose.yml`:

```shell
docker-compose up
```

## Start the UI

Install the npm dependencies:

```shell
yarn install
```

Start the UI:

```shell
yarn start
```

You should be able to open http://localhost:3000 and start working on the UI.

# Start the UI and use a custom application's service dependency

As described in the section [Start the UI](#start-the-ui) it is possible to start all application's service dependencies, but what if you want the UI use your custom version of [tackle-controls](https://github.com/konveyor/tackle-controls), [tackle-application-inventory](https://github.com/konveyor/tackle-application-inventory), or [tackle-pathfinder](https://github.com/konveyor/tackle-pathfinder)? You can start your custom application's service dependency and let the UI point to your service using `src/setupProxy.js`.

The process for using a custom application's service dependency is the same for all of them. The following section has an example of a custom [tackle-controls](https://github.com/konveyor/tackle-controls) that you can replicate for the rest of services.

## Custom tackle-controls

Fork/clone [tackle-controls](https://github.com/konveyor/tackle-controls):

```shell
git clone https://github.com/konveyor/tackle-controls
```

### Start tackle-controls database

Start a database which will be used by `tackle-controls`:

```shell
docker run -d -p 5432:5432 \
-e POSTGRES_USER=username \
-e POSTGRES_PASSWORD=password \
-e POSTGRES_DB=controls_db \
postgres:13.1
```

### Start tackle-controls

Move your terminal to where you cloned `tackle-controls` and then:

```shell
./mvnw quarkus:dev \
-Dquarkus.http.port=8080 \
-Dquarkus.datasource.username=username \
-Dquarkus.datasource.password=password \
-Dquarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/controls_db \
-Dquarkus.oidc.client-id=controls-api \
-Dquarkus.oidc.credentials.secret=secret \
-Dquarkus.oidc.auth-server-url=http://localhost:8180/auth/realms/konveyor
```

### Edit src/setupProxy.js

Finally, open `src/setupProxy.js` and change the port (from 8081 to 8080) of the `/api/controls` endpoint. It should look like:

```javascript
module.exports = function (app) {
  app.use(
    "/api/controls",
    createProxyMiddleware({
      target: "http://localhost:8080",
      changeOrigin: true,
      pathRewrite: {
        "^/api/controls": "/controls",
      },
    })
  );
};
```

### Start application's service dependencies

You can start all services using `docker-compose.yml`:

```shell
docker-compose up
```

### Start the UI

You can start the UI using:

```shell
yarn start
```

You should be able to open http://localhost:3000 and start working on the UI; notice that this time the UI will point to the custom `tackle-controls` service you started rather than the service comming from `docker-compose.yml`.

# Build

To build a container image for the UI based on local code, execute the following commands:
```shell
yarn build
podman build -t quay.io/$USERNAME/tackle-ui .
```
consider replacing `podman` with `docker` if you have the latter installed and `quay.io` registry with the one you're using.  
The image can be pushed running:
```shell
podman push quay.io/$USERNAME/tackle-ui
```
