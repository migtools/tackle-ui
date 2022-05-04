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
module.exports = {
  createOldCatalogs: true, // Save the \_old files

  indentation: 4, // Indentation of the catalog files

  keepRemoved: false, // Keep keys from the catalog that are no longer in code

  lexers: {
    js: ["JsxLexer"],
    ts: ["JsxLexer"],
    jsx: ["JsxLexer"],
    tsx: ["JsxLexer"],

    default: ["JsxLexer"],
  },

  locales: ["en", "es"],

  output: "public/locales/$LOCALE/$NAMESPACE.json",

  input: ["src/**/*.{js,jsx,ts,tsx}"],

  sort: true,
  verbose: true,
};
