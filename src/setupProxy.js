const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/auth",
    createProxyMiddleware({
      target: "http://localhost:8180",
      changeOrigin: true,
    })
  );

  app.use(
    "/api/controls",
    createProxyMiddleware({
      target: "http://localhost:8081",
      changeOrigin: true,
      pathRewrite: {
        "^/api/controls": "/controls",
      },
    })
  );

  app.use(
    "/api/application-inventory",
    createProxyMiddleware({
      target: "http://localhost:8082",
      changeOrigin: true,
      pathRewrite: {
        "^/api/application-inventory": "/application-inventory",
      },
    })
  );

  app.use(
    "/api/pathfinder",
    createProxyMiddleware({
      target: "http://localhost:8083",
      changeOrigin: true,
      pathRewrite: {
        "^/api/pathfinder": "/pathfinder",
      },
    })
  );
};
