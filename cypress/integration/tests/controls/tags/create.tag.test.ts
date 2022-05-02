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
/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { TagTypePage } from "../../../models/tag-type";

describe("Create new tag type", () => {
  const tagTypePage = new TagTypePage();

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "TagType");
      cy.api_crud(tokens, "TagType", "POST", { name: "type-a" });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "Tag");
    });
  });

  it("With min data", () => {
    tagTypePage.createTag({
      name: "myTag",
      tagType: "type-a",
    });

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "type-a")
      .should("contain", "1");

    cy.get(".pf-c-table").pf4_table_row_expand(0);
    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "myTag");
  });
});
