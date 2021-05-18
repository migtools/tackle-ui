/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { Tag } from "../../../models/tag";

describe("Delete tag", () => {
  const tag = new Tag();

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "TagType");

      let tagType;

      cy.log("")
        .then(() => {
          // Create tagType
          return cy
            .api_crud(tokens, "TagType", { name: "type-a" })
            .then((responseData) => (tagType = responseData));
        })
        .then(() => {
          // Tags to edit
          return [...Array(4)]
            .map((_, i) => ({
              name: `tag-${(i + 10).toString(36)}`,
              tagType: tagType,
            }))
            .forEach((payload) => {
              cy.api_crud(tokens, "Tag", payload);
            });
        });
    });

    // Interceptors
    cy.intercept("DELETE", "/api/controls/tag/*").as("deleteTag");
    cy.intercept("GET", "/api/controls/tag-type*").as("getTagTypes");
  });

  it("Delete", () => {
    tag.delete(0, 0);
    cy.wait("@deleteTag");

    // Verify table
    cy.wait("@getTagTypes");
    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("not.contain", "tag-a");
  });
});
