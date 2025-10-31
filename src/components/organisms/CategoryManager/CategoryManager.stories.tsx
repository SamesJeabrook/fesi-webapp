import React, { useState } from "react";
import { CategoryManager, CategoryTag } from "./CategoryManager";

export default {
  title: "Organisms/CategoryManager",
  component: CategoryManager,
};

const initialTags: CategoryTag[] = [
  { id: "1", label: "Chicken" },
  { id: "2", label: "Fast Food" },
];

export const Default = () => {
  const [tags, setTags] = useState(initialTags);
  const handleRemove = (id: string) => setTags(tags.filter(tag => tag.id !== id));
  const handleAdd = (tag: CategoryTag) => setTags([...tags, tag]);
  return <CategoryManager tags={tags} onRemoveTag={handleRemove} onAddTag={handleAdd} />;
};
