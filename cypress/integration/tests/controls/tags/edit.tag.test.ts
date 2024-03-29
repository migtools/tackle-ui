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

describe("Edit tag", () => {
  const tagTypePage = new TagTypePage();

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "TagType");

      const tagTypes = [];

      cy.log("")
        .then(() => {
          // Create tagTypes
          return [...Array(2)]
            .map((_, i) => ({
              name: `type-${(i + 10).toString(36)}`,
            }))
            .forEach((payload) => {
              cy.api_crud(
                tokens,
                "TagType",
                "POST",
                payload
              ).then((responseData) => tagTypes.push(responseData));
            });
        })
        .then(() => {
          // Tags to edit
          return [...Array(4)]
            .map((_, i) => ({
              name: `tag-${(i + 10).toString(36)}`,
              tagType: tagTypes[i % 2],
            }))
            .forEach((payload) => {
              cy.api_crud(tokens, "Tag", "POST", payload);
            });
        });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");
  });

  it("Name", () => {
    tagTypePage.editTag(0, 0, {
      name: "newName",
    });

    // Verify table
    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .eq(0)
      .pf4_table_rows()
      .eq(0)
      .should("contain", "newName");
  });

  it("Tag type", () => {
    tagTypePage.editTag(0, 0, {
      name: "newName",
      tagType: "type-b",
    });

    // Verify table
    cy.get(".pf-c-table").pf4_table_row_expand(1);
    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .eq(1)
      .pf4_table_rows()
      .eq(0)
      .should("contain", "newName");
  });
});
