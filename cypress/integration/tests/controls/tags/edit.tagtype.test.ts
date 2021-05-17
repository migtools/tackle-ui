/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { TagType } from "../../../models/tag-type";

describe("Edit tag type", () => {
  const tagType = new TagType();

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "TagType");

      // Tag type to edit
      cy.api_create(tokens, "TagType", {
        name: "aaa",
        rank: 111,
        colour: `#fff`,
      });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Interceptors
    cy.intercept("GET", "/api/controls/tag-type*").as("getTagTypes");
    cy.intercept("PUT", "/api/controls/tag-type/*").as("putTagType");
  });

  it("Name and rank", () => {
    tagType.edit(0, {
      name: "newName",
      rank: 222,
    });
    cy.wait("@putTagType");

    // Verify table
    cy.wait("@getTagTypes");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "newName")
      .should("contain", "222");
  });

  it("Color", () => {
    tagType.edit(0, {
      name: "newName",
      rank: 10,
      color: "Red",
    });
    cy.wait("@putTagType");

    // Verify table
    cy.wait("@getTagTypes");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "newName")
      .should("contain", "10")
      .should("contain", "Red");
  });
});
