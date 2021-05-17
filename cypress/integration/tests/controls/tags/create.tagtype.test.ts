/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { TagType } from "../../../models/tag-type";

describe("Create new tag type", () => {
  const tagType = new TagType();

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "TagType");
    });

    // Interceptors
    cy.intercept("GET", "/api/controls/tag-type*").as("getTagTypes");
    cy.intercept("POST", "/api/controls/tag-type*").as("postTagTypes");
  });

  it("With min data", () => {
    tagType.create({
      name: "myTagType",
      rank: 3,
    });
    cy.wait("@postTagTypes");

    // Verify table
    cy.wait("@getTagTypes");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .find("td[data-label='Tag type']")
      .should("contain", "myTagType");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .find("td[data-label='Rank']")
      .should("contain", "3");
  });

  it("With rank", () => {
    tagType.create({
      name: "myTagType",
      rank: 5,
    });
    cy.wait("@postTagTypes");

    // Verify table
    cy.wait("@getTagTypes");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .find("td[data-label='Tag type']")
      .should("contain", "myTagType");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .find("td[data-label='Rank']")
      .should("contain", "5");
  });

  it("With color", () => {
    tagType.create({
      name: "myTagType",
      rank: 3,
      color: "Blue",
    });
    cy.wait("@postTagTypes");

    // Verify table
    cy.wait("@getTagTypes");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .find("td[data-label='Tag type']")
      .should("contain", "myTagType");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .find("td[data-label='Rank']")
      .should("contain", "3");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .find("td[data-label='Color']")
      .should("contain", "Blue");
  });
});
