import { applyFilterTextToolbar } from "./commons";

export interface IFormValue {
  categories?: {
    answerIndex: number;
    comments?: string;
  }[];
}

export class Assessment {
  openPage(assessmentId: number): void {
    cy.intercept("GET", "/api/pathfinder/assessments/*").as(
      "getAssessmentFromURL"
    );

    cy.visit(`/application-inventory/assessment/${assessmentId}`);
    cy.wait("@getAssessmentFromURL");

    // Interceptors
    cy.intercept("PATCH", "/api/pathfinder/assessments/*").as(
      "patchAssessment"
    );
  }

  protected verifyInitialFormStatus(): void {
    cy.get(".pf-c-wizard__footer button[cy-data='back']").should("be.disabled");
  }

  protected submitForm(): void {
    cy.get(".pf-c-wizard__footer").find("button[cy-data='next']").click();
    cy.wait("@patchAssessment");
  }

  protected fillForm(formValue: IFormValue): void {
    // Jump to first category
    cy.get(".pf-c-wizard__footer").find("button[cy-data='next']").click();

    // Fill answers
    if (formValue.categories) {
      formValue.categories.forEach((e, index) => {
        // Verify footer buttons initial values
        cy.get(".pf-c-wizard__footer button[cy-data='next']").should(
          "be.disabled"
        );

        // Select answer
        cy.get("div[cy-data='question']").each((question) => {
          cy.wrap(question)
            .find("input[type='radio']")
            .eq(e.answerIndex)
            .check();
        });

        // Fill comments
        if (e.comments) {
          cy.get("textarea[aria-label='comments']").clear().type(e.comments);
        }

        // Verify footer buttons
        cy.get(".pf-c-wizard__footer button[cy-data='next']").should(
          "not.be.disabled"
        );

        // Jump to next step
        if (index < formValue.categories.length - 1) {
          cy.get(".pf-c-wizard__footer")
            .find("button[cy-data='next']")
            .contains("Next")
            .click();
        }
      });
    }
  }

  edit(assessmentId: number, formValue: IFormValue): void {
    this.openPage(assessmentId);

    this.verifyInitialFormStatus();
    this.fillForm(formValue);
    this.submitForm();
  }

  applyFilter(filterIndex: number, filterText: string): void {
    applyFilterTextToolbar(filterIndex, filterText);
  }
}
