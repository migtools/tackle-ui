/// <reference types="cypress" />

import { buildHeadersWithHAL_JSON } from "./utils";

const sizeQueryParam = "size=1000";
const controlsBaseUrl = "/api/controls";
const applicationInventoryBaseUrl = "/api/application-inventory";

export type ResourceType =
  | "JobFunction"
  | "Stakeholder"
  | "StakeholderGroup"
  | "BusinessService"
  | "TagType"
  | "Tag"
  | "Application"
  | "ApplicationsDependency";

const allResourceTypes: ResourceType[] = [
  "JobFunction",
  "Stakeholder",
  "StakeholderGroup",
  "BusinessService",
  "TagType",
  "Tag",
  "Application",
  "ApplicationsDependency",
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
};

const create = (headers: any, url: string, payload: any) => {
  cy.request({
    method: "POST",
    headers: headers,
    body: payload,
    url: url,
  }).its("body");
};

const deleteAll = (headers: any, url: string, embeddedField: string) => {
  cy.request({
    method: "GET",
    headers: headers,
    url: `${url}?${sizeQueryParam}`,
  })
    .then((response) => response.body._embedded[embeddedField])
    .each((item: any) =>
      cy.request({
        method: "DELETE",
        headers: headers,
        url: `${url}/${item.id}`,
      })
    );
};

// Commands

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      api_create(
        tokens: KcTokens,
        resource: ResourceType,
        payload: any
      ): Chainable<any>;
      api_clean(tokens: KcTokens, resource?: ResourceType): void;
    }
  }
}

Cypress.Commands.add(
  "api_create",
  (tokens: KcTokens, resource: ResourceType, payload: any) => {
    const headers = buildHeadersWithHAL_JSON(tokens);
    const type = resourceTypeList[resource];

    create(headers, type.baseUrl, payload);
  }
);

Cypress.Commands.add(
  "api_clean",
  (tokens: KcTokens, resource?: ResourceType) => {
    const headers = buildHeadersWithHAL_JSON(tokens);

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
