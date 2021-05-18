/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { Tag } from "../../../models/tag";

describe("Edit tag", () => {
  const tag = new Tag();

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

    // Interceptors
    cy.intercept("GET", "/api/controls/tag-type*").as("getTagTypes");
    cy.intercept("PUT", "/api/controls/tag/*").as("putTag");
  });

  it("Name", () => {
    tag.edit(0, 0, {
      name: "newName",
    });
    cy.wait("@putTag");

    // Verify table
    cy.wait("@getTagTypes");
    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .eq(0)
      .pf4_table_rows()
      .eq(0)
      .should("contain", "newName");
  });

  it("Tag type", () => {
    tag.edit(0, 0, {
      name: "newName",
      tagType: "type-b",
    });
    cy.wait("@putTag");

    // Verify table
    cy.wait("@getTagTypes");
    cy.get(".pf-c-table").pf4_table_row_expand(1);
    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .eq(1)
      .pf4_table_rows()
      .eq(0)
      .should("contain", "newName");
  });
});
