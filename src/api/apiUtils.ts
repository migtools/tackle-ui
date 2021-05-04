import {
  Application,
  ApplicationDependency,
  ApplicationDependencyPage,
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
  TagType,
  TagTypePage,
} from "./models";
import {
  ApplicationSortBy,
  BusinessServiceSortBy,
  getApplicationDependencies,
  getApplications,
  getBusinessServices,
  getJobFunctions,
  getStakeholderGroups,
  getStakeholders,
  getTagTypes,
  JobFunctionSortBy,
  StakeholderGroupSortBy,
  StakeholderSortBy,
  TagTypeSortBy,
  TagTypeSortByQuery,
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

export const getAllTagTypes = (
  sortBy: TagTypeSortByQuery = { field: TagTypeSortBy.NAME }
) => {
  return getTagTypes({}, { page: 1, perPage: 1000 }, sortBy);
};

export const getAllApplications = () => {
  return getApplications(
    {},
    { page: 1, perPage: 1000 },
    { field: ApplicationSortBy.NAME }
  );
};

export const getAllApplicationDependencies = (filters: {
  from?: string[];
  to?: string[];
}) => {
  return getApplicationDependencies(filters, { page: 1, perPage: 1000 });
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

export const tagTypePageMapper = (
  page: TagTypePage
): PageRepresentation<TagType> => ({
  meta: { count: page.total_count },
  data: page._embedded["tag-type"],
});

//

export const applicationPageMapper = (
  page: ApplicationPage
): PageRepresentation<Application> => ({
  meta: { count: page.total_count },
  data: page._embedded.application,
});

export const applicationDependencyPageMapper = (
  page: ApplicationDependencyPage
): PageRepresentation<ApplicationDependency> => ({
  meta: { count: page.total_count },
  data: page._embedded["applications-dependency"],
});
