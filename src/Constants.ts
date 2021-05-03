import {
  global_palette_blue_300 as blue,
  global_palette_green_300 as green,
  global_palette_cyan_300 as cyan,
  global_palette_purple_300 as purple,
  global_palette_orange_300 as orange,
  global_palette_red_300 as red,
} from "@patternfly/react-tokens";

import { PageQuery } from "api/models";

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
