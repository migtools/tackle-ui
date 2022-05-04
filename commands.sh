# Copyright © 2021 the Konveyor Contributors (https://konveyor.io/)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
yarn add react@^16.13.1 react-dom@^16.13.1 react-router-dom

yarn add @patternfly/patternfly @patternfly/react-core @patternfly/react-table
yarn add @react-keycloak/web keycloak-js

yarn add redux react-redux redux-logger redux-thunk

yarn add @redhat-cloud-services/frontend-components-notifications axios typesafe-actions

# Dev dependencies

yarn add -D @types/react @types/react-dom @types/react-router-dom
yarn add -D @types/react-redux @types/redux-logger redux-devtools-extension

yarn add -D axios-mock-adapter

yarn add -D enzyme enzyme-adapter-react-16 jest-enzyme @types/enzyme @types/enzyme-adapter-react-16
yarn add -D @testing-library/react-hooks

yarn add -D husky lint-staged prettier source-map-explorer

yarn add -D node-sass@^4.14.1

## -------------------------------
# package.json

## scripts
# "analyze": "source-map-explorer 'build/static/js/*.js'",

# "jest": {
#   "collectCoverageFrom": [
#     "src/**/*.{js,jsx,ts,tsx}",
#     "!<rootDir>/node_modules/",
#     "!src/**/*.stories.*"
#   ]
# },
# "husky": {
#   "hooks": {
#     "pre-commit": "lint-staged"
#   }
# },
# "lint-staged": {
#   "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}": [
#     "prettier --write"
#   ]
# }

## -------------------------------
# setupTests.ts

# import "@testing-library/jest-dom";

# import "jest-enzyme";
# import { configure } from "enzyme";
# import Adapter from "enzyme-adapter-react-16";
# configure({ adapter: new Adapter() });
