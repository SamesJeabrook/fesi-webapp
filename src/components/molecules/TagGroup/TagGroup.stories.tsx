import React, { useState } from "react";
import { TagGroup } from "./TagGroup";

export default {
  title: "Molecules/TagGroup",
  component: TagGroup,
};

const initialTags = [
  { id: "1", label: "Chicken" },
  { id: "2", label: "Fast Food" },
  { id: "3", label: "Burger" },
];

export const Default = () => <TagGroup tags={initialTags} />;

export const Removable = () => {
  const [tags, setTags] = useState(initialTags);
  const handleRemove = (id: string) => setTags(tags.filter(tag => tag.id !== id));
  return <TagGroup tags={tags} onRemoveTag={handleRemove} />;
};
