import React from "react";
import { useTranslation } from "react-i18next";

import { Split, SplitItem } from "@patternfly/react-core";
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

import styles from "./color.module.scss";

export const defaultColorsPalete = [
  blue.value,
  green.value,
  cyan.value,
  purple.value,
  lightBlue.value,
  gold.value,
  lightGreen.value,
  orange.value,
  red.value,
];

// t('colors.blue')
// t('colors.green')
// t('colors.cyan')
// t('colors.purple')
// t('colors.lightBlue')
// t('colors.gold')
// t('colors.lightGreen')
// t('colors.orange')
// t('colors.red')
const defaultColorLabels: Map<string, string> = new Map([
  [blue.value, "blue"],
  [green.value, "green"],
  [cyan.value, "cyan"],
  [purple.value, "purple"],
  [lightBlue.value, "lightBlue"],
  [gold.value, "gold"],
  [lightGreen.value, "lightGreen"],
  [orange.value, "orange"],
  [red.value, "red"],
]);

export interface ColorProps {
  hex: string;
}

export const Color: React.FC<ColorProps> = ({ hex }) => {
  const { t } = useTranslation();

  const colorName = defaultColorLabels.get(hex.toLowerCase());

  return (
    <Split hasGutter>
      <SplitItem>
        <div
          className={styles.color}
          style={{ backgroundColor: hex }}
          cy-data="color-box"
        ></div>
      </SplitItem>
      <SplitItem isFilled>
        <span cy-data="color-label">
          {colorName ? t(`colors.${colorName}`) : hex}
        </span>
      </SplitItem>
    </Split>
  );
};
