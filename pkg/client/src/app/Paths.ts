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

  // Developer perspective
  applicationInventory = "/application-inventory",
  applicationInventory_applicationList = "/application-inventory/application-list",
  applicationInventory_manageImports = "/application-inventory/application-imports",
  applicationInventory_manageImports_details = "/application-inventory/application-imports/:importId",
  applicationInventory_assessment = "/application-inventory/assessment/:assessmentId",
  applicationInventory_review = "/application-inventory/application/:applicationId/review",

  reports = "/reports",

  controls = "/controls",
  controls_businessServices = "/controls/business-services",
  controls_stakeholders = "/controls/stakeholders",
  controls_stakeholderGroups = "/controls/stakeholder-groups",
  controls_jobFunctions = "/controls/job-functions",
  controls_tags = "/controls/tags",

  // Administrator perspective
  identities = "/identities",
  repositories = "/repositories",
  repositories_git = "/repositories/git",
  repositories_svn = "/repositories/svn",
  repositories_maven = "/repositories/maven",
  proxies = "/proxies",
}

export interface AssessmentRoute {
  assessmentId: string;
}

export interface ReviewRoute {
  applicationId: string;
}

export interface ImportSummaryRoute {
  importId: string;
}
