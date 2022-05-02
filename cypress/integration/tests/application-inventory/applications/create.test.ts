/*
Copyright © 2021 the Konveyor Contributors (https://konveyor.io/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { ApplicationPage } from "../../../models/application";

describe("Create new application", () => {
  const application = new ApplicationPage();

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
              cy.api_crud(tokens, "BusinessService", "POST", payload);
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
              cy.api_crud(tokens, "Tag", "POST", payload);
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
  });

  it("With min data", () => {
    application.create({
      name: "myApplication",
    });

    // Verify table
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

    // Verify table
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
    // Create
    application.create({
      name: "myApplication",
      businessService: "service-a",
    });

    // Verify table
    cy.wait("@getBusinessService");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "myApplication")
      .should("contain", "service-a");
  });

  it("With tags", () => {
    // Create
    application.create({
      name: "myApplication",
      tags: ["tag-a-a", "tag-b-a"],
    });

    // Verify table
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
