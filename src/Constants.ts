import {
  global_palette_blue_300 as blue,
  global_palette_green_300 as green,
  global_palette_cyan_300 as cyan,
  global_palette_purple_300 as purple,
  global_palette_orange_300 as orange,
  global_palette_red_300 as red,
  global_palette_black_400 as black,
} from "@patternfly/react-tokens";

import { EffortEstimate, PageQuery, ProposedAction, Risk } from "api/models";

export const DEFAULT_PAGINATION: PageQuery = {
  page: 1,
  perPage: 10,
};

export const DEFAULT_SELECT_MAX_HEIGHT = 200;

// Colors

// t('colors.blue')
// t('colors.cyan')
// t('colors.green')
// t('colors.orange')
// t('colors.purple')
// t('colors.red')

export const DEFAULT_COLOR_LABELS: Map<string, string> = new Map([
  [blue.value, "blue"],
  [cyan.value, "cyan"],
  [green.value, "green"],
  [orange.value, "orange"],
  [purple.value, "purple"],
  [red.value, "red"],
]);

export const DEFAULT_COLOR_PALETE = [
  blue.value,
  cyan.value,
  green.value,
  orange.value,
  purple.value,
  red.value,
];

// Risks
type RiskListType = {
  [key in Risk]: {
    label: string;
    hexColor: string;
    labelColor:
      | "blue"
      | "cyan"
      | "green"
      | "orange"
      | "purple"
      | "red"
      | "grey";
    sortFactor: number;
  };
};

export const RISK_LIST: RiskListType = {
  GREEN: {
    label: "Low",
    hexColor: "#68b240",
    labelColor: "green",
    sortFactor: 1,
  },
  AMBER: {
    label: "Medium",
    hexColor: "#f0ab0b",
    labelColor: "orange",
    sortFactor: 2,
  },
  RED: {
    label: "High",
    hexColor: "#cb440d",
    labelColor: "red",
    sortFactor: 3,
  },
  UNKNOWN: {
    label: "Unknown",
    hexColor: black.value,
    labelColor: "grey",
    sortFactor: 4,
  },
};

// Proposed action
type ProposedActionListType = {
  [key in ProposedAction]: {
    label: string;
    hexColor: string;
    labelColor:
      | "blue"
      | "cyan"
      | "green"
      | "orange"
      | "purple"
      | "red"
      | "grey";
  };
};

export const PROPOSED_ACTION_LIST: ProposedActionListType = {
  rehost: {
    label: "Rehost",
    labelColor: "green",
    hexColor: green.value,
  },
  replatform: {
    label: "Replatform",
    labelColor: "orange",
    hexColor: orange.value,
  },
  refactor: {
    label: "Refactor",
    labelColor: "red",
    hexColor: "#cb440d",
  },
  repurchase: {
    label: "Repurchase",
    labelColor: "purple",
    hexColor: purple.value,
  },
  retire: {
    label: "Retire",
    labelColor: "cyan",
    hexColor: cyan.value,
  },
  retain: {
    label: "Retain",
    labelColor: "blue",
    hexColor: blue.value,
  },
};

// Effort
type EffortEstimateListType = {
  [key in EffortEstimate]: {
    label: string;
    sortFactor: number;
  };
};

export const EFFORT_ESTIMATE_LIST: EffortEstimateListType = {
  small: {
    label: "Small",
    sortFactor: 1,
  },
  medium: {
    label: "Medium",
    sortFactor: 2,
  },
  large: {
    label: "Large",
    sortFactor: 3,
  },
  extra_large: {
    label: "Extra large",
    sortFactor: 4,
  },
};

// Application toolbar

export enum ApplicationFilterKey {
  NAME = "name",
  DESCRIPTION = "description",
  BUSINESS_SERVICE = "business_service",
  TAG = "tag",
}
