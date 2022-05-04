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
import { applyFilterTextToolbar } from "./commons";

export interface IFormValue {
  fileName: string;
}

export class ApplicationImportPage {
  openPage(): void {
    // Interceptors
    cy.intercept("GET", "/api/application-inventory/import-summary*").as(
      "getImportSummaries"
    );
    cy.intercept("POST", "/api/application-inventory/file/upload").as(
      "postImportSummary"
    );
    cy.intercept("DELETE", "/api/application-inventory/import-summary/*").as(
      "deleteImportSummary"
    );

    // Open page
    cy.visit("/application-inventory/application-imports");
    cy.wait("@getImportSummaries");
  }

  protected fillForm(formValue: IFormValue): void {
    cy.get("input[type='file']").attachFile(formValue.fileName, {
      subjectType: "drag-n-drop",
    });
  }

  protected verifyInitialFormStatus(): void {
    cy.get("form.pf-c-form button.pf-m-primary")
      .contains("Import")
      .should("be.disabled");
  }

  protected submitImportForm = () => {
    cy.get("form.pf-c-form button.pf-m-primary")
      .contains("Import")
      .should("not.be.disabled")
      .click({ force: true });
  };

  create(formValue: IFormValue, openPage: boolean = true): void {
    if (openPage) {
      this.openPage();
    }

    cy.get("button[aria-label='import-applications']").click();

    this.verifyInitialFormStatus();
    this.fillForm(formValue);
    this.submitImportForm();

    cy.wait("@postImportSummary");
    cy.wait("@getImportSummaries");
  }

  delete(rowIndex: number): void {
    cy.get(".pf-c-table").pf4_table_action_select(rowIndex, "Delete");
    cy.get("button[aria-label='confirm']").click();
    cy.wait("@deleteImportSummary");
    cy.wait("@getImportSummaries");
  }

  applyFilter(filterIndex: number, filterText: string): void {
    switch (filterIndex) {
      case 0:
        applyFilterTextToolbar(filterIndex, filterText);
        break;
      default:
        break;
    }
    cy.wait("@getImportSummaries");
  }
}
