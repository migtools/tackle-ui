export interface PageQuery {
  page: number;
  perPage: number;
}

export interface SortByQuery {
  index: number;
  direction: "asc" | "desc";
}

export interface PageRepresentation<T> {
  meta: Meta;
  data: T[];
}

export interface Meta {
  count: number;
}

export interface BusinessService {
  id?: number;
  name: string;
  description?: string;
  owner?: Stakeholder;
}

export interface Stakeholder {
  id?: number;
  displayName: string;
  email: string;
  jobFunction?: string;
  groups?: number;
}

export interface StakeholderGroup {
  id?: number;
  name: string;
  description: string;
  members?: string[];
}

export interface BusinessServicePage {
  _embedded: {
    "business-service": BusinessService[];
  };
  total_count: number;
}

export interface StakeholderPage {
  _embedded: {
    stakeholder: Stakeholder[];
  };
  total_count: number;
}

export interface StakeholderGroupPage {
  _embedded: {
    "stakeholder-group": StakeholderGroup[];
  };
  total_count: number;
}
