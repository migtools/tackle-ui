import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

import { ConditionalRender, EmptyTextMessage } from "shared/components";

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
  const { t } = useTranslation();

  const [tagTypes, setTagTypes] = useState<Map<number, TagType>>(new Map()); // <tagTypeId, tagType>
  const [tags, setTags] = useState<Map<number, Tag[]>>(new Map()); // <tagTypeId, tags[]>

  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<AxiosError>();

  useEffect(() => {
    if (application.tags) {
      setIsFetching(true);

      Promise.all(application.tags.map((f) => getTagById(f)))
        .then((tags) => {
          const newTagTypes: Map<number, TagType> = new Map();
          const newTags: Map<number, Tag[]> = new Map();

          tags
            .map((f) => f.data)
            .forEach((e) => {
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

          setTagTypes(newTagTypes);
          setTags(newTags);

          setIsFetching(false);
          setFetchError(undefined);
        })
        .catch((error) => {
          setIsFetching(false);
          setFetchError(error);
        });
    }
  }, [application]);

  if (fetchError) {
    return <EmptyTextMessage message={t("terms.notAvailable")} />;
  }

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
