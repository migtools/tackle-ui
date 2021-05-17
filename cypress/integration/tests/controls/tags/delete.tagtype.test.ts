/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { TagType } from "../../../models/tag-type";

describe("Delete tag type", () => {
  const tagType = new TagType();

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "TagType");
      cy.api_create(tokens, "TagType", {
        name: "tagtype-a",
      });
    });

    // Interceptors
    cy.intercept("DELETE", "/api/controls/tag-type/*").as("deleteTagType");
    cy.intercept("GET", "/api/controls/tag-type*").as("getTagTypes");
  });

  it("Delete the only item available", () => {
    tagType.delete(0);
    cy.wait("@deleteTagType");

    // Verify table
    cy.wait("@getTagTypes");
    cy.get(
      ".pf-c-empty-state > .pf-c-empty-state__content > .pf-c-title"
    ).contains("No tag types available");
  });
});
