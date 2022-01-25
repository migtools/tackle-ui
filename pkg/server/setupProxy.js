const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/auth",
    createProxyMiddleware({
      target: process.env.SSO_SERVER_URL || "http://localhost:9001",
      changeOrigin: true,
      logLevel: process.env.DEBUG ? "debug" : "info",
    })
  );

  app.use(
    "/api/controls",
    createProxyMiddleware({
      target: process.env.CONTROLS_API_URL || "http://localhost:9002",
      changeOrigin: true,
      pathRewrite: {
        "^/api/controls": "/controls",
      },
      logLevel: process.env.DEBUG ? "debug" : "info",
    })
  );

  app.use(
    "/api/application-inventory",
    createProxyMiddleware({
      target:
        process.env.APPLICATION_INVENTORY_API_URL || "http://localhost:9002",
      changeOrigin: true,
      pathRewrite: {
        "^/api/application-inventory": "/application-inventory",
      },
      logLevel: process.env.DEBUG ? "debug" : "info",
    })
  );

  app.use(
    "/api/pathfinder",
    createProxyMiddleware({
      target: process.env.PATHFINDER_API_URL || "http://localhost:9003",
      changeOrigin: true,
      pathRewrite: {
        "^/api/pathfinder": "/pathfinder",
      },
      logLevel: process.env.DEBUG ? "debug" : "info",
    })
  );
};
