const { createProxyMiddleware } = require("http-proxy-middleware");

const TACKLE_CONTROLS_HOST =
  process.env.CONTROLS_URL || "http://localhost:8081";
const TACKLE_APPLICATION_INVENTORY_HOST =
  process.env.CONTROLS_URL || "http://localhost:8082";

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
};
