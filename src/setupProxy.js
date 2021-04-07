const { createProxyMiddleware } = require("http-proxy-middleware");

const TACKLE_CONTROLS_HOST =
  process.env.TACKLE_CONTROLS_HOST || "http://localhost:8081";
const TACKLE_APPLICATION_INVENTORY_HOST =
  process.env.TACKLE_APPLICATION_INVENTORY_HOST || "http://localhost:8082";
const TACKLE_PATHFINDER_HOST =
  process.env.TACKLE_PATHFINDER_HOST || "http://localhost:8083";

module.exports = function (app) {
  app.use(
    "/api/controls",
    createProxyMiddleware({
      target: TACKLE_CONTROLS_HOST,
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        "^/api/controls": "/controls",
      },
    })
  );

  app.use(
    "/api/application-inventory",
    createProxyMiddleware({
      target: TACKLE_APPLICATION_INVENTORY_HOST,
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        "^/api/application-inventory": "/application-inventory",
      },
    })
  );

  app.use(
    "/api/pathfinder",
    createProxyMiddleware({
      target: TACKLE_PATHFINDER_HOST,
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        "^/api/pathfinder": "/pathfinder",
      },
    })
  );
};
