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
import { ActionType, getType } from "typesafe-actions";
import {
  scheduleWatchBulk,
  assessmentBulkCompleted,
  reviewBulkCompleted,
} from "./actions";

export const stateKey = "bulkCopy";

export type BulkCopyState = Readonly<{
  assessmentBulk?: number;
  reviewBulk?: number;

  assessmentBulkCompleted?: boolean;
  reviewBulkCompleted?: boolean;

  assessmentBulkError?: string;
  reviewBulkError?: string;

  watching: boolean;
}>;

export const defaultState: BulkCopyState = {
  watching: false,
};

export type BulkCopyAction = ActionType<
  | typeof scheduleWatchBulk
  | typeof assessmentBulkCompleted
  | typeof reviewBulkCompleted
>;

export const reducer = (
  state: BulkCopyState = defaultState,
  action: BulkCopyAction
): BulkCopyState => {
  switch (action.type) {
    case getType(scheduleWatchBulk):
      return {
        ...state,
        assessmentBulk: action.payload.assessmentBulk,
        assessmentBulkCompleted: false,
        assessmentBulkError: undefined,

        reviewBulk: action.payload.reviewBulk,
        reviewBulkCompleted: action.payload.reviewBulk ? false : undefined,
        reviewBulkError: undefined,

        watching: true,
      };
    case getType(assessmentBulkCompleted):
      return {
        ...state,
        assessmentBulkCompleted: true,
        assessmentBulkError: action.payload.error,

        watching: state.reviewBulk ? !state.reviewBulkCompleted : false,
      };
    case getType(reviewBulkCompleted):
      return {
        ...state,
        reviewBulkCompleted: true,
        reviewBulkError: action.payload.error,

        watching: !state.assessmentBulkCompleted,
      };
    default:
      return state;
  }
};
