import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { unknownTagsActions } from "store/unknownTags";

import { ConditionalRender } from "shared/components";

import { Application, Tag, TagType } from "api/models";
import { getTagById } from "api/rest";
import {
  Label,
  LabelGroup,
  Spinner,
  Split,
  SplitItem,
} from "@patternfly/react-core";
import { DEFAULT_COLOR_LABELS } from "Constants";

export interface ApplicationTagsProps {
  application: Application;
}

export const ApplicationTags: React.FC<ApplicationTagsProps> = ({
  application,
}) => {
  const dispatch = useDispatch();

  const [tagTypes, setTagTypes] = useState<Map<number, TagType>>(new Map()); // <tagTypeId, tagType>
  const [tags, setTags] = useState<Map<number, Tag[]>>(new Map()); // <tagTypeId, tags[]>
  const [unknownTagIds, setUnknownTagIds] = useState<number[]>([]);

  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (application.tags) {
      setIsFetching(true);

      Promise.all(
        application.tags
          .map((f) => getTagById(f))
          .map((p) => p.catch(() => null))
      )
        .then((tags) => {
          const newTagTypes: Map<number, TagType> = new Map();
          const newTags: Map<number, Tag[]> = new Map();

          const validResponses = tags.reduce((prev, current) => {
            if (current) {
              return [...prev, current.data];
            } else {
              return prev;
            }
          }, [] as Tag[]);

          const newUnknownTags = application.tags
            ?.filter((e) => validResponses.findIndex((v) => `${v.id}` !== e))
            .map((e) => Number(e));

          validResponses.forEach((e) => {
            const tagType = e.tagType;
            if (tagType) {
              // Tag types
              newTagTypes.set(tagType.id!, tagType);

              // Tags
              newTags.set(tagType.id!, [
                ...(newTags.get(tagType.id!) || []),
                e,
              ]);
            }
          });

          setUnknownTagIds(newUnknownTags || []);
          setTagTypes(newTagTypes);
          setTags(newTags);

          setIsFetching(false);
        })
        .catch(() => {
          setIsFetching(false);
        });
    }
  }, [application]);

  useEffect(() => {
    dispatch(unknownTagsActions.addUnknownTagIdsToRegistry(unknownTagIds));
  }, [unknownTagIds, dispatch]);

  return (
    <ConditionalRender when={isFetching} then={<Spinner isSVG size="md" />}>
      <Split hasGutter>
        {Array.from(tagTypes.values())
          .sort((a, b) => (a.rank || 0) - (b.rank || 0))
          .map((tagType) => {
            return (
              <SplitItem key={tagType.id}>
                <LabelGroup numLabels={10}>
                  {tags
                    .get(tagType.id!)
                    ?.sort((a, b) => a.name.localeCompare(b.name))
                    .map((tag) => {
                      const colorLabel = DEFAULT_COLOR_LABELS.get(
                        tagType?.colour || ""
                      );

                      return (
                        <Label key={tag.id} color={colorLabel as any}>
                          {tag.name}
                        </Label>
                      );
                    })}
                </LabelGroup>
              </SplitItem>
            );
          })}
      </Split>
    </ConditionalRender>
  );
};
