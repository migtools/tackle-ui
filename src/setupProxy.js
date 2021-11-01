const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api/controls",
    createProxyMiddleware({
      target: "http://localhost:8087",
      changeOrigin: true,
      pathRewrite: {
        "^/api/controls": "/controls",
      },
    })
  );

  app.use(
    "/api/application-inventory",
    createProxyMiddleware({
      target: "http://localhost:8088",
      changeOrigin: true,
      pathRewrite: {
        "^/api/application-inventory": "/application-inventory",
      },
    })
  );

  app.use(
    "/api/pathfinder",
    createProxyMiddleware({
      target: "http://localhost:8089",
      changeOrigin: true,
      pathRewrite: {
        "^/api/pathfinder": "/pathfinder",
      },
    })
  );
};
