const getHeaders = (tokens) => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/hal+json",
      Authorization: "Bearer " + tokens.access_token,
    };
    return headers;
  };
  
  Cypress.Commands.add("tackleControlsClean", (tokens) => {
    const sizeQueryParam = "size=1000";
    const headers = getHeaders(tokens);
  
    cy.log("Tackle controls - clean started")
  
      .log("Tackle controls - delete business services")
      .then(() => {
        return cy.request({
          method: "GET",
          headers: headers,
          url: `${Cypress.env(
            "controls_base_url"
          )}/business-service?${sizeQueryParam}`,
        });
      })
      .then((response) => response.body._embedded["business-service"])
      .each((item) => {
        return cy.request({
          method: "DELETE",
          headers: headers,
          url: `${Cypress.env("controls_base_url")}/business-service/${item.id}`,
        });
      })
  
      .log("Tackle controls - delete stakeholders")
      .then(() => {
        return cy.request({
          method: "GET",
          headers: headers,
          url: `${Cypress.env(
            "controls_base_url"
          )}/stakeholder?${sizeQueryParam}`,
        });
      })
      .then((response) => response.body._embedded["stakeholder"])
      .each((item) => {
        return cy.request({
          method: "DELETE",
          headers: headers,
          url: `${Cypress.env("controls_base_url")}/stakeholder/${item.id}`,
        });
      })
  
      .log("Tackle controls - clean finished");
  });
  
  Cypress.Commands.add("createStakeholder", (payload, tokens) => {
    const headers = getHeaders(tokens);
  
    cy.request({
      method: "POST",
      headers: headers,
      body: payload,
      url: `${Cypress.env("controls_base_url")}/stakeholder`,
    }).its("body");
  });
  
  Cypress.Commands.add("createBusinessService", (payload, tokens) => {
    const headers = getHeaders(tokens);
  
    cy.request({
      method: "POST",
      headers: headers,
      body: payload,
      url: `${Cypress.env("controls_base_url")}/business-service`,
    }).its("body");
  });