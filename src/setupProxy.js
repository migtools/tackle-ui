const { createProxyMiddleware } = require("http-proxy-middleware");

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
