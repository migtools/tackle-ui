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
export const verifyInitialFormStatus = () => {
  cy.get("button[aria-label='submit']").should("be.disabled");
};

export const submitForm = () => {
  cy.get("button[aria-label='submit']").should("not.be.disabled");
  cy.get("form").submit();
};

export const selectFilterToolbar = (filterIndex: number) => {
  // Select filter
  cy.get(".pf-c-toolbar .pf-c-dropdown").first().pf4_dropdown("toggle");
  cy.get(".pf-c-toolbar .pf-c-dropdown")
    .first()
    .pf4_dropdown("select", filterIndex)
    .click();
};

export const applyFilterTextToolbar = (
  filterIndex: number,
  filterText: string
) => {
  // Select filter
  selectFilterToolbar(filterIndex);

  // Type filterText and then apply it
  cy.get(".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']")
    .clear()
    .type(filterText);
  cy.get(
    ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
  ).click();
};

export const applyCheckboxFilterToolbar = (filterText: string) => {
  // Apply filter
  cy.get(
    ".pf-c-toolbar .pf-c-select > .pf-c-select__toggle > button.pf-c-select__toggle-button"
  ).click();
  cy.get(
    ".pf-c-toolbar .pf-c-select > .pf-c-select__menu > .pf-c-form__fieldset > .pf-c-select__menu-search > input"
  ).type(filterText);
  cy.get(
    ".pf-c-toolbar .pf-c-select > .pf-c-select__menu > .pf-c-form__fieldset > .pf-c-select__menu-item > input"
  ).check();
};
