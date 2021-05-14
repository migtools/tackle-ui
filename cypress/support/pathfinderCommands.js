const getHeaders = (tokens) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + tokens.access_token,
  };
  return headers;
};

Cypress.Commands.add(
  "deleteAssessmentByApplicationId",
  (applicationId, tokens) => {
    const headers = getHeaders(tokens);

    cy.request({
      method: "GET",
      headers: headers,
      url: `${Cypress.env(
        "pathfinder_base_url"
      )}/assessments?applicationId=${applicationId}`,
    }).then((response) => {
      response.body.forEach((app) => {
        cy.request({
          method: "DELETE",
          headers: headers,
          url: `${Cypress.env("pathfinder_base_url")}/assessments/${app.id}`,
        });
      });
    });
  }
);

Cypress.Commands.add("createAssessment", (payload, tokens) => {
  const headers = getHeaders(tokens);

  cy.request({
    method: "POST",
    headers: headers,
    body: payload,
    url: `${Cypress.env("pathfinder_base_url")}/assessments`,
  }).its("body");
});
