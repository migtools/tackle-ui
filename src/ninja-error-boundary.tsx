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
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from "@patternfly/react-core";
import { UserNinjaIcon } from "@patternfly/react-icons";

interface NinjaErrorBoundaryProps {}
interface NinjaErrorBoundaryState {
  hasError: boolean;
}

export class NinjaErrorBoundary extends React.Component<
  NinjaErrorBoundaryProps,
  NinjaErrorBoundaryState
> {
  constructor(props: NinjaErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Bullseye>
          <EmptyState variant={EmptyStateVariant.small}>
            <EmptyStateIcon icon={UserNinjaIcon} />
            <Title headingLevel="h2" size="lg">
              Ops! Something went wrong.
            </Title>
            <EmptyStateBody>
              Try to refresh your page or contact your admin.
            </EmptyStateBody>
          </EmptyState>
        </Bullseye>
      );
    }

    return this.props.children;
  }
}
