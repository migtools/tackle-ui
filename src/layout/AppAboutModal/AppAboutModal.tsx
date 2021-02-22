import React from "react";
import {
  AboutModal,
  TextContent,
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
  return (
    <AboutModal
      isOpen={isOpen}
      onClose={onClose}
      trademark="COPYRIGHT © 2020."
      brandImageSrc={brandImage}
      brandImageAlt="Logo"
      productName=""
    >
      <TextContent>
        <TextList component="dl">
          <TextListItem component="dt">Source code</TextListItem>
          <TextListItem component="dd">some content here</TextListItem>
        </TextList>
      </TextContent>
    </AboutModal>
  );
};
