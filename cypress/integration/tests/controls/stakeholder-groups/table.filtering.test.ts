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

import { StakeholderGroupPage } from "../../../models/stakeholder-group";

describe("Filter stakeholder group", () => {
  const stakeholderGroupPage = new StakeholderGroupPage();

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Data
    const stakeholders = [];

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "Stakeholder");
      cy.api_clean(tokens, "StakeholderGroup");

      cy.log("")
        .then(() => {
          // Create stakeholders
          return [...Array(11)]
            .map((_, i) => ({
              email: `email-${(i + 10).toString(36)}@domain.com`,
              displayName: `stakeholder-${(i + 10).toString(36)}`,
            }))
            .forEach((payload) => {
              cy.api_crud(tokens, "Stakeholder", "POST", payload).then(
                (data) => {
                  stakeholders.push(data);
                }
              );
            });
        })
        .then(() => {
          // Create stakeholder groups
          return [...Array(11)]
            .map((_, i) => ({
              name: `group-${(i + 10).toString(36)}`,
              description: `description-${(i + 10).toString(36)}`,
              stakeholders: stakeholders.slice(0, i),
            }))
            .forEach((payload) => {
              cy.api_crud(tokens, "StakeholderGroup", "POST", payload);
            });
        });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");
  });

  it("By name", () => {
    const filterIndex = 0;
    stakeholderGroupPage.openPage();

    // First filter
    stakeholderGroupPage.applyFilter(filterIndex, "group-a");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("group-a");

    // Second filter
    stakeholderGroupPage.applyFilter(filterIndex, "group-k");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("group-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("group-k");
  });

  it("By description", () => {
    const filterIndex = 1;
    stakeholderGroupPage.openPage();

    // First filter
    stakeholderGroupPage.applyFilter(filterIndex, "description-a");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("description-a");

    // Second filter
    stakeholderGroupPage.applyFilter(filterIndex, "description-k");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("description-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("description-k");
  });

  it("By member", () => {
    const filterIndex = 2;
    stakeholderGroupPage.openPage();

    // First filter
    stakeholderGroupPage.applyFilter(filterIndex, "stakeholder-j");

    cy.get(".pf-c-table").pf4_table_row_expand(0);
    cy.get(".pf-c-table > tbody > tr.pf-c-table__expandable-row")
      .find(".pf-c-description-list .pf-c-description-list__text")
      .contains("stakeholder-j");
  });
});
