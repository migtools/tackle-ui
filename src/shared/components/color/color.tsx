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
import React from "react";
import { useTranslation } from "react-i18next";

import { Split, SplitItem } from "@patternfly/react-core";

import { DEFAULT_COLOR_LABELS } from "Constants";
import styles from "./color.module.scss";

export interface ColorProps {
  hex: string;
}

export const Color: React.FC<ColorProps> = ({ hex }) => {
  const { t } = useTranslation();

  const colorName = DEFAULT_COLOR_LABELS.get(hex.toLowerCase());

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
