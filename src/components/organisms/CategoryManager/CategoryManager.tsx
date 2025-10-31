import React, { useEffect, useState } from "react";
import { TagGroup } from "@/components/molecules/TagGroup/TagGroup";
import { Typography, Button } from "@/components/atoms";
import styles from "./CategoryManager.module.scss";

export interface CategoryTag {
  id: string;
  label: string;
}

export interface CategoryManagerProps {
  availableTags: CategoryTag[];
  selectedTags: CategoryTag[];
  onRemoveTag: (id: string) => void;
  onAddTag: (tag: CategoryTag) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ availableTags, selectedTags, onRemoveTag, onAddTag }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(availableTags[0]?.id || "");

  useEffect(() => {
    if (availableTags.length > 0) {
      setSelectedCategory(availableTags[0].id);
    }
  }, [availableTags]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleAddTag = () => {
    const found = availableTags.find(cat => cat.id === selectedCategory);
    if (found && !selectedTags.some(tag => tag.id === found.id)) {
      onAddTag(found);
    }
  };

  return (
    <div className={styles.manager}>
      <Typography variant="heading-4" as="h3">Categories</Typography>
      <TagGroup tags={selectedTags} onRemoveTag={onRemoveTag} />
      <div className={styles.addCategoryRow}>
        <select value={selectedCategory} onChange={handleSelectChange} className={styles.categorySelect}>
          {availableTags.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
        <Button type="button" variant="secondary" onClick={handleAddTag}>Add</Button>
      </div>
    </div>
  );
}
