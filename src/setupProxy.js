/*
 * Copyright © 2021 the Konveyor Contributors (https://konveyor.io/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
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
