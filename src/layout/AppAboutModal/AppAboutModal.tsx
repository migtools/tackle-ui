import React from "react";
import {
  AboutModal,
  TextContent,
  Text,
  TextVariants,
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
  return (
    <AboutModal
      isOpen={isOpen}
      onClose={onClose}
      trademark="COPYRIGHT © 2021."
      brandImageSrc={brandImage}
      brandImageAlt="Logo"
      productName="Tackle"
    >
      <TextContent>
        <Text component={TextVariants.p}>
          Tackle is a collection of tools that supports large-scale application
          modernization and migration projects to Kubernetes.
        </Text>
        <Text component={TextVariants.p}>
          Tackle allows users to maintain their portfolio of applications with a
          full set of metadata and to assess their suitability for modernization
          leveraging a questionnaire based approach.
        </Text>
        <Text component={TextVariants.p}>
          Tackle is a project within the{" "}
          <Text
            component={TextVariants.a}
            href="https://www.konveyor.io/"
            target="_blank"
          >
            Konveyor community
          </Text>
          .
        </Text>
        <Text component={TextVariants.p}>
          For more information please refer to{" "}
          <Text
            component={TextVariants.a}
            href="https://tackle-docs.konveyor.io/"
            target="_blank"
          >
            Tackle documentation
          </Text>
          .
        </Text>
      </TextContent>
    </AboutModal>
  );
};
