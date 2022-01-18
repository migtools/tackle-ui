const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/auth",
    createProxyMiddleware({
      target: "http://tackle-keycloak-sso:8080",
      changeOrigin: true,
    })
  );

  app.use(
    "/api/controls",
    createProxyMiddleware({
      target: "http://tackle-hub-api:8080",
      changeOrigin: true,
      pathRewrite: {
        "^/api/controls": "/controls",
      },
    })
  );

  app.use(
    "/api/application-inventory",
    createProxyMiddleware({
      target: "http://tackle-hub-api:8080",
      changeOrigin: true,
      pathRewrite: {
        "^/api/application-inventory": "/application-inventory",
      },
    })
  );

  app.use(
    "/api/pathfinder",
    createProxyMiddleware({
      target: "http://tackle-pathfinder-api:8080",
      changeOrigin: true,
      pathRewrite: {
        "^/api/pathfinder": "/pathfinder",
      },
    })
  );
};
