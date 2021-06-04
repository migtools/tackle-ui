import {
  global_palette_blue_300 as blue,
  global_palette_green_300 as green,
  global_palette_cyan_300 as cyan,
  global_palette_purple_300 as purple,
  global_palette_orange_300 as orange,
  global_palette_red_300 as red,
  global_palette_black_400 as black,
} from "@patternfly/react-tokens";

import { PageQuery, Risk } from "api/models";

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

interface RiskData {
  label: string;
  order: number;
  color: string;
}

export const DEFAULT_RISK_LABELS: Map<Risk, RiskData> = new Map([
  ["GREEN", { label: "Low", order: 1, color: "#68b240" }],
  ["AMBER", { label: "Medium", order: 2, color: "#f0ab0b" }],
  ["RED", { label: "High", order: 3, color: "#cb440d" }],
  ["UNKNOWN", { label: "Unknown", order: 4, color: black.value }],
]);

// Review

export enum ProposedAction {
  REHOST = "rehost",
  REPLATFORM = "replatform",
  REFACTOR = "refactor",
  REPURCHASE = "repurchase",
  RETIRE = "retire",
  RETAIN = "retain",
}

export const DEFAULT_PROPOSED_ACTIONS: Map<ProposedAction, string> = new Map([
  [ProposedAction.REHOST, "Rehost"],
  [ProposedAction.REPLATFORM, "Replatform"],
  [ProposedAction.REFACTOR, "Refactor"],
  [ProposedAction.REPURCHASE, "Repurchase"],
  [ProposedAction.RETIRE, "Retire"],
  [ProposedAction.RETAIN, "Retain"],
]);

export enum Effort {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  EXTRA_LARGE = "extra_large",
}

export interface EffortData {
  label: string;
  factor: number;
}

export const DEFAULT_EFFORTS: Map<Effort, EffortData> = new Map([
  [Effort.SMALL, { label: "Small", factor: 1 }],
  [Effort.MEDIUM, { label: "Medium", factor: 2 }],
  [Effort.LARGE, { label: "Large", factor: 3 }],
  [Effort.EXTRA_LARGE, { label: "Extra large", factor: 4 }],
]);

// Application toolbar

export enum ApplicationFilterKey {
  NAME = "name",
  DESCRIPTION = "description",
  BUSINESS_SERVICE = "business_service",
  TAG = "tag",
}
