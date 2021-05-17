/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { Application } from "../../../models/application";

describe("Create new business service", () => {
  const application = new Application();

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "BusinessService");
      cy.api_clean(tokens, "TagType");

      const tagTypes = [];

      cy.log("")
        .then(() => {
          // Create business services
          return [...Array(11)]
            .map((_, i) => ({
              name: `service-${(i + 10).toString(36)}`,
            }))
            .forEach((payload) => {
              cy.api_create(tokens, "BusinessService", payload);
            });
        })
        .then(() => {
          // Create tag types
          return [...Array(2)]
            .map((_, i) => ({
              name: `tagType-${(i + 10).toString(36)}`,
            }))
            .forEach((payload) => {
              cy.api_create(tokens, "TagType", payload).then((data) => {
                tagTypes.push(data);
              });
            });
        })
        .then(() => {
          // Create tags
          return [...Array(2)]
            .map((_, i) => {
              return [
                {
                  name: `tag-a-${(i + 10).toString(36)}`,
                  tagType: tagTypes[i],
                },
                {
                  name: `tag-b-${(i + 10).toString(36)}`,
                  tagType: tagTypes[i],
                },
              ];
            })
            .flatMap((a) => a)
            .forEach((payload) => {
              cy.api_create(tokens, "Tag", payload);
            });
        });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "Application");
    });

    // Interceptors
    cy.intercept("GET", "/api/application-inventory/application*").as(
      "getApplications"
    );
    cy.intercept("POST", "/api/application-inventory/application*").as(
      "postApplication"
    );
  });

  it("With min data", () => {
    application.create({
      name: "myApplication",
    });
    cy.wait("@postApplication");

    // Verify table
    cy.wait("@getApplications");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "myApplication");
  });

  it("With name, description, and comments", () => {
    application.create({
      name: "myApplication",
      description: "myDescription",
      comments: "myComments",
    });
    cy.wait("@postApplication");

    // Verify table
    cy.wait("@getApplications");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "myApplication")
      .should("contain", "myDescription");

    cy.get(".pf-c-table").pf4_table_row_expand(0);
    cy.get(".pf-c-table > tbody > tr.pf-c-table__expandable-row")
      .find(".pf-c-description-list .pf-c-description-list__text")
      .contains("myComments");
  });

  it("With business service", () => {
    cy.intercept("GET", new RegExp("/api/controls/business-service*")).as(
      "getBusinessServices"
    );

    // Create
    application.create({
      name: "myApplication",
      businessService: "service-a",
    });
    cy.wait("@postApplication");

    // Verify table
    cy.wait("@getApplications");
    cy.wait("@getBusinessServices");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "myApplication")
      .should("contain", "service-a");
  });

  it("With tags", () => {
    cy.intercept("GET", new RegExp("/api/controls/tag/*")).as("getTag");

    // Create
    application.create({
      name: "myApplication",
      tags: ["tag-a-a", "tag-b-a"],
    });
    cy.wait("@postApplication");

    // Verify table
    cy.wait("@getApplications");
    cy.wait("@getTag"); // Fetch first tag
    cy.wait("@getTag"); // Fetch second tag
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "myApplication")
      .should("contain", "2");

    cy.get(".pf-c-table").pf4_table_row_expand(0);
    cy.get(".pf-c-table > tbody > tr.pf-c-table__expandable-row")
      .find(".pf-c-label")
      .should("contain", "tag-a-a")
      .should("contain", "tag-b-a");
  });
});
