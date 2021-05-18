/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { TagType } from "../../../models/tag-type";

describe("Filter business services", () => {
  const tagType = new TagType();

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Data
    const stakeholders = [];

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "TagType");

      const tagTypes = [];

      cy.log("")
        .then(() => {
          // Create tagTypes
          return [...Array(11)]
            .map((_, i) => ({
              name: `type-${(i + 10).toString(36)}`,
            }))
            .forEach((payload) => {
              cy.api_crud(tokens, "TagType", "POST", payload).then((data) => {
                tagTypes.push(data);
              });
            });
        })
        .then(() => {
          // Create tags
          return [...Array(11)]
            .map((_, i) => ({
              name: `tag-${(i + 10).toString(36)}`,
              tagType: tagTypes[i],
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

    // Inteceptors
    cy.intercept("GET", "/api/controls/tag-type*").as("getTagTypes");
  });

  it("By tagType", () => {
    tagType.openPage();
    cy.wait("@getTagTypes");

    // First filter
    tagType.applyFilter(0, "type-a");

    cy.wait("@getTagTypes");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("type-a");

    // Second filter
    tagType.applyFilter(0, "type-k");

    cy.wait("@getTagTypes");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("type-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("type-k");
  });

  it("By tag", () => {
    tagType.openPage();
    cy.wait("@getTagTypes");

    // First filter
    tagType.applyFilter(1, "tag-a");

    cy.wait("@getTagTypes");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("type-a");

    // Second filter
    tagType.applyFilter(1, "tag-k");

    cy.wait("@getTagTypes");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("type-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("type-k");
  });
});
