import React, { useState } from "react";
import { Tag, TagProps } from "@/components/atoms/Tag/Tag";
import styles from "./TagGroup.module.scss";

export interface TagGroupProps {
  tags: { label: string; id: string }[];
  onRemoveTag?: (id: string) => void;
}

export const TagGroup: React.FC<TagGroupProps> = ({ tags, onRemoveTag }) => {
  return (
    <div className={styles.tagGroup}>
      {tags.map(tag => (
        <Tag
          key={tag.id}
          label={tag.label}
          onClose={onRemoveTag ? () => onRemoveTag(tag.id) : undefined}
        />
      ))}
    </div>
  );
};
