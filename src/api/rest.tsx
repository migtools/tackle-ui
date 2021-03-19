import { AxiosPromise } from "axios";
import { APIClient } from "axios-config";

import {
  PageQuery,
  BusinessService,
  BusinessServicePage,
  Stakeholder,
  StakeholderPage,
  StakeholderGroup,
  StakeholderGroupPage,
  JobFunctionPage,
  ApplicationPage,
  Application,
  Assessment,
} from "./models";

export const CONTROLS_BASE_URL = "controls";
export const APP_INVENTORY_BASE_URL = "application-inventory";
export const PATHFINDER_BASE_URL = "pathfinder";

export const BUSINESS_SERVICES = CONTROLS_BASE_URL + "/business-service";
export const STAKEHOLDERS = CONTROLS_BASE_URL + "/stakeholder";
export const STAKEHOLDER_GROUPS = CONTROLS_BASE_URL + "/stakeholder-group";
export const JOB_FUNCTIONS = CONTROLS_BASE_URL + "/job-function";

export const APPLICATIONS = APP_INVENTORY_BASE_URL + "/application";

export const ASSESSMENTS = PATHFINDER_BASE_URL + "/assessments";

const headers = { Accept: "application/hal+json" };

type Direction = "asc" | "desc";

const buildQuery = (params: any) => {
  const query: string[] = [];

  Object.keys(params).forEach((key) => {
    const value = (params as any)[key];

    if (value !== undefined && value !== null) {
      let queryParamValues: string[] = [];
      if (Array.isArray(value)) {
        queryParamValues = value;
      } else {
        queryParamValues = [value];
      }
      queryParamValues.forEach((v) => query.push(`${key}=${v}`));
    }
  });

  return query;
};

// Business services

export enum BusinessServiceSortBy {
  NAME,
  OWNER,
}
export interface BusinessServiceSortByQuery {
  field: BusinessServiceSortBy;
  direction?: Direction;
}

export const getBusinessServices = (
  filters: {
    name?: string[];
    description?: string[];
    owner?: string[];
  },
  pagination: PageQuery,
  sortBy?: BusinessServiceSortByQuery
): AxiosPromise<BusinessServicePage> => {
  let sortByQuery: string | undefined = undefined;
  if (sortBy) {
    let field;
    switch (sortBy.field) {
      case BusinessServiceSortBy.NAME:
        field = "name";
        break;
      case BusinessServiceSortBy.OWNER:
        field = "owner.displayName";
        break;
      default:
        throw new Error("Could not define SortBy field name");
    }
    sortByQuery = `${sortBy.direction === "desc" ? "-" : ""}${field}`;
  }

  const params = {
    page: pagination.page - 1,
    size: pagination.perPage,
    sort: sortByQuery,

    name: filters.name,
    description: filters.description,
    "owner.displayName": filters.owner,
  };

  const query: string[] = buildQuery(params);
  return APIClient.get(`${BUSINESS_SERVICES}?${query.join("&")}`, { headers });
};

export const getAllBusinessServices = (): AxiosPromise<BusinessServicePage> => {
  return APIClient.get(`${BUSINESS_SERVICES}?size=1000`, { headers });
};

export const deleteBusinessService = (id: number | string): AxiosPromise => {
  return APIClient.delete(`${BUSINESS_SERVICES}/${id}`);
};

export const createBusinessService = (
  obj: BusinessService
): AxiosPromise<BusinessService> => {
  return APIClient.post(`${BUSINESS_SERVICES}`, obj);
};

export const updateBusinessService = (
  obj: BusinessService
): AxiosPromise<BusinessService> => {
  return APIClient.put(`${BUSINESS_SERVICES}/${obj.id}`, obj);
};

export const getBusinessServiceById = (
  id: number
): AxiosPromise<BusinessService> => {
  return APIClient.get(`${BUSINESS_SERVICES}/${id}`);
};

// Stakeholders

export enum StakeholderSortBy {
  EMAIL,
  DISPLAY_NAME,
  JOB_FUNCTION,
  STAKEHOLDER_GROUPS,
}
export interface StakeholderSortByQuery {
  field: StakeholderSortBy;
  direction?: Direction;
}

export const getStakeholders = (
  filters: {
    email?: string[];
    displayName?: string[];
    jobFunction?: string[];
    stakeholderGroup?: string[];
  },
  pagination: PageQuery,
  sortBy?: StakeholderSortByQuery
): AxiosPromise<StakeholderPage> => {
  let sortByQuery: string | undefined = undefined;
  if (sortBy) {
    let field;
    switch (sortBy.field) {
      case StakeholderSortBy.EMAIL:
        field = "email";
        break;
      case StakeholderSortBy.DISPLAY_NAME:
        field = "displayName";
        break;
      case StakeholderSortBy.JOB_FUNCTION:
        field = "jobFunction";
        break;
      case StakeholderSortBy.STAKEHOLDER_GROUPS:
        field = "stakeholderGroups.size";
        break;
      default:
        throw new Error("Could not define SortBy field name");
    }
    sortByQuery = `${sortBy.direction === "desc" ? "-" : ""}${field}`;
  }

  const params = {
    page: pagination.page - 1,
    size: pagination.perPage,
    sort: sortByQuery,

    email: filters.email,
    displayName: filters.displayName,
    jobFunction: filters.jobFunction,
    "stakeholderGroups.name": filters.stakeholderGroup,
  };

  const query: string[] = buildQuery(params);
  return APIClient.get(`${STAKEHOLDERS}?${query.join("&")}`, { headers });
};

