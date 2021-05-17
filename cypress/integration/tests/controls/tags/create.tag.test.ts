/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { Tag } from "../../../models/tag";

describe("Create new tag type", () => {
  const tag = new Tag();

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "TagType");
      cy.api_create(tokens, "TagType", { name: "type-a" });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "Tag");
    });

    // Interceptors
    cy.intercept("GET", "/api/controls/tag-type*").as("getTagTypes");
    cy.intercept("POST", "/api/controls/tag*").as("postTag");
  });

  it("With min data", () => {
    tag.create({
      name: "myTag",
      tagType: "type-a",
    });
    cy.wait("@postTag");

    // Verify table
    cy.wait("@getTagTypes");
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
