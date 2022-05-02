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
/// <reference types="cypress" />

context("About modal", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice");
  });

  it("Should open modal", () => {
    cy.visit("/");

    cy.get("#aboutButton").click();
    cy.get(".pf-c-about-modal-box").contains("Tackle is a collection of tools that supports large-scale application modernization and migration projects to Kubernetes.");
    cy.get("button[aria-label='Close Dialog']").click();
  });
});
