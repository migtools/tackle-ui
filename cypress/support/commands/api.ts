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

import { buildHeadersWithHAL_JSON, buildHeadersWithJSON } from "./utils";

const sizeQueryParam = "size=1000";
const controlsBaseUrl = "/api/controls";
const applicationInventoryBaseUrl = "/api/application-inventory";
const pathfinderBaseUrl = "/api/pathfinder";

export type ResourceType =
  | "JobFunction"
  | "Stakeholder"
  | "StakeholderGroup"
  | "BusinessService"
  | "TagType"
  | "Tag"
  | "Application"
  | "ApplicationsDependency"
  | "ImportSummary"
  | "Assessment";

const allResourceTypes: ResourceType[] = [
  "JobFunction",
  "Stakeholder",
  "StakeholderGroup",
  "BusinessService",
  "TagType",
  "Tag",
  "Application",
  "ApplicationsDependency",
  "ImportSummary",
  // "Assessment",
];

type ResourceTypeList = {
  [key in ResourceType]: {
    baseUrl: string;
    _embeddedField: string;
  };
};

const resourceTypeList: ResourceTypeList = {
  JobFunction: {
    baseUrl: `${controlsBaseUrl}/job-function`,
    _embeddedField: "job-function",
  },
  Stakeholder: {
    baseUrl: `${controlsBaseUrl}/stakeholder`,
    _embeddedField: "stakeholder",
  },
  StakeholderGroup: {
    baseUrl: `${controlsBaseUrl}/stakeholder-group`,
    _embeddedField: "stakeholder-group",
  },
  BusinessService: {
    baseUrl: `${controlsBaseUrl}/business-service`,
    _embeddedField: "business-service",
  },
  TagType: {
    baseUrl: `${controlsBaseUrl}/tag-type`,
    _embeddedField: "tag-type",
  },
  Tag: {
    baseUrl: `${controlsBaseUrl}/tag`,
    _embeddedField: "tag",
  },
  Application: {
    baseUrl: `${applicationInventoryBaseUrl}/application`,
    _embeddedField: "application",
  },
  ApplicationsDependency: {
    baseUrl: `${applicationInventoryBaseUrl}/applications-dependency`,
    _embeddedField: "applications-dependency",
  },
  ImportSummary: {
    baseUrl: `${applicationInventoryBaseUrl}/import-summary`,
    _embeddedField: "import-summary",
  },
  Assessment: {
    baseUrl: `${pathfinderBaseUrl}/assessments`,
    _embeddedField: undefined,
  },
};

const create = (headers: any, url: string, payload: any) => {
  cy.request({
    method: "POST",
    headers: headers,
    body: payload,
    url: url,
  }).its("body");
};

const singleRequest = (
  headers: any,
  url: string,
  payload: any,
  method: "PUT" | "PATCH" | "DELETE"
) => {
  cy.request({
    method: method,
    headers: headers,
    body: payload,
    url: `${url}/${payload.id}`,
  }).its("body");
};

const deleteAll = (headers: any, url: string, embeddedField: string) => {
  cy.request({
    method: "GET",
    headers: headers,
    url: `${url}?${sizeQueryParam}`,
  })
    .then((response) =>
      embeddedField ? response.body._embedded[embeddedField] : response.body
    )
    .each((item: any) =>
      cy.request({
        method: "DELETE",
        headers: headers,
        url: `${url}/${item.id}`,
      })
    );
};

// Utils

const getHeadersFromResourceType = (
  resourceType: ResourceType,
  tokens: KcTokens
) => {
  let headers;
  switch (resourceType) {
    case "Assessment":
      headers = buildHeadersWithJSON(tokens);
      break;
    default:
      headers = buildHeadersWithHAL_JSON(tokens);
      break;
  }
  return headers;
};
// Commands

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      api_crud(
        tokens: KcTokens,
        resource: ResourceType,
        method: "POST" | "PUT" | "PATCH" | "DELETE",
        payload: any
      ): Chainable<any>;
      api_clean(tokens: KcTokens, resource?: ResourceType): void;
    }
  }
}

Cypress.Commands.add(
  "api_crud",
  (
    tokens: KcTokens,
    resource: ResourceType,
    method: "POST" | "PUT" | "PATCH" | "DELETE",
    payload: any
  ) => {
    const headers = getHeadersFromResourceType(resource, tokens);
    const type = resourceTypeList[resource];

    switch (method) {
      case "POST":
        create(headers, type.baseUrl, payload);
        break;
      case "PUT":
      case "PATCH":
      case "DELETE":
        singleRequest(headers, type.baseUrl, payload, method);
        break;
    }
  }
);

Cypress.Commands.add(
  "api_clean",
  (tokens: KcTokens, resource?: ResourceType) => {
    const headers = getHeadersFromResourceType(resource, tokens);

    if (resource) {
      const type = resourceTypeList[resource];
      deleteAll(headers, type.baseUrl, type._embeddedField);
    } else {
      allResourceTypes.forEach((e) => {
        const type = resourceTypeList[e];
        deleteAll(headers, type.baseUrl, type._embeddedField);
      });
    }
  }
);

export {};
