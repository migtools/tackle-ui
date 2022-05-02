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
import { useTranslation, Trans } from "react-i18next";

import {
  AboutModal,
  TextContent,
  Text,
  TextVariants,
  TextList,
  TextListItem,
} from "@patternfly/react-core";

import brandImage from "images/tackle.png";

export interface AppAboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppAboutModal: React.FC<AppAboutModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <AboutModal
      isOpen={isOpen}
      onClose={onClose}
      trademark="COPYRIGHT © 2021."
      brandImageSrc={brandImage}
      brandImageAlt="Logo"
      productName="Tackle"
    >
      <TextContent className="pf-u-py-xl">
        <Text component={TextVariants.p}>{t("about.introduction")}</Text>
        <Text component={TextVariants.p}>{t("about.description")}</Text>
        <Text component={TextVariants.p}>
          <Trans i18nKey="about.bottom1">
            Tackle is a project within the{" "}
            <Text
              component={TextVariants.a}
              href="https://www.konveyor.io/"
              target="_blank"
            >
              Konveyor community
            </Text>
            .
          </Trans>
        </Text>
        <Text component={TextVariants.p}>
          <Trans i18nKey="about.bottom2">
            For more information please refer to{" "}
            <Text
              component={TextVariants.a}
              href="https://tackle-docs.konveyor.io/"
              target="_blank"
            >
              Tackle documentation
            </Text>
            .
          </Trans>
        </Text>
      </TextContent>
      <TextContent className="pf-u-py-xl">
        <TextContent>
          <TextList component="dl">
            <TextListItem component="dt">{t("terms.version")}</TextListItem>
            <TextListItem component="dd">1.2.0</TextListItem>
          </TextList>
        </TextContent>
      </TextContent>
    </AboutModal>
  );
};