export const getAllStakeholders = (): AxiosPromise<StakeholderPage> => {
  return APIClient.get(`${STAKEHOLDERS}?size=1000`, { headers });
};

export const deleteStakeholder = (id: number): AxiosPromise => {
  return APIClient.delete(`${STAKEHOLDERS}/${id}`);
};

export const createStakeholder = (
  obj: Stakeholder
): AxiosPromise<Stakeholder> => {
  return APIClient.post(`${STAKEHOLDERS}`, obj);
};

export const updateStakeholder = (
  obj: Stakeholder
): AxiosPromise<Stakeholder> => {
  return APIClient.put(`${STAKEHOLDERS}/${obj.id}`, obj);
};

// Stakeholder groups

export enum StakeholderGroupSortBy {
  NAME,
  STAKEHOLDERS,
}
export interface StakeholderGroupSortByQuery {
  field: StakeholderGroupSortBy;
  direction?: Direction;
}

export const getStakeholderGroups = (
  filters: {
    name?: string[];
    description?: string[];
    stakeholder?: string[];
  },
  pagination: PageQuery,
  sortBy?: StakeholderGroupSortByQuery
): AxiosPromise<StakeholderGroupPage> => {
  let sortByQuery: string | undefined = undefined;
  if (sortBy) {
    let field;
    switch (sortBy.field) {
      case StakeholderGroupSortBy.NAME:
        field = "name";
        break;
      case StakeholderGroupSortBy.STAKEHOLDERS:
        field = "stakeholders.size";
        break;
      default:
        throw new Error("Could not define SortBy field name");
    }
    sortByQuery = `${sortBy.direction === "desc" ? "-" : ""}${field}`;
  }

  const params = {
    page: pagination.page - 1,
    size: pagination.perPage,
    sort: sortByQuery,

    name: filters.name,
    description: filters.description,
    "stakeholders.displayName": filters.stakeholder,
  };

  const query: string[] = buildQuery(params);
  return APIClient.get(`${STAKEHOLDER_GROUPS}?${query.join("&")}`, { headers });
};

export const getAllStakeholderGroups = (): AxiosPromise<StakeholderGroupPage> => {
  return APIClient.get(`${STAKEHOLDER_GROUPS}?size=1000`, { headers });
};

export const deleteStakeholderGroup = (id: number): AxiosPromise => {
  return APIClient.delete(`${STAKEHOLDER_GROUPS}/${id}`);
};

export const createStakeholderGroup = (
  obj: StakeholderGroup
): AxiosPromise<StakeholderGroup> => {
  return APIClient.post(`${STAKEHOLDER_GROUPS}`, obj);
};

export const updateStakeholderGroup = (
  obj: StakeholderGroup
): AxiosPromise<StakeholderGroup> => {
  return APIClient.put(`${STAKEHOLDER_GROUPS}/${obj.id}`, obj);
};

// Job functions

export const getAllJobFunctions = (): AxiosPromise<JobFunctionPage> => {
  return APIClient.get(`${JOB_FUNCTIONS}?size=1000`, { headers });
};

// App inventory

export enum ApplicationSortBy {
  NAME,
}
export interface ApplicationSortByQuery {
  field: ApplicationSortBy;
  direction?: Direction;
}

export const getApplications = (
  filters: {
    name?: string[];
  },
  pagination: PageQuery,
  sortBy?: ApplicationSortByQuery
): AxiosPromise<ApplicationPage> => {
  let sortByQuery: string | undefined = undefined;
  if (sortBy) {
    let field;
    switch (sortBy.field) {
      case ApplicationSortBy.NAME:
        field = "name";
        break;
      default:
        throw new Error("Could not define SortBy field name");
    }
    sortByQuery = `${sortBy.direction === "desc" ? "-" : ""}${field}`;
  }

  const params = {
    page: pagination.page - 1,
    size: pagination.perPage,
    sort: sortByQuery,

    name: filters.name,
  };

  const query: string[] = buildQuery(params);
  return APIClient.get(`${APPLICATIONS}?${query.join("&")}`, {
    headers,
  });
};

export const deleteApplication = (id: number): AxiosPromise => {
  return APIClient.delete(`${APPLICATIONS}/${id}`);
};

export const createApplication = (
  obj: Application
): AxiosPromise<Application> => {
  return APIClient.post(`${APPLICATIONS}`, obj);
};

export const updateApplication = (
  obj: Application
): AxiosPromise<Application> => {
  return APIClient.put(`${APPLICATIONS}/${obj.id}`, obj);
};

export const getApplicationById = (
  id: number | string
): AxiosPromise<Application> => {
  return APIClient.get(`${APPLICATIONS}/${id}`);
};

//

export const getAssessments = (filters: {
  applicationId?: number;
}): AxiosPromise<Assessment[]> => {
  const params = {
    applicationId: filters.applicationId,
  };

  const query: string[] = buildQuery(params);
  return APIClient.get(`${ASSESSMENTS}?${query.join("&")}`);
};

export const createAssessment = (obj: Assessment): AxiosPromise<Assessment> => {
  return APIClient.post(`${ASSESSMENTS}`, obj);
};

export const getAssessmentById = (
  id: number | string
): AxiosPromise<Assessment> => {
  return APIClient.get(`${ASSESSMENTS}/${id}`);
};
