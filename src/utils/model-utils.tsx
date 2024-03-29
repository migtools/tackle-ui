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
import {
  BusinessService,
  JobFunction,
  Stakeholder,
  StakeholderGroup,
  Tag,
  TagType,
} from "api/models";
import { Color, OptionWithValue } from "shared/components";

interface IModel {
  id?: string | number;
}

export const isIModelEqual = (a: IModel, b: IModel) => a.id === b.id;

// Business service dropdown

export interface IBusinessServiceDropdown
  extends Pick<BusinessService, "id" | "name"> {}

export const toIBusinessServiceDropdown = (
  value: BusinessService
): IBusinessServiceDropdown => ({
  id: value.id,
  name: value.name,
});

export const toIBusinessServiceDropdownOptionWithValue = (
  value: IBusinessServiceDropdown
): OptionWithValue<IBusinessServiceDropdown> => ({
  value,
  toString: () => value.name,
});

// Stakeholder dropdown

export interface IStakeholderDropdown
  extends Pick<Stakeholder, "id" | "displayName" | "email"> {}

export const toIStakeholderDropdown = (
  value: Stakeholder
): IStakeholderDropdown => ({
  id: value.id,
  displayName: value.displayName,
  email: value.email,
});

export const toIStakeholderDropdownOptionWithValue = (
  value: IStakeholderDropdown
): OptionWithValue<IStakeholderDropdown> => ({
  value,
  toString: () => value.displayName,
  props: {
    description: value.email,
  },
});

// Stakeholder group dropdown

export interface IStakeholderGroupDropdown
  extends Pick<StakeholderGroup, "id" | "name"> {}

export const toIStakeholderGroupDropdown = (
  value: StakeholderGroup
): IStakeholderGroupDropdown => ({
  id: value.id,
  name: value.name,
});

export const toIStakeholderGroupDropdownOptionWithValue = (
  value: IStakeholderGroupDropdown
): OptionWithValue<IStakeholderGroupDropdown> => ({
  value,
  toString: () => value.name,
});

// Job function dropdown

export interface IJobFunctionDropdown
  extends Pick<JobFunction, "id" | "role"> {}

export const toIJobFunctionDropdown = (
  value: JobFunction
): IJobFunctionDropdown => ({
  id: value.id,
  role: value.role,
});

export const toIJobFunctionDropdownOptionWithValue = (
  value: IJobFunctionDropdown
): OptionWithValue<IJobFunctionDropdown> => ({
  value,
  toString: () => value.role,
});

// TagType

export interface ITagTypeDropdown extends Pick<TagType, "id" | "name"> {}

export const toITagTypeDropdown = (value: TagType): ITagTypeDropdown => ({
  id: value.id,
  name: value.name,
});

export const toITagTypeDropdownOptionWithValue = (
  value: ITagTypeDropdown
): OptionWithValue<ITagTypeDropdown> => ({
  value,
  toString: () => value.name,
});

// Tag

export interface ITagDropdown extends Pick<Tag, "id" | "name" | "tagType"> {}

export const toITagDropdown = (value: Tag): ITagDropdown => ({
  id: value.id,
  name: value.name,
  tagType: value.tagType,
});

export const toITagDropdownOptionWithValue = (
  value: ITagDropdown
): OptionWithValue<ITagDropdown> => ({
  value,
  toString: () => value.name,
  props: {
    description: value.tagType ? value.tagType.name : "",
  },
});

// Colors

export const colorHexToOptionWithValue = (
  hex: string
): OptionWithValue<string> => ({
  value: hex,
  toString: () => hex,
  props: {
    children: <Color hex={hex} />,
  },
});

// Simple dropdown

export interface ISimpleOptionDropdown<T> {
  key: T;
  name: string;
}

export function toISimpleOptionDropdownWithValue<T>(
  value: ISimpleOptionDropdown<T>
): OptionWithValue<ISimpleOptionDropdown<T>> {
  return {
    value,
    toString: () => value.name,
  };
}
