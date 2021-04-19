import {
  Application,
  ApplicationPage,
  BusinessService,
  BusinessServicePage,
  JobFunction,
  JobFunctionPage,
  PageRepresentation,
  Stakeholder,
  StakeholderGroup,
  StakeholderGroupPage,
  StakeholderPage,
} from "./models";
import {
  BusinessServiceSortBy,
  getBusinessServices,
  getJobFunctions,
  getStakeholderGroups,
  getStakeholders,
  JobFunctionSortBy,
  StakeholderGroupSortBy,
  StakeholderSortBy,
} from "./rest";

export const getAllBusinessServices = () => {
  return getBusinessServices(
    {},
    { page: 1, perPage: 1000 },
    { field: BusinessServiceSortBy.NAME }
  );
};

export const getAllStakeholders = () => {
  return getStakeholders(
    {},
    { page: 1, perPage: 1000 },
    { field: StakeholderSortBy.DISPLAY_NAME }
  );
};

export const getAllStakeholderGroups = () => {
  return getStakeholderGroups(
    {},
    { page: 1, perPage: 1000 },
    { field: StakeholderGroupSortBy.NAME }
  );
};

export const getAllJobFunctions = () => {
  return getJobFunctions(
    {},
    { page: 1, perPage: 1000 },
    { field: JobFunctionSortBy.ROLE }
  );
};

//

export const stakeholderPageMapper = (
  page: StakeholderPage
): PageRepresentation<Stakeholder> => ({
  meta: { count: page.total_count },
  data: page._embedded.stakeholder,
});

export const stakeholderGroupPageMapper = (
  page: StakeholderGroupPage
): PageRepresentation<StakeholderGroup> => ({
  meta: { count: page.total_count },
  data: page._embedded["stakeholder-group"],
});

export const bussinessServicePageMapper = (
  page: BusinessServicePage
): PageRepresentation<BusinessService> => ({
  meta: { count: page.total_count },
  data: page._embedded["business-service"],
});

export const jobFunctionPageMapper = (
  page: JobFunctionPage
): PageRepresentation<JobFunction> => ({
  meta: { count: page.total_count },
  data: page._embedded["job-function"],
});

//

export const applicationPageMapper = (
  page: ApplicationPage
): PageRepresentation<Application> => ({
  meta: { count: page.total_count },
  data: page._embedded.application,
});
