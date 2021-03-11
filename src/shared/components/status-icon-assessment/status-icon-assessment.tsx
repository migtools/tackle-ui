import React from "react";
import { Flex, FlexItem, SpinnerProps } from "@patternfly/react-core";
import {
  CheckCircleIcon,
  ErrorCircleOIcon,
  InProgressIcon,
} from "@patternfly/react-icons";
import { SVGIconProps } from "@patternfly/react-icons/dist/js/createIcon";
import {
  global_disabled_color_200 as disabledColor,
  global_success_color_100 as successColor,
  global_Color_dark_200 as unknownColor,
  global_info_color_200 as loadingColor,
} from "@patternfly/react-tokens";

export type StatusType = "NotStarted" | "InProgress" | "Completed";

type IconListType = {
  [key in StatusType]: {
    Icon:
      | React.ComponentClass<SVGIconProps>
      | React.FunctionComponent<SpinnerProps>;
    color: { name: string; value: string; var: string };
  };
};
const iconList: IconListType = {
  NotStarted: {
    Icon: ErrorCircleOIcon,
    color: unknownColor,
  },
  InProgress: {
    Icon: InProgressIcon,
    color: loadingColor,
  },
  Completed: {
    Icon: CheckCircleIcon,
    color: successColor,
  },
};

export interface IStatusIconAssessmentProps {
  status: StatusType;
  label?: React.ReactNode;
  isDisabled?: boolean;
  className?: string;
}

export const StatusIconAssessment: React.FunctionComponent<IStatusIconAssessmentProps> = ({
  status,
  label,
  isDisabled = false,
  className = "",
}: IStatusIconAssessmentProps) => {
  const Icon = iconList[status].Icon;
  const icon = (
    <Icon
      color={isDisabled ? disabledColor.value : iconList[status].color.value}
      className={className}
    />
  );

  if (label) {
    return (
      <Flex
        spaceItems={{ default: "spaceItemsSm" }}
        alignItems={{ default: "alignItemsCenter" }}
        flexWrap={{ default: "nowrap" }}
        style={{ whiteSpace: "nowrap" }}
        className={className}
      >
        <FlexItem>{icon}</FlexItem>
        <FlexItem>{label}</FlexItem>
      </Flex>
    );
  }
  return icon;
};
