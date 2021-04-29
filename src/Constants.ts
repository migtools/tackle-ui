import {
  global_palette_blue_300 as blue,
  global_palette_green_300 as green,
  global_palette_cyan_300 as cyan,
  global_palette_purple_300 as purple,
  global_palette_light_blue_300 as lightBlue,
  global_palette_gold_300 as gold,
  global_palette_light_green_300 as lightGreen,
  global_palette_orange_300 as orange,
  global_palette_red_300 as red,
} from "@patternfly/react-tokens";

import { PageQuery } from "api/models";

export const DEFAULT_PAGINATION: PageQuery = {
  page: 1,
  perPage: 10,
};

export const DEFAULT_SELECT_MAX_HEIGHT = 200;

export const DEFAULT_COLOR_LABELS: Map<string, string> = new Map([
  [blue.value, "blue"],
  [cyan.value, "cyan"],
  [green.value, "green"],
  [orange.value, "orange"],
  [purple.value, "purple"],
  [red.value, "red"],

  [lightBlue.value, "lightBlue"],
  [gold.value, "gold"],
  [lightGreen.value, "lightGreen"],
]);
