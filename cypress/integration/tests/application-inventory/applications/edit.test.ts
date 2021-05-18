/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { Application } from "../../../models/application";

describe("Edit business service", () => {
  const application = new Application();

  const businessServices = [];
  const tagTypes = [];
  const tags = [];

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "BusinessService");
      cy.api_clean(tokens, "TagType");

      cy.log("")
        .then(() => {
          // Create business services
          return [...Array(11)]
            .map((_, i) => ({
              name: `service-${(i + 10).toString(36)}`,
            }))
            .forEach((payload) => {
              cy.api_crud(
                tokens,
                "BusinessService",
                "POST",
                payload
              ).then((responseData) => businessServices.push(responseData));
            });
        })
        .then(() => {
          // Create tag types
          return [...Array(2)]
            .map((_, i) => ({
              name: `tagType-${(i + 10).toString(36)}`,
            }))
            .forEach((payload) => {
              cy.api_crud(tokens, "TagType", "POST", payload).then((data) => {
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
              cy.api_crud(tokens, "Tag", "POST", payload).then((responseData) =>
                tags.push(responseData)
              );
            });
        });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "Application");

      cy.log("").then(() => {
        // Create application to edit
        return cy.api_crud(tokens, "Application", "POST", {
          name: "application-a",
        });
      });
    });

    // Interceptors
    cy.intercept("GET", "/api/application-inventory/application*").as(
      "getApplications"
    );
    cy.intercept("PUT", "/api/application-inventory/application/*").as(
      "putApplication"
    );
  });

  it("Name, description, and comments", () => {
    application.edit(0, {
      name: "newName",
      description: "newDescription",
      comments: "newComments",
    });
    cy.wait("@putApplication");

    // Verify table
    cy.wait("@getApplications");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "newName")
      .should("contain", "newDescription");

    cy.get(".pf-c-table").pf4_table_row_expand(0);
    cy.get(".pf-c-table > tbody > tr.pf-c-table__expandable-row")
      .find(".pf-c-description-list .pf-c-description-list__text")
      .contains("newComments");
  });

  it("Business service", () => {
    cy.intercept("GET", new RegExp("/api/controls/business-service*")).as(
      "getBusinessServices"
    );

    // Edit
    application.edit(0, {
      businessService: "service-b",
    });
    cy.wait("@putApplication");

    // Verify table
    cy.wait("@getApplications");
    cy.wait("@getBusinessServices");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).should("contain", "service-b");
  });

  it("Tags", () => {
    cy.intercept("GET", new RegExp("/api/controls/tag*")).as("getTags");

    // Edit
    application.edit(0, {
      tags: ["tag-b-a", "tag-b-b"],
    });
    cy.wait("@putApplication");

    // Verify table
    cy.wait("@getApplications");
    cy.wait("@getTags");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).should("contain", "2");

    cy.get(".pf-c-table").pf4_table_row_expand(0);
    cy.get(".pf-c-table > tbody > tr.pf-c-table__expandable-row")
      .find(".pf-c-description-list .pf-c-description-list__text")
      .should("contain", "tag-b-a")
      .should("contain", "tag-b-b");
  });
});
