import { AxiosPromise } from "axios";
import { APIClient } from "axios-config";

import {
  BusinessService,
  BusinessServicePage,
  PageQuery,
  StakeholderPage,
} from "./models";

export const BASE_URL = "controls";
export const BUSINESS_SERVICES = BASE_URL + "/business-service";
export const STAKEHOLDERS = BASE_URL + "/stakeholder";

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
        field = "owner";
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
}
export interface StakeholderSortByQuery {
  field: StakeholderSortBy;
  direction?: Direction;
}

export const getStakeholders = (
  filters: {
    filterText?: string;
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
    filter: filters.filterText,
  };
  Object.keys(params).forEach((key) => {
    const value = (params as any)[key];
    if (value !== undefined) {
      query.push(`${key}=${value}`);
    }
  });

  return APIClient.get(`${STAKEHOLDERS}?${query.join("&")}`, { headers });
};

export const getAllStakeholders = (): AxiosPromise<StakeholderPage> => {
  return APIClient.get(`${STAKEHOLDERS}?size=1000`, { headers });
};
