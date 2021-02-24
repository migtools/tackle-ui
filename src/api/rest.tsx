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
} from "./models";

export const BASE_URL = "controls";
export const BUSINESS_SERVICES = BASE_URL + "/business-service";
export const STAKEHOLDERS = BASE_URL + "/stakeholder";
export const STAKEHOLDER_GROUPS = BASE_URL + "/stakeholder-group";

const headers = { Accept: "application/hal+json" };

type Direction = "asc" | "desc";

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

  const query: string[] = [];

  const params = {
    page: pagination.page - 1,
    size: pagination.perPage,
    sort: sortByQuery,

    name: filters.name,
    description: filters.description,
    "owner.displayName": filters.owner,
  };

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

  return APIClient.get(`${BUSINESS_SERVICES}?${query.join("&")}`, { headers });
};

export const deleteBusinessService = (id: number): AxiosPromise => {
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

// Stakeholders

export enum StakeholderSortBy {
  EMAIL,
  DISPLAY_NAME,
  JOB_FUNCTION,
  GROUP,
}
export interface StakeholderSortByQuery {
  field: StakeholderSortBy;
  direction?: Direction;
}

export const getStakeholders = (
  filters: {
    email?: string[];
    displayName?: string[];
    jobFuction?: string[];
    group?: string[];
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
      case StakeholderSortBy.GROUP:
        field = "group";
        break;
      default:
        throw new Error("Could not define SortBy field name");
    }
    sortByQuery = `${sortBy.direction === "desc" ? "-" : ""}${field}`;
  }

  const query: string[] = [];

  const params = {
    page: pagination.page - 1,
    size: pagination.perPage,
    sort: sortByQuery,

    email: filters.email,
    displayName: filters.displayName,
    jobFunction: filters.jobFuction,
    group: filters.group,
  };

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
  MEMBERS,
}
export interface StakeholderGroupSortByQuery {
  field: StakeholderGroupSortBy;
  direction?: Direction;
}

export const getStakeholderGroups = (
  filters: {
    name?: string[];
    description?: string[];
    member?: string[];
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
      case StakeholderGroupSortBy.MEMBERS:
        field = "displayName";
        break;
      default:
        throw new Error("Could not define SortBy field name");
    }
    sortByQuery = `${sortBy.direction === "desc" ? "-" : ""}${field}`;
  }

  const query: string[] = [];

  const params = {
    page: pagination.page - 1,
    size: pagination.perPage,
    sort: sortByQuery,

    name: filters.name,
    description: filters.description,
    member: filters.member,
  };

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
