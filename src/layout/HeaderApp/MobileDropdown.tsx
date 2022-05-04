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
import React, { useState } from "react";
import { Dropdown, DropdownItem, KebabToggle } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";
import { AppAboutModal } from "../AppAboutModal";

export const MobileDropdown: React.FC = () => {
  const [isKebabDropdownOpen, setIsKebabDropdownOpen] = useState(false);
  const [isAboutModalOpen, setAboutModalOpen] = useState(false);

  const onKebabDropdownToggle = (isOpen: boolean) => {
    setIsKebabDropdownOpen(isOpen);
  };
  const onKebabDropdownSelect = () => {
    setIsKebabDropdownOpen((current) => !current);
  };

  const toggleAboutModal = () => {
    setAboutModalOpen((current) => !current);
  };

  return (
    <>
      <Dropdown
        isPlain
        position="right"
        onSelect={onKebabDropdownSelect}
        toggle={<KebabToggle onToggle={onKebabDropdownToggle} />}
        isOpen={isKebabDropdownOpen}
        dropdownItems={[
          <DropdownItem key="about" onClick={toggleAboutModal}>
            <HelpIcon />
            &nbsp;About
          </DropdownItem>,
        ]}
      />
      <AppAboutModal isOpen={isAboutModalOpen} onClose={toggleAboutModal} />
    </>
  );
};
