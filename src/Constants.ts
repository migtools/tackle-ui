/*
Copyright © 2021 the Konveyor Contributors (https://konveyor.io/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
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
    i18Key: string;
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

// t('risks.low')
// t('risks.medium')
// t('risks.high')
// t('risks.unknown')

export const RISK_LIST: RiskListType = {
  GREEN: {
    i18Key: "risks.low",
    hexColor: "#68b240",
    labelColor: "green",
    sortFactor: 1,
  },
  AMBER: {
    i18Key: "risks.medium",
    hexColor: "#f0ab0b",
    labelColor: "orange",
    sortFactor: 2,
  },
  RED: {
    i18Key: "risks.high",
    hexColor: "#cb440d",
    labelColor: "red",
    sortFactor: 3,
  },
  UNKNOWN: {
    i18Key: "risks.unknown",
    hexColor: black.value,
    labelColor: "grey",
    sortFactor: 4,
  },
};

// Proposed action
type ProposedActionListType = {
  [key in ProposedAction]: {
    i18Key: string;
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

// t('proposedActions.rehost')
// t('proposedActions.replatform')
// t('proposedActions.refactor')
// t('proposedActions.repurchase')
// t('proposedActions.retire')
// t('proposedActions.retain')

export const PROPOSED_ACTION_LIST: ProposedActionListType = {
  rehost: {
    i18Key: "proposedActions.rehost",
    labelColor: "green",
    hexColor: green.value,
  },
  replatform: {
    i18Key: "proposedActions.replatform",
    labelColor: "orange",
    hexColor: orange.value,
  },
  refactor: {
    i18Key: "proposedActions.refactor",
    labelColor: "red",
    hexColor: "#cb440d",
  },
  repurchase: {
    i18Key: "proposedActions.repurchase",
    labelColor: "purple",
    hexColor: purple.value,
  },
  retire: {
    i18Key: "proposedActions.retire",
    labelColor: "cyan",
    hexColor: cyan.value,
  },
  retain: {
    i18Key: "proposedActions.retain",
    labelColor: "blue",
    hexColor: blue.value,
  },
};

// Effort
type EffortEstimateListType = {
  [key in EffortEstimate]: {
    i18Key: string;
    sortFactor: number;
    size: number;
  };
};

// t('efforts.small')
// t('efforts.medium')
// t('efforts.large')
// t('efforts.extraLarge')

export const EFFORT_ESTIMATE_LIST: EffortEstimateListType = {
  small: {
    i18Key: "efforts.small",
    sortFactor: 1,
    size: 10,
  },
  medium: {
    i18Key: "efforts.medium",
    sortFactor: 2,
    size: 20,
  },
  large: {
    i18Key: "efforts.large",
    sortFactor: 3,
    size: 30,
  },
  extra_large: {
    i18Key: "efforts.extraLarge",
    sortFactor: 4,
    size: 40,
  },
};

// Application toolbar

export enum ApplicationFilterKey {
  NAME = "name",
  DESCRIPTION = "description",
  BUSINESS_SERVICE = "business_service",
  TAG = "tag",
}
