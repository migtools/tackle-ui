export const formatPath = (path: Paths, data: any) => {
  let url = path as string;

  for (const k of Object.keys(data)) {
    url = url.replace(":" + k, data[k]);
  }

  return url;
};

export enum Paths {
  base = "/",
  notFound = "/not-found",

  applicationInventory = "/application-inventory/",
  applicationInventory_applicationList = "/application-inventory/application-list",

  reports = "/reports",

  controls = "/controls",
  controls_businessServices = "/controls/business-services",
  controls_stakeholders = "/controls/stakeholders",
  controls_stakeholderGroups = "/controls/stakeholder-groups",
  controls_tags = "/controls/tags",
}

export interface OptionalCompanyRoute {
  company?: string;
}

export interface CompanytRoute {
  company: string;
}
