/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { TagType } from "../../../models/tag-type";

describe("Sort business services", () => {
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
          // Create tag types
          return [...Array(11)]
            .map((_, i) => ({
              name: `type-${(i + 10).toString(36)}`,
              rank: i,
            }))
            .forEach((payload) => {
              cy.api_create(tokens, "TagType", payload).then((data) => {
                tagTypes.push(data);
              });
            });
        })
        .then(() => {
          // Create tags
          return [...Array(10)]
            .map((_, i) => ({
              name: `tag-${(i + 10).toString(36)}`,
              tagType: tagTypes[i],
            }))
            .forEach((payload) => {
              cy.api_create(tokens, "Tag", payload);
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

  it("Sort by name", () => {
    tagType.openPage();
    cy.wait("@getTagTypes");

    // Asc is the default
    cy.get(".pf-c-table").pf4_table_column_isAsc("Tag type");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("type-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("type-j");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Tag type");
    cy.wait("@getTagTypes");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("type-k");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("type-b");
  });

  it("Sort by rank", () => {
    tagType.openPage();
    cy.wait("@getTagTypes");

    // Asc
    cy.get(".pf-c-table").pf4_table_column_toggle("Rank");
    cy.wait("@getTagTypes");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("type-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("type-j");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Rank");
    cy.wait("@getTagTypes");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("type-k");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("type-b");
  });

  it("Sort by tags", () => {
    tagType.openPage();
    cy.wait("@getTagTypes");

    // Asc
    cy.get(".pf-c-table").pf4_table_column_toggle("Tag(s)");
    cy.wait("@getTagTypes");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("type-k");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("type-j");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Tag(s)");
    cy.wait("@getTagTypes");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("type-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("type-j");
  });
});
