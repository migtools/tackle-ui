const getHeaders = (tokens) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/hal+json",
    Authorization: "Bearer " + tokens.access_token,
  };
  return headers;
};

Cypress.Commands.add("tackleAppInventoryClean", (tokens) => {
  const sizeQueryParam = "size=1000";
  const headers = getHeaders(tokens);

  cy.log("Tackle application inventory - clean started")

    .log("Tackle application inventory - delete applications")
    .then(() => {
      return cy.request({
        method: "GET",
        headers: headers,
        url: `${Cypress.env(
          "application_inventory_base_url"
        )}/application?${sizeQueryParam}`,
      });
    })
    .then((response) => response.body._embedded["application"])
    .each((item) => {
      return cy.request({
        method: "DELETE",
        headers: headers,
        url: `${Cypress.env("application_inventory_base_url")}/application/${
          item.id
        }`,
      });
    })

    .log("Tackle application inventory - clean finished");
});

Cypress.Commands.add("createApplication", (payload, tokens) => {
  const headers = getHeaders(tokens);

  cy.request({
    method: "POST",
    headers: headers,
    body: payload,
    url: `${Cypress.env("application_inventory_base_url")}/application`,
  }).its("body");
});
