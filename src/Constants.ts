import {
  global_palette_blue_300 as blue,
  global_palette_green_300 as green,
  global_palette_cyan_300 as cyan,
  global_palette_purple_300 as purple,
  global_palette_orange_300 as orange,
  global_palette_red_300 as red,
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
}

export const DEFAULT_RISK_LABELS: Map<Risk, RiskData> = new Map([
  ["GREEN", { label: "Low", order: 1 }],
  ["AMBER", { label: "Medium", order: 2 }],
  ["RED", { label: "High", order: 3 }],
  ["UNKNOWN", { label: "Unknown", order: 4 }],
]);

// Review

export const DEFAULT_PROPOSED_ACTIONS: Map<string, string> = new Map([
  ["rehost", "Rehost"],
  ["replatform", "Replatform"],
  ["refactor", "Refactor"],
  ["repurchase", "Repurchase"],
  ["retire", "Retire"],
  ["retain", "Retain"],
]);

export const DEFAULT_EFFORTS: Map<string, string> = new Map([
  ["small", "Small"],
  ["medium", "Medium"],
  ["large", "Large"],
  ["extra_large", "Extra large"],
]);

// Application toolbar

export enum ApplicationFilterKey {
  NAME = "name",
  DESCRIPTION = "description",
  BUSINESS_SERVICE = "business_service",
  TAG = "tag",
}
