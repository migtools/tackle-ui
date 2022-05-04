/*
Copyright © 2021 the Konveyor Contributors (https://konveyor.io/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { Provider } from "react-redux";
import configureStore from "./store";

import { initApi, initInterceptors } from "axios-config";

import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";

import i18n from "./i18n";
import { NinjaErrorBoundary } from "./ninja-error-boundary";

import "./index.css";

initApi();
i18n.init();

ReactDOM.render(
  <React.StrictMode>
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{ onLoad: "login-required" }}
      LoadingComponent={<span>Loading...</span>}
      isLoadingCheck={(keycloak) => {
        if (keycloak.authenticated) {
          initInterceptors(() => {
            return new Promise<string>((resolve, reject) => {
              if (keycloak.token) {
                keycloak
                  .updateToken(5)
                  .then(() => resolve(keycloak.token!))
                  .catch(() => reject("Failed to refresh token"));
              } else {
                keycloak.login();
                reject("Not logged in");
              }
            });
          });

          const kcLocale = (keycloak.tokenParsed as any)["locale"];
          if (kcLocale) {
            i18n.changeLanguage(kcLocale);
          }
        }

        return !keycloak.authenticated;
      }}
    >
      <Provider store={configureStore()}>
        <NinjaErrorBoundary>
          <App />
        </NinjaErrorBoundary>
      </Provider>
    </ReactKeycloakProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
