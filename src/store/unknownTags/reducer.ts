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
import { addUnknownTagIdsToRegistry } from "./actions";

export const stateKey = "unknownTags";

export type UnknownTagsState = Readonly<{
  tagIds: Set<number>;
}>;

export const defaultState: UnknownTagsState = {
  tagIds: new Set(),
};

export type UnknownTagsAction = ActionType<typeof addUnknownTagIdsToRegistry>;

export const reducer = (
  state: UnknownTagsState = defaultState,
  action: UnknownTagsAction
): UnknownTagsState => {
  switch (action.type) {
    case getType(addUnknownTagIdsToRegistry):
      const newTagIds = new Set(state.tagIds);
      action.payload.forEach((e) => newTagIds.add(e));
      return {
        ...state,
        tagIds: newTagIds,
      };
    default:
      return state;
  }
};
